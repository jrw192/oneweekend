"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ray = void 0;
var Vec3_1 = require("./Vec3");
var utils_1 = require("./utils");
var Ray = /** @class */ (function () {
    function Ray(a, b) {
        this.A = new Vec3_1.Vec3(a.x(), a.y(), a.z());
        this.B = new Vec3_1.Vec3(b.x(), b.y(), b.z());
    }
    Ray.prototype.origin = function () {
        return this.A;
    };
    Ray.prototype.direction = function () {
        return this.B;
    };
    Ray.prototype.pointAtParameter = function (t) {
        return (0, utils_1.add)(this.A, (0, utils_1.multiply)(this.B, t));
    };
    return Ray;
}());
exports.Ray = Ray;
