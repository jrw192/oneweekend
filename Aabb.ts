import { Ray } from "./Ray";
import { ffmax, ffmin } from "./utils";
import { Vec3 } from "./Vec3";


export class Aabb {
    _min: Vec3; // x0
    _max: Vec3; // x1

    constructor(a: Vec3, b: Vec3) {
        this._min = a;
        this._max = b;
    }

    min() {
        return this._min;
    }

    max() {
        return this._max;
    }

    hit(r: Ray, tMin: number, tMax: number) {
        let origin = r.origin();
        let dir = r.direction();
        for (let a = 0; a < 3; a++) {
            let hit0 = (this._min.x() - r.origin().x()) / r.direction().x();
            let hit1 = (this._max.x() - r.origin().x()) / r.direction().x();

            if (a == 0) {
                // x axis
            }
            else if (a == 1) {
                // y axis
                hit0 = (this._min.y() - r.origin().y()) / r.direction().y();
                hit1 = (this._max.y() - r.origin().y()) / r.direction().y();
            }
            else {
                // z axis
                hit0 = (this._min.z() - r.origin().z()) / r.direction().z();
                hit1 = (this._max.z() - r.origin().z()) / r.direction().z();
            }

            let t0 = ffmin(hit0, hit1);
            let t1 = ffmax(hit0, hit1);

            tMin = ffmax(t0, tMin);
            tMax = ffmin(t1, tMax);

            if (tMax < tMin) {
                return false;
            }
        }
        return true;
    }
}