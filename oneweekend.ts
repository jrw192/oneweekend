declare function require(name: string): any;
const fs = require('fs');
import {Vec3} from './Vec3';
import {Ray} from './Ray';
import {add, subtract, multiply, divide, multiplyVecs, dot, unitVecFrom, randomInUnitSphere} from './utils';
import {Hitable, HitableList, HitRecord, Sphere, XyRect} from './Hitable';
import {Camera} from './Camera';
import {Material, Lambertian, Metal, Dieletric, DiffuseLight} from './Material';
import { MovingSphere } from './MovingSphere';
import { BvhNode } from './BvhNode';
import { CheckerTexture, ConstantTexture, NoiseTexture } from './Texture';

function color(r: Ray, world: HitableList, depth: number): Vec3 {
    let hitRecord: HitRecord = { u: 0, v: 0, t: 0, p: new Vec3(0, 0, 0), normal: new Vec3(0, 0, 0), material: new Lambertian(new ConstantTexture(new Vec3(0,0,0)))};

    // color surface of spheres
    if (world.hit(r, 0.001, Number.MAX_VALUE, hitRecord)) {
        let emitted = hitRecord.material.emit(hitRecord.u, hitRecord.v, hitRecord.p);
        let scatter = hitRecord.material.scatter(r, hitRecord);
        let scattered = hitRecord.material.scattered;
        let attenuation = hitRecord.material.attenuation;
        if (depth < 50 && scatter) {
            return add(emitted, multiplyVecs(attenuation, color(scattered,world, depth+1)));
        } else {
            return emitted;
        }
    } else {
        // let unitDir = unitVecFrom(r.direction());
        // let t = 0.5 * (unitDir.y() + 1.0);
        // // linear interpolation for background
        // return add(multiply(new Vec3(1, 1, 1), 1 - t),
        //     multiply(new Vec3(.5, .7, 1), t));

        // black background
        return new Vec3(0,0,0);
    }
}

function createRandomScene() {
    let list: Hitable[] = [];

    list.push(new Sphere(new Vec3(0,-1000,0), 1000, new Lambertian(new CheckerTexture(new ConstantTexture(new Vec3(.2,.3,.1)), new ConstantTexture(new Vec3(.9,.9,.9))))));

    let dim = 5;
    for (let i = -dim; i < dim; i++) {
        for (let j = -dim; j < dim; j++) {
            let chooseMat = Math.random();
            let center0 = new Vec3(i+.9*Math.random(), .2, j+.9*Math.random());
            if ((subtract(center0, new Vec3(4,.2,0))).length() > .9) {
                let center1 = add(center0, new Vec3(0,Math.random()/2,0));
                if (chooseMat < .8) {
                    list.push(new MovingSphere(center0, center1, 0, 1, 0.2, new Lambertian(new ConstantTexture(new Vec3(Math.random()*Math.random(),Math.random()*Math.random(),Math.random()*Math.random())))));
                } else if (chooseMat < .95) {
                    list.push(new Sphere(center0, 0.2, new Metal(new ConstantTexture(new Vec3(.5*(1+Math.random()),.5*(1+Math.random()),.5*(1+Math.random()))), .5*Math.random())));
                } else {
                    list.push(new Sphere(center0, .2, new Dieletric(1.5)));
                }
            }
        }
    }
    return list;
}

function createMainScene() {
    let list: Hitable[] = createRandomScene();
    list.push(new Sphere(new Vec3(0,1,0), 1, new Dieletric(1.5)));
    list.push(new Sphere(new Vec3(-4,1,0), 1, new Lambertian(new ConstantTexture(new Vec3(.5,.5,.5)))));
    list.push(new Sphere(new Vec3(4,1,0), 1, new Metal(new ConstantTexture(new Vec3(.7,.6,.5)), 0)));
    list.push(new Sphere(new Vec3(-4,1,6), 1, new Lambertian(new NoiseTexture(5))));

}

function createLightScene() {
    let list: Hitable[] = [];
    let texture = new NoiseTexture(4);
    list.push(new Sphere(new Vec3(0,-1000,0), 1000, new Lambertian(new ConstantTexture(new Vec3(.5,.5,.5)))));
    list.push(new Sphere(new Vec3(0,2,0), 2, new Lambertian(new ConstantTexture(new Vec3(.5,.5,.5)))));
    list.push(new Sphere(new Vec3(0,7,0), 2, new DiffuseLight(new ConstantTexture(new Vec3(4,4,4)))));
    list.push(new XyRect(3,5,1,3,-2, new DiffuseLight(new ConstantTexture(new Vec3(4,4,4)))));
    return list;
}

function main() {
    console.log('hi');
    let nx = 400;
    let ny = 200;
    let ns = 100;
    fs.appendFileSync('./image.ppm', `P3\n${nx} ${ny}\n255\n`);

    let list: Hitable[] = createLightScene();
    console.log('scene created');

    // let world: HitableList = new HitableList(list);

    let bvhNode = new BvhNode(list, list.length, 0, 1);
    let world: HitableList = new HitableList([bvhNode]);
    console.log('world created');

    let lookFrom = new Vec3(25,7,3);
    let lookAt = new Vec3(0,2,0);
    let focusDist = subtract(lookFrom, lookAt).length();
    let aperture = 0.1;
    let vFov = 20;
    let t0 = 0;
    let t1 = 1;
    let camera = new Camera(lookFrom, lookAt, new Vec3(0,1,0), vFov, nx/ny, aperture, focusDist, t0, t1);
    console.log('camera created');
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
    console.log('scene drawn');
}

console.time('main');
main();
console.timeEnd('main');
