"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var Vec3_1 = require("./Vec3");
var Ray_1 = require("./Ray");
var utils_1 = require("./utils");
function hitSphere(center, radius, ray) {
    var oc = (0, utils_1.subtract)(ray.origin(), center);
    var a = (0, utils_1.dot)(ray.direction(), ray.direction());
    var b = 2 * (0, utils_1.dot)(oc, ray.direction());
    var c = (0, utils_1.dot)(oc, oc) - (radius * radius);
    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        // no hit
        return -1;
    }
    // return hit point
    return (-b - Math.sqrt(discriminant)) / (2 * a);
}
function color(r) {
    // color surface of sphere red
    var t = hitSphere(new Vec3_1.Vec3(0, 0, -1), 0.5, r);
    if (t > 0) {
        // (hit point) - (sphere center)
        var normalDir = (0, utils_1.subtract)(r.pointAtParameter(t), new Vec3_1.Vec3(0, 0, -1));
        var N = (0, utils_1.unitVecFrom)(normalDir);
        return (0, utils_1.multiply)(new Vec3_1.Vec3(N.x() + 1, N.y() + 1, N.z() + 1), 0.5);
    }
    else {
        var unitDir = (0, utils_1.unitVecFrom)(r.direction());
        t = 0.5 * (unitDir.y() + 1.0);
        // linear interpolation for background
        return (0, utils_1.add)((0, utils_1.multiply)(new Vec3_1.Vec3(1, 1, 1), 1 - t), (0, utils_1.multiply)(new Vec3_1.Vec3(.5, .7, 1), t));
    }
}
function main() {
    console.log('hi');
    var nx = 200;
    var ny = 100;
    fs.appendFileSync('./image.ppm', "P3\n".concat(nx, " ").concat(ny, "\n255\n"));
    var bottomLeft = new Vec3_1.Vec3(-2, -1, -1);
    var horiz = new Vec3_1.Vec3(4, 0, 0);
    var vert = new Vec3_1.Vec3(0, 2, 0);
    var origin = new Vec3_1.Vec3(0, 0, 0);
    for (var j = ny - 1; j >= 0; j--) {
        for (var i = 0; i < nx; i++) {
            var u = i / nx;
            var v = j / ny;
            var direction = (0, utils_1.add)((0, utils_1.add)((0, utils_1.multiply)(horiz, u), bottomLeft), (0, utils_1.multiply)(vert, v));
            var ray = new Ray_1.Ray(origin, direction);
            var col = color(ray);
            var ir = Math.floor(255.99 * col.x());
            var ig = Math.floor(255.99 * col.y());
            var ib = Math.floor(255.99 * col.z());
            fs.appendFileSync('./image.ppm', "".concat(ir, " ").concat(ig, " ").concat(ib, "\n"));
        }
    }
}
main();
