"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec3 = void 0;
var Vec3 = /** @class */ (function () {
    function Vec3(e0, e1, e2) {
        this.e = [e0, e1, e2];
    }
    Vec3.prototype.x = function () { return this.e[0]; };
    Vec3.prototype.y = function () { return this.e[1]; };
    Vec3.prototype.z = function () { return this.e[2]; };
    Vec3.prototype.r = function () { return this.e[0]; };
    Vec3.prototype.g = function () { return this.e[1]; };
    Vec3.prototype.b = function () { return this.e[2]; };
    Vec3.prototype.get = function () {
        return new Vec3(this.e[0], this.e[1], this.e[2]);
    };
    Vec3.prototype.getInverse = function () {
        return new Vec3(-this.e[0], -this.e[1], -this.e[2]);
    };
    Vec3.prototype.getAt = function (i) {
        return this.e[i];
    };
    Vec3.prototype.add = function (v) {
        this.e[0] += v.e[0];
        this.e[1] += v.e[1];
        this.e[2] += v.e[2];
        return this.get();
    };
    Vec3.prototype.subtract = function (v) {
        this.e[0] -= v.e[0];
        this.e[1] -= v.e[1];
        this.e[2] -= v.e[2];
        return this.get();
    };
    Vec3.prototype.scale = function (t) {
        this.e[0] *= t;
        this.e[1] *= t;
        this.e[2] *= t;
        return this.get();
    };
    Vec3.prototype.multiply = function (v) {
        this.e[0] *= v.e[0];
        this.e[1] *= v.e[1];
        this.e[2] *= v.e[2];
        return this.get();
    };
    Vec3.prototype.divide = function (v) {
        this.e[0] /= v.e[0];
        this.e[1] /= v.e[1];
        this.e[2] /= v.e[2];
        return this.get();
    };
    Vec3.prototype.length = function () {
        return Math.sqrt(this.lengthSquared());
    };
    Vec3.prototype.lengthSquared = function () {
        return Math.pow(this.e[0], 2)
            + Math.pow(this.e[1], 2)
            + Math.pow(this.e[2], 2);
    };
    Vec3.prototype.nearZero = function () {
        var s = 1e-8;
        return (Math.abs(this.e[0]) < s) &&
            (Math.abs(this.e[1]) < s) &&
            (Math.abs(this.e[2]) < s);
    };
    return Vec3;
}());
exports.Vec3 = Vec3;
