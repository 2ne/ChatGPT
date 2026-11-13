/**
 * Replace Three.js camera-depth fog with world-XZ falloff from the room centre.
 * A top-down camera has nearly equal depth across the screen, so linear depth fog
 * is invisible — XZ distance makes the exterior fade like a classic “bigger world” trick.
 *
 * Uses Chebyshev distance max(|x|,|z|) so fog starts just outside the axis-aligned
 * room walls (not past the corners first, as pure radial would).
 *
 * North (negative Z) is eased so Stage-2 room-2’s south edge stays readable while
 * east/south/west outskirts still fall off hard.
 *
 * Call installWorldXzFog() once before any material compiles a shader.
 */
import * as THREE from 'three';

/**
 * North Z scale for Chebyshev fog (<1 → fog starts further north).
 * Tuned so room-2’s south wall (~z=-25) is only a faint hint at the top of the
 * gameplay view; east/south/west outskirts still fall off hard.
 */
export const FOG_NORTH_EASE = 0.52;

/**
 * @param {number} roomHalf  Room half-extent (matches game HALF).
 * @param {number} nearPad   World units past the wall before fog begins.
 * @param {number} farPad    World units past the wall where fog hits full (black).
 */
export function playFogRange(roomHalf, nearPad = 0.35, farPad = 11) {
  return { near: roomHalf + nearPad, far: roomHalf + farPad };
}

export function installWorldXzFog() {
  THREE.ShaderChunk.fog_pars_vertex = /* glsl */`
#ifdef USE_FOG
  varying float vFogDepth;
#endif
`;

  // Linear gameplay fog: world-XZ Chebyshev from room centre (top-down “bigger map”).
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
  float fogAx = abs(fogWorldPos.x);
  float fogAz = fogWorldPos.z < 0.0
    ? (-fogWorldPos.z) * ${FOG_NORTH_EASE.toFixed(3)}
    : fogWorldPos.z;
  vFogDepth = max(fogAx, fogAz);
  #endif
#endif
`;

  THREE.ShaderChunk.fog_pars_fragment = /* glsl */`
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
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
  float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif
`;
}
