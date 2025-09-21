declare function require(name: string): any;
const fs = require('fs');
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {add, subtract, multiply, divide, dot, unitVecFrom} from './utils';

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