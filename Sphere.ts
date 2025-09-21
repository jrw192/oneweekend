import {HitRecord, Hitable} from './Hitable';
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {divide, dot, subtract} from './utils';

export class Sphere implements Hitable {
    center: Vec3;
    radius: number;

    constructor(cen: Vec3, r: number) {
        this.center = cen;
        this.radius = r;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    let oc = subtract(ray.origin(), this.center);
    let a = dot(ray.direction(), ray.direction());
    let b = 2 * dot(oc, ray.direction());
    let c = dot(oc, oc) - (this.radius * this.radius);
    let discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
        // hit
        let t = (-b - Math.sqrt(discriminant)) / (2 * a);
        if (t > tMin && t < tMax) {
            rec.t = t;
            rec.p = ray.pointAtParameter(t);
            rec.normal = divide(subtract(rec.p, this.center), this.radius);
            return true;
        }
    }
        return false;
    }
}