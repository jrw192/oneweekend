"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var Vec3_1 = require("./Vec3");
var Ray_1 = require("./Ray");
var utils_1 = require("./utils");
var Hitable_1 = require("./Hitable");
var Sphere_1 = require("./Sphere");
var Camera_1 = require("./Camera");
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
function color(r, world) {
    var hitRecord = { t: 0, p: new Vec3_1.Vec3(0, 0, 0), normal: new Vec3_1.Vec3(0, 0, 0) };
    // color surface of spheres
    if (world.hit(r, 0.001, Number.MAX_VALUE, hitRecord)) {
        var target = (0, utils_1.randomInUnitSphere)().add((0, utils_1.add)(hitRecord.p, hitRecord.normal));
        var col = color(new Ray_1.Ray(hitRecord.p, (0, utils_1.subtract)(target, hitRecord.p)), world);
        return col.scale(0.5);
    }
    else {
        var unitDir = (0, utils_1.unitVecFrom)(r.direction());
        var t = 0.5 * (unitDir.y() + 1.0);
        // linear interpolation for background
        return (0, utils_1.add)((0, utils_1.multiply)(new Vec3_1.Vec3(1, 1, 1), 1 - t), (0, utils_1.multiply)(new Vec3_1.Vec3(.5, .7, 1), t));
    }
}
function main() {
    console.log('hi');
    var nx = 200;
    var ny = 100;
    var ns = 100;
    fs.appendFileSync('./image.ppm', "P3\n".concat(nx, " ").concat(ny, "\n255\n"));
    var list = [];
    list.push(new Sphere_1.Sphere(new Vec3_1.Vec3(0, 0, -1), 0.5));
    list.push(new Sphere_1.Sphere(new Vec3_1.Vec3(0, -100.5, -1), 100));
    var world = new Hitable_1.HitableList(list, 2);
    var camera = new Camera_1.Camera();
    for (var j = ny - 1; j >= 0; j--) {
        for (var i = 0; i < nx; i++) {
            var col = new Vec3_1.Vec3(0, 0, 0);
            for (var s = 0; s < ns; s++) {
                var u = (i + Math.random()) / nx;
                var v = (j + Math.random()) / ny;
                var ray = camera.getRay(u, v);
                col.add(color(ray, world));
            }
            col.scale(1 / ns);
            col = new Vec3_1.Vec3(Math.sqrt(col.r()), Math.sqrt(col.g()), Math.sqrt(col.b()));
            var ir = Math.floor(255.99 * col.x());
            var ig = Math.floor(255.99 * col.y());
            var ib = Math.floor(255.99 * col.z());
            fs.appendFileSync('./image.ppm', "".concat(ir, " ").concat(ig, " ").concat(ib, "\n"));
        }
    }
}
main();
