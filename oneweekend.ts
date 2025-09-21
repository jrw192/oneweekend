declare function require(name: string): any;
const fs = require('fs');


class Vec3 {
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

/* --------------- UTILITY FUNCTIONS --------------- */
function newVec3From(v1: Vec3): Vec3 {
    return new Vec3(v1.x(), v1.y(), v1.z());
}

function add(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).add(v2);
}

function subtract(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).subtract(v2);
}

function multiplyVecs(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).multiply(v2);
}

function multiply(v1: Vec3, t: number) {
    return newVec3From(v1).scale(t);
}

function divide(v1: Vec3, t: number) {
    return newVec3From(v1).scale(1 / t);
}

function dot(v1: Vec3, v2: Vec3): number {
    let product = newVec3From(v1).multiply(v2);
    return product.x() + product.y() + product.z();
}

function cross(v1: Vec3, v2: Vec3) {
    // TBC
}

function unitVecFrom(v1: Vec3): Vec3 {
    return divide(v1, v1.length());
}


class Ray {
    A: Vec3;
    B: Vec3;
    constructor(a: Vec3, b: Vec3) {
        this.A = new Vec3(a.x(), a.y(), a.z());
        this.B = new Vec3(b.x(), b.y(), b.z());
    }

    origin(): Vec3 {
        return this.A;
    }

    direction(): Vec3 {
        return this.B;
    }

    pointAtParameter(t: number): Vec3 {
        return add(this.A, multiply(this.B, t));
    }
}

function hitSphere(center: Vec3, radius: number, ray: Ray): number {
    let oc = subtract(ray.origin(), center);
    let a = dot(ray.direction(), ray.direction());
    let b = 2 * dot(oc, ray.direction());
    let c = dot(oc, oc) - (radius * radius);
    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        // no hit
        return -1;
    }
    // return hit point
    return (-b - Math.sqrt(discriminant)) / (2 * a);
}

function color(r: Ray): Vec3 {
    // color surface of sphere red
    let t = hitSphere(new Vec3(0, 0, -1), 0.5, r);
    if (t > 0) {
        // (hit point) - (sphere center)
        let normalDir = subtract(r.pointAtParameter(t), new Vec3(0, 0, -1));
        let N = unitVecFrom(normalDir);

        return multiply(new Vec3(N.x()+1, N.y()+1, N.z()+1), 0.5);
    } else {
        let unitDir = unitVecFrom(r.direction());
        t = 0.5 * (unitDir.y() + 1.0);
        // linear interpolation for background
        return add(multiply(new Vec3(1, 1, 1), 1 - t),
            multiply(new Vec3(.5, .7, 1), t));
    }
}

function main() {
    console.log('hi');
    let nx = 200;
    let ny = 100;
    fs.appendFileSync('./image.ppm', `P3\n${nx} ${ny}\n255\n`);

    let bottomLeft = new Vec3(-2, -1, -1);
    let horiz = new Vec3(4, 0, 0);
    let vert = new Vec3(0, 2, 0);
    let origin = new Vec3(0, 0, 0);
    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            let u = i / nx;
            let v = j / ny;
            let direction = add(add(multiply(horiz, u), bottomLeft), multiply(vert, v));
            let ray = new Ray(origin, direction);
            let col = color(ray);
            let ir = Math.floor(255.99 * col.x());
            let ig = Math.floor(255.99 * col.y());
            let ib = Math.floor(255.99 * col.z());
            fs.appendFileSync('./image.ppm', `${ir} ${ig} ${ib}\n`);
        }
    }
}

main();