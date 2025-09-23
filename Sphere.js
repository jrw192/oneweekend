"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sphere = void 0;
var utils_1 = require("./utils");
var Sphere = /** @class */ (function () {
    function Sphere(cen, r, m) {
        this.center = cen;
        this.radius = r;
        this.material = m;
    }
    Sphere.prototype.hit = function (ray, tMin, tMax, rec) {
        var oc = (0, utils_1.subtract)(ray.origin(), this.center);
        var a = (0, utils_1.dot)(ray.direction(), ray.direction());
        var b = 2 * (0, utils_1.dot)(oc, ray.direction());
        var c = (0, utils_1.dot)(oc, oc) - (this.radius * this.radius);
        var discriminant = b * b - 4 * a * c;
        if (discriminant > 0) {
            // hit
            var t = (-b - Math.sqrt(discriminant)) / (2 * a);
            if (t > tMin && t < tMax) {
                rec.t = t;
                rec.p = ray.pointAtParameter(t);
                rec.normal = (0, utils_1.divide)((0, utils_1.subtract)(rec.p, this.center), this.radius);
                return true;
            }
        }
        return false;
    };
    return Sphere;
}());
exports.Sphere = Sphere;
