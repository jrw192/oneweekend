import {Ray} from './Ray';
import {Vec3} from './Vec3';
import {HitRecord} from './Hitable';
import {add, dot, multiply, randomInUnitSphere, reflect, refract, schlick, subtract, unitVecFrom} from './utils';
import { ConstantTexture, Texture } from './Texture';

export abstract class Material {
    albedo: Texture;
    scattered: Ray;
    attenuation: Vec3;

    constructor() {
        this.scattered = new Ray(new Vec3(0,0,0), new Vec3(0,0,0));
        this.attenuation = new Vec3(0,0,0);
        this.albedo = new ConstantTexture(new Vec3(0,0,0));
    }

    abstract scatter(rayIn: Ray, hitRecord: HitRecord): boolean;

    emit(u: number, v: number, p: Vec3): Vec3 {
        return new Vec3(0, 0, 0);
    }

    getScattered(): Ray {
        return this.scattered;
    }

    getAttenuation(): Vec3 {
        return this.attenuation;
    }
}

// the basic diffuse material
export class Lambertian extends Material {
    constructor(a: Texture) {
        super();
        this.albedo = a;
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let target = randomInUnitSphere().add(add(hitRecord.p, hitRecord.normal));
        this.scattered = new Ray(hitRecord.p, subtract(target, hitRecord.p), rayIn.time());
        this.attenuation = this.albedo.value(0,0, hitRecord.p);
        return true;
    }
}

export class Metal extends Material {
    private fuzz: number;

    constructor(a: Texture, f: number) {
        super();
        this.albedo = a;
        this.fuzz = Math.max(0, f);
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        let reflected = reflect(unitVecFrom(rayIn.direction()), hitRecord.normal);
        this.scattered = new Ray(hitRecord.p, randomInUnitSphere().scale(this.fuzz).add(reflected), rayIn.time());
        this.attenuation = this.albedo.value(0,0, hitRecord.p);
        return dot(this.scattered.direction(), hitRecord.normal) > 0;
    }
}

export class Dieletric extends Material {
    private refIndex: number;

    constructor(ri: number) {
        super();
        this.refIndex = ri;
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
            this.scattered = new Ray(hitRecord.p, reflected, rayIn.time());
        } else {
            this.scattered = new Ray(hitRecord.p, refracted!, rayIn.time());
        }

        return true;
    }
}

export class DiffuseLight extends Material {
    _emit: Texture;
    constructor(a: Texture) {
        super();
        this._emit = a;
    }

    scatter(rayIn: Ray, hitRecord: HitRecord): boolean {
        return false;
    }

    emit(u: number, v: number, p: Vec3): Vec3 {
        return this._emit.value(u, v, p);
    }
    
}