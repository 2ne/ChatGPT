import * as THREE from 'three';

/** The same paired accelerator rails on the operator and upgrade card. */
export function addRailgunRails(parent) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xc4d6dc, metalness: 0.6, roughness: 0.4 });
  const energy = new THREE.MeshStandardMaterial({ color: 0x80edff, emissive: 0x38cfff, emissiveIntensity: 1.4 });
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.11, 0.65), metal);
    rail.position.set(side * 0.15, 0.06, 0.94); group.add(rail);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.57), energy);
    strip.position.set(side * 0.15, 0.125, 0.94); group.add(strip);
  }
  parent.add(group);
  return group;
}
