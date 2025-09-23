"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metal = exports.Lambertian = exports.Material = void 0;
var Ray_1 = require("./Ray");
var Vec3_1 = require("./Vec3");
var utils_1 = require("./utils");
var Material = /** @class */ (function () {
    function Material() {
    }
    return Material;
}());
exports.Material = Material;
// the basic diffuse material
var Lambertian = /** @class */ (function () {
    function Lambertian(a) {
        this.albedo = a;
        this.scattered = new Ray_1.Ray(new Vec3_1.Vec3(0, 0, 0), new Vec3_1.Vec3(0, 0, 0));
    }
    Lambertian.prototype.scatter = function (rayIn, hitRecord, attenuation, scattered) {
        var target = (0, utils_1.randomInUnitSphere)().add((0, utils_1.add)(hitRecord.p, hitRecord.normal));
        this.scattered = new Ray_1.Ray(hitRecord.p, (0, utils_1.subtract)(target, hitRecord.p));
        return true;
    };
    return Lambertian;
}());
exports.Lambertian = Lambertian;
var Metal = /** @class */ (function () {
    function Metal(a) {
        this.albedo = a;
        this.scattered = new Ray_1.Ray(new Vec3_1.Vec3(0, 0, 0), new Vec3_1.Vec3(0, 0, 0));
    }
    Metal.prototype.scatter = function (rayIn, hitRecord, attenuation, scattered) {
        var reflected = (0, utils_1.reflect)((0, utils_1.unitVecFrom)(rayIn.direction()), hitRecord.normal);
        this.scattered = new Ray_1.Ray(hitRecord.p, reflected);
        return (0, utils_1.dot)(this.scattered.direction(), hitRecord.normal) > 0;
    };
    return Metal;
}());
exports.Metal = Metal;
