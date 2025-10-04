import {Vec3} from './Vec3';
import {add, multiply} from './utils';
export class Ray {
    A: Vec3;
    B: Vec3;
    _time: number;

    constructor(a: Vec3, b: Vec3, t?: number) {
        this.A = new Vec3(a.x(), a.y(), a.z());
        this.B = new Vec3(b.x(), b.y(), b.z());
        this._time = t ?? 0;
    }

    time(): number {
        return this._time;
    }

    origin(): Vec3 {
        return this.A;
    }

    direction(): Vec3 {
        return this.B;
    }

    pointAtParameter(t: number): Vec3 {
        return add(this.A, multiply(this.B, t));
    }
}