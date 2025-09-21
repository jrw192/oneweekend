import {Vec3} from './Vec3';
import {add, multiply} from './utils';
export class Ray {
    A: Vec3;
    B: Vec3;
    constructor(a: Vec3, b: Vec3) {
        this.A = new Vec3(a.x(), a.y(), a.z());
        this.B = new Vec3(b.x(), b.y(), b.z());
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