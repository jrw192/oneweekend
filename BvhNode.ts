import { Aabb } from "./Aabb";
import { Hitable, HitRecord } from "./Hitable";
import { Lambertian } from "./Material";
import { Ray } from "./Ray";
import { ConstantTexture } from "./Texture";
import { boxCompare, surroundingBox } from "./utils";
import { Vec3 } from "./Vec3";

export class BvhNode implements Hitable {
    left: Hitable;
    right: Hitable;
    box: Aabb;

    constructor(list: Hitable[], n: number, t0: number, t1: number) {
        // let axis = Math.floor(3*Math.random());
        // let axis = 0;
        // let comparator = 'x';
        // switch (axis) {
        //     case 0:
        //         comparator = 'x';
        //         break;
        //     case 1:
        //         comparator = 'y';
        //         break;
        //     default: // 2
        //         comparator = 'z';
        //         break;
        // }
        list = list.sort((b1,b2)=>boxCompare(b1, b2, 'x'));

        if (n == 1) {
            this.left = this.right = list[0];
        } else if (n == 2) {
            this.left = list[0];
            this.right = list[1];
        } else {
            let mid = Math.floor(n/2);
            let listLeft = list.slice(0, mid);
            let listRight = list.slice(mid, n);

            this.left = new BvhNode(listLeft, mid, t0, t1);
            this.right= new BvhNode(listRight, n - mid, t0, t1);
        }

        let boxLeft = this.left.boundingBox(t0,t1);
        let boxRight = this.right.boundingBox(t0,t1);

        if (!boxLeft || !boxRight) {
            throw new Error("no bounding box in constructor");
        }

        this.box = surroundingBox(boxLeft, boxRight);
    }

    boundingBox(t0: number, t1: number) {
        return this.box;
    }

    hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
        if (this.box.hit(ray, tMin, tMax)) {
            let leftRec: HitRecord = { u: 0, v: 0, t: 0, p: new Vec3(0, 0, 0), normal: new Vec3(0, 0, 0), material: new Lambertian(new ConstantTexture(new Vec3(0, 0, 0))) };
            let rightRec: HitRecord = { u: 0, v: 0, t: 0, p: new Vec3(0, 0, 0), normal: new Vec3(0, 0, 0), material: new Lambertian(new ConstantTexture(new Vec3(0, 0, 0))) };
            let hitLeft = this.left.hit(ray, tMin, tMax, leftRec);
            let hitRight = this.right.hit(ray, tMin, tMax, rightRec);

            if (hitLeft && hitRight) {
                if (leftRec.t < rightRec.t) {
                    rec.t = leftRec.t;
                    rec.p = leftRec.p;
                    rec.normal = leftRec.normal;
                    rec.material = leftRec.material;
                    rec.u = leftRec.u;
                    rec.v = leftRec.v;
                } else {
                    rec.t = rightRec.t;
                    rec.p = rightRec.p;
                    rec.normal = rightRec.normal;
                    rec.material = rightRec.material;
                    rec.u = rightRec.u;
                    rec.v = rightRec.v;
                }
                return true;
            } else if (hitLeft) {
                rec.t = leftRec.t;
                rec.p = leftRec.p;
                rec.normal = leftRec.normal;
                rec.material = leftRec.material;
                rec.u = leftRec.u;
                    rec.v = leftRec.v;
                return true;
            } else if (hitRight) {
                rec.t = rightRec.t;
                rec.p = rightRec.p;
                rec.normal = rightRec.normal;
                rec.material = rightRec.material;
                rec.u = rightRec.u;
                rec.v = rightRec.v;
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
}