"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
var Vec3_1 = require("./Vec3");
var Ray_1 = require("./Ray");
var utils_1 = require("./utils");
var Camera = /** @class */ (function () {
    function Camera() {
        this.bottomLeft = new Vec3_1.Vec3(-2, -1, -1);
        this.horiz = new Vec3_1.Vec3(4, 0, 0);
        this.vert = new Vec3_1.Vec3(0, 2, 0);
        this.origin = new Vec3_1.Vec3(0, 0, 0);
    }
    Camera.prototype.getRay = function (u, v) {
        var direction = (0, utils_1.add)((0, utils_1.add)((0, utils_1.multiply)(this.horiz, u), this.bottomLeft), (0, utils_1.multiply)(this.vert, v));
        return new Ray_1.Ray(this.origin, direction);
    };
    return Camera;
}());
exports.Camera = Camera;
