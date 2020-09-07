//_______________________________________________________________________
//
//                          RNJesus
//_______________________________________________________________________
// Box Mullet Transform RNG
// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
// ---
// for singapore
// minx = 1.239808
// miny = 103.670679
// maxx = 1.462897
// maxy = 103.972252
// centre_x = 1.289832
// centre_y = 103.845270
exports.random = (n, min_x, min_y, max_x, max_y, centre_x, centre_y) => {
    const sigma = 1;
    const mean = 1;

    const transformConst = 4;
    const transformX = (max_x - min_x) / transformConst;
    const offsetX = (max_x + min_x) / 2;
    const transformY = (max_y - min_y) / transformConst;
    const offsetY = (max_y + min_y) / 2;

    let x = new Array(n);
    let y = new Array(n);

    for (i = 0; i < n; i++) {
        u1 = Math.random();
        u2 = Math.random();

        R = Math.sqrt(-2 * Math.log(u1));
        theta = 2 * Math.PI * u2;

        z1 = R * Math.cos(theta);
        z2 = R * Math.sin(theta);

        x[i] = (z1 * sigma + mean) * transformX + offsetX;
        y[i] = (z2 * sigma + mean) * transformY + offsetY;
    }
    return [x, y];
};
