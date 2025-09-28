import {Ray} from './Ray';
import {Vec3} from './Vec3';
import {HitRecord} from './Hitable';
import {add, dot, multiply, randomInUnitSphere, reflect, refract, subtract, unitVecFrom} from './utils';

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
        this.fuzz = 0;
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
    refracted: Vec3;
    reflected: Vec3;

    constructor(ri: number) {
        this.refIndex = ri;
        this.refracted = new Vec3(0,0,0);
        this.reflected = new Vec3(0,0,0);
        this.albedo = new Vec3(1,1,1);
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let outwardNormal: Vec3 = new Vec3(0,0,0);
        let niNt: number = this.refIndex;

        this.attenuation = new Vec3(1,1,1);
        this.reflected = reflect(unitVecFrom(rayIn.direction()), hitRecord.normal);

        if (dot(rayIn.direction(), hitRecord.normal) > 0) {
            outwardNormal = multiply(hitRecord.normal, -1);
        } else {
            outwardNormal = hitRecord.normal;
            niNt = 1 / this.refIndex;
        }
        this.refracted = refract(rayIn.direction(), outwardNormal, niNt) ?? new Vec3(0,0,0);
        if (this.refracted) {
            this.scattered = new Ray(hitRecord.p, this.refracted);
        } else {
            this.scattered = new Ray(hitRecord.p, this.reflected);
            return false;
        }
        return true;
    }
}