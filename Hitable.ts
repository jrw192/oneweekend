import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Material} from './Material';
import { Aabb } from './Aabb';
import { add, divide, dot, subtract, surroundingBox } from './utils';

export interface HitRecord {
    t: number; // distance from origin
    p: Vec3; // hit point
    normal: Vec3; // normal vector
    material: Material;
}

export abstract class Hitable {
    constructor() {}

    abstract hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean;

    abstract boundingBox(t0: number, t1: number): Aabb;
}

export class HitableList {
    list: Hitable[];
    listSize: number;
    bBox?: Aabb;

    constructor(list: Hitable[]) {
        this.list = list;
        this.listSize = list.length;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord) {
        let hitAnything = false;
        let closest = tMax;

        for (let i = 0; i < this.listSize; i++) {
            let object = this.list[i];
            if (object.hit(ray, tMin, closest, rec)) {
                hitAnything = true;
                closest = rec.t;
            }
        }
        return hitAnything;
    }

    boundingBox(t0: number, t1: number): Aabb | false {
        if (this.listSize < 1) { return false; }
        
        let firstBox = this.list[0].boundingBox(t0, t1);
        if (!firstBox) return false;
        
        let tempBox = firstBox;
        for (let i = 1; i < this.listSize; i++) {
            let box = this.list[i].boundingBox(t0, t1);
            if (!box) return false;
            tempBox = surroundingBox(tempBox, box);
        }
        this.bBox = tempBox;
        return this.bBox;
    }
}

export class Sphere extends Hitable {
    center: Vec3;
    radius: number;
    material: Material;
    bBox?: Aabb;

    constructor(cen: Vec3, r: number, m: Material) {
        super();
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