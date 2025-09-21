import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {add, multiply} from './utils';

export class Camera {
    bottomLeft: Vec3;
    horiz: Vec3;
    vert: Vec3;
    origin: Vec3;

    constructor() {
        this.bottomLeft = new Vec3(-2, -1, -1);
        this.horiz = new Vec3(4, 0, 0);
        this.vert = new Vec3(0, 2, 0);
        this.origin = new Vec3(0, 0, 0);
    }

    getRay(u: number, v: number) {
        let direction = add(add(multiply(this.horiz, u),
                                this.bottomLeft),
                            multiply(this.vert, v));

        return new Ray(this.origin, direction);
    }
}