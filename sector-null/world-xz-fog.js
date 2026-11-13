/**
 * Replace Three.js camera-depth fog with world-XZ falloff from the room centre.
 * A top-down camera has nearly equal depth across the screen, so linear depth fog
 * is invisible — XZ distance makes the exterior fade like a classic “bigger world” trick.
 *
 * Uses Chebyshev distance max(|x|,|z|) so fog starts just outside the axis-aligned
 * room walls (not past the corners first, as pure radial would).
 *
 * Call installWorldXzFog() once before any material compiles a shader.
 */
import * as THREE from 'three';

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
  vFogDepth = max(abs(fogWorldPos.x), abs(fogWorldPos.z));
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

  // Same mix as stock fog_fragment — only vFogDepth’s meaning changed.
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
