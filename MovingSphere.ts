import {HitRecord, Hitable} from './Hitable';
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Material} from './Material';
import {add, divide, dot, multiply, subtract} from './utils';

export class MovingSphere implements Hitable {
    cen0: Vec3;
    cen1: Vec3;
    t0: number;
    t1: number;
    radius: number;
    material: Material;

    constructor(cen0: Vec3, cen1: Vec3, t0: number, t1: number, r: number, m: Material) {
        this.cen0 = cen0;
        this.cen1 = cen1;
        this.t0 = t0;
        this.t1 = t1;
        this.radius = r;
        this.material = m;
    }

    center(time: number) {
        return add(this.cen0,
            multiply(subtract(this.cen1, this.cen0), (time-this.t0)/(this.t1-this.t0))
        );
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        let cen = this.center(ray.time());
        let oc = subtract(ray.origin(), cen);
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
                rec.normal = divide(subtract(rec.p, cen), this.radius);
                rec.material = this.material;
                return true;
            }
        }
        return false;
    }
}