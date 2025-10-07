import { dot, unitVecFrom } from "./utils";
import { Vec3 } from "./Vec3";

export class Perlin {
    permX: number[];
    permY: number[];
    permZ: number[];
    randomVecs: Vec3[];

    constructor() {
        this.permX = perlinGeneratePermute();
        this.permY = perlinGeneratePermute();
        this.permZ = perlinGeneratePermute();
        this.randomVecs = perlinGenerate();
    }

    noise(p: Vec3) {
        let u = p.x() - Math.floor(p.x());
        let v = p.y() - Math.floor(p.y());
        let w = p.z() - Math.floor(p.z());
        let i = Math.floor(p.x());
        let j = Math.floor(p.y());
        let k = Math.floor(p.z());
        let c = [[
            [new Vec3(1,1,1), new Vec3(1,1,1)],
            [new Vec3(1,1,1), new Vec3(1,1,1)]
        ],
        [
            [new Vec3(1,1,1), new Vec3(1,1,1)],
            [new Vec3(1,1,1), new Vec3(1,1,1)]
        ]];
        for (let di = 0; di < 2; di++) {
            for (let dj = 0; dj < 2; dj++) {
                for (let dk = 0; dk < 2; dk++) {
                    c[di][dj][dk] = this.randomVecs[
                        this.permX[(i+di)&255] ^
                        this.permY[(j+dj)&255] ^
                        this.permZ[(k+dk)&255]];
                }
            }
        }
        return trilinearInterpolation(c,u,v,w);
    }
}

function perlinGenerate() {
    let p: Vec3[] = [];
    for (let i = 0; i < 256; i++) {
        p.push(unitVecFrom(
            new Vec3(2*Math.random()-1,
                    2*Math.random()-1,
                    2*Math.random()-1)));
    }
    return p;
}

function permute(p: number[], n: number) {
    for (let i = n-1; i > 0; i--) {
        let target = Math.floor(Math.random() * (i+1));
        let temp = p[i];
        p[i] = p[target];
        p[target] = temp;
    }
    return p;
}

function perlinGeneratePermute() {
    let p: number[] = [];
    for (let i = 0; i < 256; i++) {
        p.push(i);
    }
    p = permute(p, 256);
    return p;
}

function trilinearInterpolation(c: Vec3[][][], u: number, v: number, w: number) {
    let uu = u*u*(3-2*u);
    let vv = v*v*(3-2*v);
    let ww = w*w*(3-2*w);

    let accum = 0;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                let weightV = new Vec3(u-i, v-j, w-k);
                accum += (i*uu + (1-i)*(1-uu)) *
                        (j*vv + (1-j)*(1-vv)) *
                        (k*ww + (1-k)*(1-ww)) *
                        dot(c[i][j][k], weightV);
            }
        }
    }
    return 0.5 * (accum+1);
}