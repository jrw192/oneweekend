import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Material} from './Material';
import { Aabb } from './Aabb';
import { add, divide, dot, subtract, surroundingBox } from './utils';

export interface HitRecord {
    u: number; // horizontal 
    v: number; // vertical
    t: number; // distance from origin
    p: Vec3; // hit point
    normal: Vec3; // normal vector
    material: Material;
}

export abstract class Hitable {
    bBox?: Aabb;
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
    // bBox?: Aabb;

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
                // rec.u = Math.atan2(-rec.normal.z(), rec.normal.x()) + Math.PI;
                // rec.v = Math.acos(-rec.normal.y()) / Math.PI;
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

export class XyRect extends Hitable {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    k: number;
    material: Material;

    constructor(x0: number, x1: number, y0: number, y1: number, k: number, mat: Material) {
        super();
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.k = k;
        this.material = mat;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        // t = (k-az)/bz
        let t = (this.k - ray.origin().z()) / ray.direction().z();
        // x = ax + t*bx
        let x = ray.origin().x() + t*ray.direction().x();
        // y = ay + t*by
        let y = ray.origin().y() + t*ray.direction().y();
        if (this.x0 > x || this.x1 < x || this.y0 > y || this.y1 < y) {
            // not hit
            return false;
        }
        rec.material = this.material;
        rec.normal = new Vec3(0,0,1);
        rec.p = ray.pointAtParameter(t);
        rec.t = t;
        rec.u = (x-this.x0)/(this.x1-this.x0);
        rec.v = (y-this.y0)/(this.y1-this.y0);
        
        return true;
    }

    boundingBox(t0: number, t1: number): Aabb {
        let a = new Vec3(this.x0, this.y0, this.k-.0001);
        let b = new Vec3(this.x1, this.y1, this.k+.0001);
        this.bBox = new Aabb(a, b);

        return this.bBox;
    }
}