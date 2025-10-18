import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Material} from './Material';
import { Aabb } from './Aabb';
import { add, divide, dot, multiply, multiplyVecs, subtract, surroundingBox } from './utils';

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
            let root = Math.sqrt(discriminant)
            let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
            let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
            if (t1 > tMin && t1 < tMax) {
                rec.t = t1;
                rec.p = ray.pointAtParameter(t1);
                rec.normal = divide(subtract(rec.p, this.center), this.radius);
                rec.material = this.material;
                // rec.u = Math.atan2(-rec.normal.z(), rec.normal.x()) + Math.PI;
                // rec.v = Math.acos(-rec.normal.y()) / Math.PI;
                return true;
            } else if (t2 > tMin && t2 < tMax) {
                rec.t = t2;
                rec.p = ray.pointAtParameter(t2);
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
        if (t < tMin || t > tMax) {
            return false;
        }

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

export class YzRect extends Hitable {
    y0: number;
    y1: number;
    z0: number;
    z1: number;
    k: number;
    material: Material;

    constructor(y0: number, y1: number, z0: number, z1: number, k: number, mat: Material) {
        super();
        this.y0 = y0;
        this.y1 = y1;
        this.z0 = z0;
        this.z1 = z1;
        this.k = k;
        this.material = mat;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        // t = (k-az)/bz
        let t = (this.k - ray.origin().x()) / ray.direction().x();
        if (t < tMin || t > tMax) {
            return false;
        }

        // y = ay + t*by
        let y = ray.origin().y() + t*ray.direction().y();
        // z = az + t*bz
        let z = ray.origin().z() + t*ray.direction().z();
        if (this.y0 > y || this.y1 < y || this.z0 > z || this.z1 < z) {
            // not hit
            return false;
        }
        rec.material = this.material;
        rec.normal = new Vec3(1,0,0);
        rec.p = ray.pointAtParameter(t);
        rec.t = t;
        rec.u = (y-this.y0)/(this.y1-this.y0);
        rec.v = (z-this.z0)/(this.z1-this.z0);
        
        return true;
    }

    boundingBox(t0: number, t1: number): Aabb {
        let a = new Vec3(this.y0, this.z0, this.k-.0001);
        let b = new Vec3(this.y1, this.z1, this.k+.0001);
        this.bBox = new Aabb(a, b);

        return this.bBox;
    }
}

export class XzRect extends Hitable {
    x0: number;
    x1: number;
    z0: number;
    z1: number;
    k: number;
    material: Material;

    constructor(x0: number, x1: number, z0: number, z1: number, k: number, mat: Material) {
        super();
        this.x0 = x0;
        this.x1 = x1;
        this.z0 = z0;
        this.z1 = z1;
        this.k = k;
        this.material = mat;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        // t = (k-az)/bz
        let t = (this.k - ray.origin().y()) / ray.direction().y();
        if (t < tMin || t > tMax) {
            return false;
        }

        // y = ay + t*by
        let x = ray.origin().x() + t*ray.direction().x();
        // z = az + t*bz
        let z = ray.origin().z() + t*ray.direction().z();
        if (this.x0 > x || this.x1 < x || this.z0 > z || this.z1 < z) {
            // not hit
            return false;
        }
        rec.material = this.material;
        rec.normal = new Vec3(0,1,0);
        rec.p = ray.pointAtParameter(t);
        rec.t = t;
        rec.u = (x-this.x0)/(this.x1-this.x0);
        rec.v = (z-this.z0)/(this.z1-this.z0);
        
        return true;
    }

    boundingBox(t0: number, t1: number): Aabb {
        let a = new Vec3(this.x0, this.z0, this.k-.0001);
        let b = new Vec3(this.x1, this.z1, this.k+.0001);
        this.bBox = new Aabb(a, b);

        return this.bBox;
    }
}

export class FlipNormals extends Hitable {
    ptr: Hitable;
    constructor(p: Hitable) {
        super();
        this.ptr = p;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        if (this.ptr.hit(ray, tMin, tMax, rec)) {
            rec.normal = multiply(rec.normal, -1);
            return true;
        }
        return false;
    }

    boundingBox(t0: number, t1: number): Aabb {
        return this.ptr.boundingBox(t0, t1);
    }
}

export class Box extends Hitable {
    boxList: HitableList;
    pMin: Vec3;
    pMax: Vec3;
    constructor(p0: Vec3, p1: Vec3, mat: Material) {
        super();

        this.pMin = p0;
        this.pMax = p1;
        let faces = [
            new XyRect(p0.x(), p1.x(), p0.y(), p1.y(), p0.z(), mat),
            new XyRect(p0.x(), p1.x(), p0.y(), p1.y(), p1.z(), mat),
            new YzRect(p0.y(), p1.y(), p0.z(), p1.z(), p0.x(), mat),
            new YzRect(p0.y(), p1.y(), p0.z(), p1.z(), p1.x(), mat),
            new XzRect(p0.x(), p1.x(), p0.z(), p1.z(), p0.y(), mat),
            new XzRect(p0.x(), p1.x(), p0.z(), p1.z(), p1.y(), mat),
        ];
        this.boxList = new HitableList(faces);

    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        return this.boxList.hit(ray, tMin, tMax, rec);
    }

    boundingBox(t0: number, t1: number): Aabb {
        return this.boxList.boundingBox(t0,t1) as Aabb;
    }
}

export class Translate extends Hitable {
    hitable: Hitable;
    offset: Vec3;

    constructor(hitable: Hitable, offset: Vec3) {
        super();
        this.hitable = hitable;
        this.offset = offset;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        let translatedRay = new Ray(subtract(ray.origin(), this.offset), ray.direction(), ray.time());
        if (this.hitable.hit(translatedRay, tMin, tMax, rec)) {
            rec.p = add(rec.p, this.offset);
            return true;
        }
        return false;
    }

    boundingBox(t0: number, t1: number): Aabb {
        let box = this.hitable.boundingBox(t0,t1);
        return new Aabb(add(box.min(), this.offset), add(box.max(), this.offset));
    }
}

export class RotateY extends Hitable {
    hitable: Hitable;
    sinTheta: number;
    cosTheta: number;

    constructor(hitable: Hitable, angle: number) {
        super();
        this.hitable = hitable;

        let theta = (Math.PI / 180) * angle;
        this.sinTheta = Math.sin(theta);
        this.cosTheta = Math.cos(theta);
        let bBox = this.hitable.boundingBox(0,1);
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        let origin = ray.origin();
        let dir = ray.direction();

        origin.set(0, this.cosTheta*origin.x() + this.sinTheta*origin.z());
        origin.set(2, -this.sinTheta*origin.x() + this.cosTheta*origin.z());
        dir.set(0, this.cosTheta*dir.x() + this.sinTheta*dir.z());
        dir.set(2, -this.sinTheta*dir.x() + this.cosTheta*dir.z());

        let rotatedRay = new Ray(origin, dir, ray.time());

        if (this.hitable.hit(rotatedRay, tMin, tMax, rec)) {
            let p = rec.p;
            let n = rec.normal;
            p.set(0, this.cosTheta*p.x() + this.sinTheta*p.z());
            p.set(2, -this.sinTheta*p.x() + this.cosTheta*p.z());
            n.set(0, this.cosTheta*n.x() + this.sinTheta*n.z());
            n.set(2, -this.sinTheta*n.x() + this.cosTheta*n.z());

            rec.p = p;
            rec.normal = n;

            return true;
        }
        return false;
    }

    boundingBox(t0: number, t1: number): Aabb {
        let box = this.hitable.boundingBox(t0,t1);
        let max = new Vec3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        let min = new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    let x = i * box.max().x() + (1-i) * box.min().x();
                    let y = j * box.max().y() + (1-j) * box.min().y();
                    let z = k * box.max().z() + (1-k) * box.min().z();
                    let newX = this.cosTheta*x + this.sinTheta*z;
                    let newZ = -this.sinTheta*x + this.cosTheta*z;
                    let newCoord = new Vec3(newX, y, newZ);
                    max.set(0, Math.max(max.x(), newCoord.x()));
                    min.set(0, Math.min(min.x(), newCoord.x()));
                    max.set(1, Math.max(max.y(), newCoord.y()));
                    min.set(1, Math.min(min.y(), newCoord.y()));
                    max.set(2, Math.max(max.z(), newCoord.z()));
                    min.set(2, Math.min(min.z(), newCoord.z()));

                }
            }
        }

        return new Aabb(max, min);
    }
}