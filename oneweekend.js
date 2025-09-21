var fs = require('fs');
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
/* --------------- UTILITY FUNCTIONS --------------- */
function newVec3From(v1) {
    return new Vec3(v1.x(), v1.y(), v1.z());
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
var Ray = /** @class */ (function () {
    function Ray(a, b) {
        this.A = new Vec3(a.x(), a.y(), a.z());
        this.B = new Vec3(b.x(), b.y(), b.z());
    }
    Ray.prototype.origin = function () {
        return this.A;
    };
    Ray.prototype.direction = function () {
        return this.B;
    };
    Ray.prototype.pointAtParameter = function (t) {
        return add(this.A, multiply(this.B, t));
    };
    return Ray;
}());
function hitSphere(center, radius, ray) {
    var oc = subtract(ray.origin(), center);
    var a = dot(ray.direction(), ray.direction());
    var b = 2 * dot(oc, ray.direction());
    var c = dot(oc, oc) - (radius * radius);
    var discriminant = b * b - 4 * a * c;
    return discriminant > 0;
}
function color(r) {
    // color surface of sphere red
    if (hitSphere(new Vec3(0, 0, -1), 0.5, r)) {
        return new Vec3(1, 0, 0);
    }
    var unitDir = unitVecFrom(r.direction());
    var t = 0.5 * (unitDir.y() + 1.0);
    // linear interpolation
    return add(multiply(new Vec3(1, 1, 1), 1 - t), multiply(new Vec3(.5, .7, 1), t));
}
function main() {
    console.log('hi');
    var nx = 200;
    var ny = 100;
    fs.appendFileSync('./image.ppm', "P3\n".concat(nx, " ").concat(ny, "\n255\n"));
    var bottomLeft = new Vec3(-2, -1, -1);
    var horiz = new Vec3(4, 0, 0);
    var vert = new Vec3(0, 2, 0);
    var origin = new Vec3(0, 0, 0);
    for (var j = ny - 1; j >= 0; j--) {
        for (var i = 0; i < nx; i++) {
            var u = i / nx;
            var v = j / ny;
            var direction = add(add(multiply(horiz, u), bottomLeft), multiply(vert, v));
            var ray = new Ray(origin, direction);
            var col = color(ray);
            var ir = Math.floor(255.99 * col.x());
            var ig = Math.floor(255.99 * col.y());
            var ib = Math.floor(255.99 * col.z());
            fs.appendFileSync('./image.ppm', "".concat(ir, " ").concat(ig, " ").concat(ib, "\n"));
        }
    }
}
main();
