import { Perlin } from "./Perlin";
import { multiply } from "./utils";
import { Vec3 } from "./Vec3";

export abstract class Texture {
    abstract value(u: number, v: number, p: Vec3): Vec3;
}

export class ConstantTexture implements Texture {
    color: Vec3;

    constructor(c: Vec3) {
        this.color = c;
    }

    value(u: number, v: number, p: Vec3) {
        return this.color;
    }
}

export class CheckerTexture implements Texture {
    odd: Texture;
    even: Texture;

    constructor(t0: Texture, t1: Texture) {
        this.even = t0;
        this.odd = t1;
    }

    value(u: number, v: number, p: Vec3): Vec3 {
        let sines = Math.sin(10*p.x())*Math.sin(10*p.y())*Math.sin(10*p.z());
        if (sines < 0) {
            return this.odd.value(u,v,p);
        } else {
            return this.even.value(u,v,p);
        }
    }
}

export class NoiseTexture implements Texture {
    noise: Perlin;
    scale: number;

    constructor(sc: number) {
        this.scale = sc;
        this.noise = new Perlin();
    }

    value(u: number, v: number, p: Vec3): Vec3 {
        return multiply(new Vec3(1,1,1), this.noise.noise(multiply(p, this.scale)));
    }
}