declare function require(name: string): any;
const fs = require('fs');
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {add, subtract, multiply, divide, multiplyVecs, dot, unitVecFrom, randomInUnitSphere} from './utils';
import {Hitable, HitableList, HitRecord} from './Hitable';
import {Sphere} from './Sphere';
import {Camera} from './Camera';
import {Material, Lambertian, Metal, Dieletric} from './Material';

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

function color(r: Ray, world: HitableList, depth: number): Vec3 {
    let hitRecord: HitRecord = { t: 0, p: new Vec3(0, 0, 0), normal: new Vec3(0, 0, 0), material: new Lambertian(new Vec3(0,0,0))};

    // color surface of spheres
    if (world.hit(r, 0.001, Number.MAX_VALUE, hitRecord)) {
        let scatter = hitRecord.material.scatter(r, hitRecord);
        let scattered = hitRecord.material.scattered;
        let attenuation = hitRecord.material.albedo;
        // console.log('scatter', scatter);
        // console.log('scattered', scattered);
        // console.log('attenuation', attenuation);
        if (depth < 50 && scatter) {
            return multiplyVecs(attenuation, color(scattered,world, depth+1));
        } else {
            return new Vec3(0,0,0);
        }
    } else {
        let unitDir = unitVecFrom(r.direction());
        let t = 0.5 * (unitDir.y() + 1.0);
        // linear interpolation for background
        return add(multiply(new Vec3(1, 1, 1), 1 - t),
            multiply(new Vec3(.5, .7, 1), t));
    }
}

function main() {
    console.log('hi');
    let nx = 500;
    let ny = 250;
    let ns = 100;
    fs.appendFileSync('./image.ppm', `P3\n${nx} ${ny}\n255\n`);

    let list: Hitable[] = [];
    // list.push(new Sphere(new Vec3(0, 0, -1), 0.5, new Lambertian(new Vec3(.1,.2,.5))));
    // list.push(new Sphere(new Vec3(0, -100.5, -1), 100, new Lambertian(new Vec3(.8,.8,0))));
    // list.push(new Sphere(new Vec3(1, 0, -1), 0.5, new Metal(new Vec3(.8,.6,.2), 0)));
    // list.push(new Sphere(new Vec3(-1, 0, -1), 0.5, new Dieletric(1.5)));
    // list.push(new Sphere(new Vec3(-1, 0, -1), -.45, new Dieletric(1.5)));

    list.push(new Sphere(new Vec3(0,-1000,0), 1000, new Lambertian(new Vec3(.5,.5,.5))));
    for (let i = -11; i < 11; i++) {
        for (let j = -11; j < 11; j++) {
            let chooseMat = Math.random();
            let center = new Vec3(i+.9*Math.random(), .2, j+.9*Math.random());
            if ((subtract(center, new Vec3(4,.2,0))).length() > .9) {
                if (chooseMat < .8) {
                    list.push(new Sphere(center, 0.2, new Lambertian(new Vec3(Math.random()*Math.random(),Math.random()*Math.random(),Math.random()*Math.random()))));
                } else if (chooseMat < .95) {
                    list.push(new Sphere(center, 0.2, new Metal(new Vec3(.5*(1+Math.random()),.5*(1+Math.random()),.5*(1+Math.random())), .5*Math.random())));
                } else {
                    list.push(new Sphere(center, .2, new Dieletric(1.5)));
                }
            }
        }
    }
    list.push(new Sphere(new Vec3(0,1,0), 1, new Dieletric(1.5)));
    list.push(new Sphere(new Vec3(-4,1,0), 1, new Lambertian(new Vec3(.4,.2,.1))));
    list.push(new Sphere(new Vec3(4,1,0), 1, new Metal(new Vec3(.7,.6,.5), 0)));


    let world: HitableList = new HitableList(list);

    let lookFrom = new Vec3(13,2,3);
    let lookAt = new Vec3(0,0,0);
    let focusDist = subtract(lookFrom, lookAt).length();
    let aperture = 0.1;
    let vFov = 20;
    let camera = new Camera(lookFrom, lookAt, new Vec3(0,1,0), vFov, nx/ny, aperture, focusDist);
    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            let col = new Vec3(0,0,0);
            for (let s = 0; s < ns; s++) {
                let u = (i+Math.random()) / nx;
                let v = (j+Math.random()) / ny;
                let ray = camera.getRay(u,v);
                col.add(color(ray, world, 0));
            }
            col.scale(1/ns);
            col = new Vec3(Math.sqrt(col.r()), Math.sqrt(col.g()), Math.sqrt(col.b()))
            let ir = Math.floor(255.99 * col.x());
            let ig = Math.floor(255.99 * col.y());
            let ib = Math.floor(255.99 * col.z());
            fs.appendFileSync('./image.ppm', `${ir} ${ig} ${ib}\n`);
        }
    }
}

main();