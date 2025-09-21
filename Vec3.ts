
export class Vec3 {
    e: number[];

    constructor(e0: number, e1: number, e2: number) {
        this.e = [e0, e1, e2];
    }

    x() { return this.e[0]; }
    y() { return this.e[1]; }
    z() { return this.e[2]; }

    r() { return this.e[0]; }
    g() { return this.e[1]; }
    b() { return this.e[2]; }

    get(): Vec3 {
        return new Vec3(this.e[0], this.e[1], this.e[2]);
    }

    getInverse(): Vec3 {
        return new Vec3(-this.e[0], -this.e[1], -this.e[2]);
    }

    getAt(i: number): number {
        return this.e[i];
    }

    add(v: Vec3): Vec3 {
        this.e[0] += v.e[0];
        this.e[1] += v.e[1];
        this.e[2] += v.e[2];
        return this.get();
    }

    subtract(v: Vec3): Vec3 {
        this.e[0] -= v.e[0];
        this.e[1] -= v.e[1];
        this.e[2] -= v.e[2];
        return this.get();
    }

    scale(t: number): Vec3 {
        this.e[0] *= t;
        this.e[1] *= t;
        this.e[2] *= t;
        return this.get();
    }

    multiply(v: Vec3): Vec3 {
        this.e[0] *= v.e[0];
        this.e[1] *= v.e[1];
        this.e[2] *= v.e[2];
        return this.get();
    }

    divide(v: Vec3): Vec3 {
        this.e[0] /= v.e[0];
        this.e[1] /= v.e[1];
        this.e[2] /= v.e[2];
        return this.get();
    }

    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared(): number {
        return Math.pow(this.e[0], 2)
            + Math.pow(this.e[1], 2)
            + Math.pow(this.e[2], 2);
    }

    nearZero(): boolean {
        const s = 1e-8;
        return (Math.abs(this.e[0]) < s) &&
            (Math.abs(this.e[1]) < s) &&
            (Math.abs(this.e[2]) < s);
    }
}