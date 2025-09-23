"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newVec3From = newVec3From;
exports.add = add;
exports.subtract = subtract;
exports.multiplyVecs = multiplyVecs;
exports.multiply = multiply;
exports.divide = divide;
exports.dot = dot;
exports.cross = cross;
exports.unitVecFrom = unitVecFrom;
exports.randomInUnitSphere = randomInUnitSphere;
exports.reflect = reflect;
var Vec3_1 = require("./Vec3");
function newVec3From(v1) {
    return new Vec3_1.Vec3(v1.x(), v1.y(), v1.z());
}
function add(v1, v2) {
    return newVec3From(v1).add(v2);
}
function subtract(v1, v2) {
    return newVec3From(v1).subtract(v2);
}
function multiplyVecs(v1, v2) {
    return newVec3From(v1).multiply(v2);
}
function multiply(v1, t) {
    return newVec3From(v1).scale(t);
}
function divide(v1, t) {
    return newVec3From(v1).scale(1 / t);
}
function dot(v1, v2) {
    var product = newVec3From(v1).multiply(v2);
    return product.x() + product.y() + product.z();
}
function cross(v1, v2) {
    // TBC
}
function unitVecFrom(v1) {
    return divide(v1, v1.length());
}
function randomInUnitSphere() {
    var unit = new Vec3_1.Vec3(1, 1, 1);
    var p = (new Vec3_1.Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    while (p.lengthSquared() >= 1) {
        p = (new Vec3_1.Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    }
    return p;
}
function reflect(v1, normal) {
    var bLength = dot(v1, normal);
    var b = multiply(normal, bLength);
    return subtract(v1, b.scale(2));
}
