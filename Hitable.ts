import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Sphere} from './Sphere';

export interface HitRecord {
    t: number; // distance from origin
    p: Vec3; // hit point
    normal: Vec3; // normal vector
}

export abstract class Hitable {
    abstract hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean;
}

export class HitableList {
    list: Hitable[];
    listSize: number;
    constructor(list: Hitable[], n: number) {
        this.list = list;
        this.listSize = n;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord) {
        let hitAnything = false;
        let closest = tMax;

        for (let i = 0; i < this.listSize; i++) {
            let sphere = this.list[i] as Sphere;
            if (this.list[i].hit(ray, tMin, closest, rec)) {
                hitAnything = true;
                closest = rec.t;
            }
        }
        return hitAnything;
    }
}