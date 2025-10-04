import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {Sphere} from './Sphere';
import {Material} from './Material';
import { Aabb } from './Aabb';
import { surroundingBox } from './utils';

export interface HitRecord {
    t: number; // distance from origin
    p: Vec3; // hit point
    normal: Vec3; // normal vector
    material: Material;
}

export abstract class Hitable {
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