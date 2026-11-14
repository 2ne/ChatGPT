/**
 * Replace Three.js camera-depth fog with world-XZ falloff around both rooms.
 * A top-down camera has nearly equal depth across the screen, so linear depth fog
 * is invisible — XZ distance makes the exterior fade like a classic “bigger world” trick.
 *
 * Uses distance beyond each room's rectangular walls. Both interiors stay
 * clear, with a wider, gentler falloff across the exterior apron.
 *
 * Room 1's northward falloff is stretched to keep the connecting walk readable.
 *
 * Call installWorldXzFog() once before any material compiles a shader.
 */
import * as THREE from 'three';
import { BAY_CX, ROOM1_HALF, ROOM2_CZ, ROOM2_HX, ROOM2_HZ } from './facility-exterior.js';

/**
 * North Z scale for Chebyshev fog (<1 → fog starts further north).
 * Preserve the longer clear approach from Room 1 toward the bay entrance.
 */
export const FOG_NORTH_EASE = 0.52;

// Clear apron / fully faded distance beyond the wall, in world units.
// Room 1 previously faded from 0.35 to 11; retain more of its nearby exterior.
const ROOM1_FADE = { near: 1.5, far: 15 };
const BAY_FADE = { near: 3, far: 20 };

export function installWorldXzFog() {
  THREE.ShaderChunk.fog_pars_vertex = /* glsl */`
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec2 vFogWorldXZ;
#endif
`;

  // Send world coordinates, not a precomputed distance. Computing the falloff
  // per fragment avoids fog smearing across large floor triangles and corners.
  // FogExp2 (title scene) keeps stock camera-depth so the menu is unchanged.
  // North ease: compress |z| when z < 0 so room-2’s near edge shows through.
  THREE.ShaderChunk.fog_vertex = /* glsl */`
#ifdef USE_FOG
  #ifdef FOG_EXP2
  vFogDepth = - mvPosition.z;
  #else
  vec4 fogWorldPos = vec4(position, 1.0);
  #ifdef USE_INSTANCING
  fogWorldPos = instanceMatrix * fogWorldPos;
  #endif
  fogWorldPos = modelMatrix * fogWorldPos;
  vFogWorldXZ = fogWorldPos.xz;
  #endif
#endif
`;

  THREE.ShaderChunk.fog_pars_fragment = /* glsl */`
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec2 vFogWorldXZ;
  #ifdef FOG_EXP2
  uniform float fogDensity;
  #else
  uniform float fogNear;
  uniform float fogFar;
  #endif
#endif
`;

  THREE.ShaderChunk.fog_fragment = /* glsl */`
#ifdef USE_FOG
  #ifdef FOG_EXP2
  float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
  float room1Z = vFogWorldXZ.y < 0.0
    ? -vFogWorldXZ.y * ${FOG_NORTH_EASE.toFixed(3)} : vFogWorldXZ.y;
  float room1Outside = max(abs(vFogWorldXZ.x), room1Z) - ${ROOM1_HALF.toFixed(3)};
  vec2 bayOutside = abs(vFogWorldXZ - vec2(${BAY_CX.toFixed(3)}, ${ROOM2_CZ.toFixed(3)}))
    - vec2(${ROOM2_HX.toFixed(3)}, ${ROOM2_HZ.toFixed(3)});
  float room1Fade = (room1Outside - ${ROOM1_FADE.near.toFixed(3)})
    / ${(ROOM1_FADE.far - ROOM1_FADE.near).toFixed(3)};
  float bayFade = (max(bayOutside.x, bayOutside.y) - ${BAY_FADE.near.toFixed(3)})
    / ${(BAY_FADE.far - BAY_FADE.near).toFixed(3)};
  // The nearer clear room wins, keeping the connecting walk readable without
  // disabling fog or shifting the fade when the player changes rooms.
  float fogFactor = smoothstep(fogNear, fogFar, min(room1Fade, bayFade));
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif
`;
}
