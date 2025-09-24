import {Ray} from './Ray';
import {Vec3} from './Vec3';
import {HitRecord} from './Hitable';
import {add, dot, randomInUnitSphere, reflect, subtract, unitVecFrom} from './utils';

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
        this.fuzz = Math.max(1, f);
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let reflected = reflect(unitVecFrom(rayIn.direction()), hitRecord.normal);
        this.scattered = new Ray(hitRecord.p, randomInUnitSphere().scale(this.fuzz).add(reflected));
        return dot(this.scattered.direction(), hitRecord.normal) > 0;
    }
}