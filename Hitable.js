"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitableList = exports.Hitable = void 0;
var Hitable = /** @class */ (function () {
    function Hitable() {
    }
    return Hitable;
}());
exports.Hitable = Hitable;
var HitableList = /** @class */ (function () {
    function HitableList(list) {
        this.list = list;
        this.listSize = list.length;
    }
    HitableList.prototype.hit = function (ray, tMin, tMax, rec) {
        var hitAnything = false;
        var closest = tMax;
        for (var i = 0; i < this.listSize; i++) {
            var sphere = this.list[i];
            rec.material = sphere.material;
            if (sphere.hit(ray, tMin, closest, rec)) {
                hitAnything = true;
                closest = rec.t;
            }
        }
        return hitAnything;
    };
    return HitableList;
}());
exports.HitableList = HitableList;
