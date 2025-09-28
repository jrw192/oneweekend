import { Vec3 } from './Vec3';
import { Ray } from './Ray';
import { add, cross, multiply, randomInUnitSphere, subtract, unitVecFrom } from './utils';

export class Camera {
    bottomLeft: Vec3;
    horiz: Vec3;
    vert: Vec3;
    origin: Vec3;
    lensRadius: number;
    u: Vec3;
    v: Vec3;
    w: Vec3

    constructor(lookFrom: Vec3, lookAt: Vec3, vUp: Vec3, vFov: number, aspect: number, aperture: number, focusDist: number) {
        this.lensRadius = aperture / 2;
        let theta = vFov * Math.PI / 180;
        let halfHeight = Math.tan(theta / 2);
        let halfWidth = aspect * halfHeight;
        this.origin = lookFrom;

        this.w = unitVecFrom(subtract(lookFrom, lookAt));
        this.u = unitVecFrom(cross(vUp, this.w));
        this.v = cross(this.w, this.u);

        // this.bottomLeft = new Vec3(-halfWidth, -halfHeight, -1);
        this.bottomLeft = subtract(
            subtract(
                subtract(this.origin, multiply(multiply(this.u, halfWidth), focusDist)),
                multiply(multiply(this.v, halfHeight), focusDist)),
            multiply(this.w, focusDist));
        this.horiz = multiply(multiply(this.u, 2 * halfWidth), focusDist);
        this.vert = multiply(multiply(this.v, 2 * halfHeight), focusDist);
    }

    getRay(u: number, v: number) {
        let rd = multiply(randomInUnitSphere(), this.lensRadius);
        let offset = add(multiply(this.u, rd.x()), multiply(this.v, rd.y()));
        let direction = subtract(subtract(
            add(
                add(this.bottomLeft, multiply(this.horiz, u)),
                multiply(this.vert, v)),
            this.origin),
            offset);

        return new Ray(add(this.origin, offset), direction);
    }
}