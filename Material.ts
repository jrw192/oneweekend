import {Ray} from './Ray';
import {Vec3} from './Vec3';
import {HitRecord} from './Hitable';
import {add, dot, multiply, randomInUnitSphere, reflect, refract, schlick, subtract, unitVecFrom} from './utils';

export abstract class Material {
    albedo: Vec3;
    scattered: Ray;
    abstract scatter(rayIn: Ray, hitRecord: HitRecord): boolean;
}

// the basic diffuse material
export class Lambertian implements Material {
    albedo: Vec3;
    scattered: Ray;

    constructor(a: Vec3) {
        this.albedo = a;
        this.scattered = new Ray(new Vec3(0,0,0), new Vec3(0,0,0))
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let target = randomInUnitSphere().add(add(hitRecord.p, hitRecord.normal));
        this.scattered = new Ray(hitRecord.p, subtract(target, hitRecord.p));
        return true;
    }
}

export class Metal implements Material {
    albedo: Vec3;
    fuzz: number;
    scattered: Ray;

    constructor(a: Vec3, f: number) {
        this.albedo = a;
        this.scattered = new Ray(new Vec3(0,0,0), new Vec3(0,0,0))
        this.fuzz = Math.max(0, f);
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let reflected = reflect(unitVecFrom(rayIn.direction()), hitRecord.normal);
        this.scattered = new Ray(hitRecord.p, randomInUnitSphere().scale(this.fuzz).add(reflected));
        return dot(this.scattered.direction(), hitRecord.normal) > 0;
    }
}

export class Dieletric implements Material {
    albedo: Vec3; // unused, the glass absorbs nothing
    attenuation: Vec3;
    scattered: Ray;
    refIndex: number;

    constructor(ri: number) {
        this.refIndex = ri;
        this.albedo = new Vec3(1,1,1);
        this.attenuation = new Vec3(1,1,1);
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let unitDir = unitVecFrom(rayIn.direction());
        let outwardNormal: Vec3 = new Vec3(0,0,0);
        let niNt: number = 0;
        let reflected = reflect(unitDir, hitRecord.normal);
        let cosine = 0;

        // cosine
        let dotProduct = dot(unitDir, hitRecord.normal);
        if (dotProduct > 0) {
            outwardNormal = multiply(hitRecord.normal, -1);
            niNt = this.refIndex;
            cosine = this.refIndex * dotProduct;
        } else {
            outwardNormal = hitRecord.normal;
            niNt = 1 / this.refIndex;
            cosine = (-dotProduct);
        }

        let refracted = refract(unitDir, outwardNormal, niNt);
        let reflectProb = 0;
        if (refracted !== undefined) {
            // this.scattered = new Ray(hitRecord.p, refracted);
            reflectProb = schlick(cosine, this.refIndex);
        } else {
            // this.scattered = new Ray(hitRecord.p, reflected);
            reflectProb = 1;
        }

        if (Math.random() < reflectProb) {
            this.scattered = new Ray(hitRecord.p, reflected);
        } else {
            this.scattered = new Ray(hitRecord.p, refracted!);
        }

        return true;
    }
}