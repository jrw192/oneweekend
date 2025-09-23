import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Sphere} from './Sphere';
import {Material} from './Material';

export interface HitRecord {
    t: number; // distance from origin
    p: Vec3; // hit point
    normal: Vec3; // normal vector
    material: Material;
}

export abstract class Hitable {
    abstract hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean;
}

export class HitableList {
    list: Hitable[];
    listSize: number;
    constructor(list: Hitable[]) {
        this.list = list;
        this.listSize = list.length;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord) {
        let hitAnything = false;
        let closest = tMax;

        for (let i = 0; i < this.listSize; i++) {
            let sphere = this.list[i] as Sphere;
            if (sphere.hit(ray, tMin, closest, rec)) {
                hitAnything = true;
                closest = rec.t;
            }
        }
        return hitAnything;
    }
}