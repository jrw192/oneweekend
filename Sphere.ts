import {HitRecord, Hitable} from './Hitable';
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Material} from './Material';
import {add, divide, dot, subtract} from './utils';
import { Aabb } from './Aabb';

export class Sphere implements Hitable {
    center: Vec3;
    radius: number;
    material: Material;
    bBox?: Aabb;

    constructor(cen: Vec3, r: number, m: Material) {
        this.center = cen;
        this.radius = r;
        this.material = m;
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
                rec.material = this.material;
                return true;
            }
        }
        return false;
    }

    

    boundingBox(t0: number, t1: number): Aabb {
        let a = subtract(this.center, new Vec3(this.radius, this.radius, this.radius));
        let b = add(this.center, new Vec3(this.radius, this.radius, this.radius));
        this.bBox = new Aabb(a, b);

        return this.bBox;
    }
}