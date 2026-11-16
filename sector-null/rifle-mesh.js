// Shared preview rifle silhouette. Callers supply materials and their box builder.
// Reloadable magazine and upgrade effects remain owned by their animated rigs.
export function addRifleShell(gun, M, blk) {
  blk(M.rubber, 0.13, 0.19, 0.04, 0, -0.02, 0.02, gun, 0.01);     // butt pad
  blk(M.gunBody, 0.12, 0.17, 0.24, 0, -0.02, 0.15, gun);             // stock
  blk(M.gunBody, 0.1, 0.2, 0.1, 0, -0.11, 0.29, gun).rotation.x = 0.35; // pistol grip
  blk(M.metal, 0.14, 0.15, 0.4, 0, 0.03, 0.44, gun);              // receiver
  blk(M.metal, 0.04, 0.03, 0.12, 0, -0.07, 0.37, gun, 0.01);      // trigger guard
  blk(M.status, 0.04, 0.2, 0.02, 0, -0.14, 0.595, gun, 0.004); // cell charge stripe
  blk(M.gunBody, 0.13, 0.13, 0.36, 0, 0.01, 0.8, gun);               // handguard
  blk(M.metal, 0.06, 0.06, 0.46, 0, 0.03, 1.18, gun, 0.015);      // barrel
  blk(M.metal, 0.085, 0.085, 0.08, 0, 0.03, 1.42, gun, 0.015);    // muzzle brake
  blk(M.metal, 0.03, 0.07, 0.03, 0, 0.09, 1.34, gun, 0.008);      // front sight
  // White barrel shroud, orange muzzle collar and cyan top energy rail.
  blk(M.suit, 0.18, 0.075, 0.45, 0, 0.11, 0.99, gun, 0.018);
  blk(M.trim, 0.19, 0.18, 0.07, 0, 0.025, 1.23, gun, 0.018);
  blk(M.rubber, 0.13, 0.065, 0.42, 0, 0.14, 0.57, gun, 0.012);
  blk(M.status, 0.075, 0.025, 0.31, 0, 0.185, 0.59, gun, 0.006);
  for (const x of [-0.094, 0.094]) {
    blk(M.plating, 0.02, 0.11, 0.3, x, 0.005, 0.94, gun, 0.006);
  }
  
}
