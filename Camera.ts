import { Vec3 } from './Vec3';
import { Ray } from './Ray';
import { add, cross, multiply, subtract, unitVecFrom } from './utils';

export class Camera {
    bottomLeft: Vec3;
    horiz: Vec3;
    vert: Vec3;
    origin: Vec3;

    constructor(lookFrom: Vec3, lookAt: Vec3, vUp: Vec3, vFov: number, aspect: number) {
        let theta = vFov * Math.PI / 180;
        let halfHeight = Math.tan(theta / 2);
        let halfWidth = aspect * halfHeight;
        this.origin = lookFrom;

        let w = unitVecFrom(subtract(lookFrom, lookAt));
        let u = unitVecFrom(cross(vUp, w));
        let v = cross(w, u);

        // this.bottomLeft = new Vec3(-halfWidth, -halfHeight, -1);
        this.bottomLeft = subtract(
            subtract(
                subtract(this.origin, multiply(u, halfWidth)),
                multiply(v, halfHeight)),
            w);
        this.horiz = multiply(u, 2 * halfWidth);
        this.vert = multiply(v, 2 * halfHeight);
    }

    getRay(u: number, v: number) {
        let direction = subtract(
            add(
                add(this.bottomLeft, multiply(this.horiz, u)),
                multiply(this.vert, v)),
            this.origin);

        return new Ray(this.origin, direction);
    }
}