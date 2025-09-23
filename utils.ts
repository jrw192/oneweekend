import {Vec3} from './Vec3';

export function newVec3From(v1: Vec3): Vec3 {
    return new Vec3(v1.x(), v1.y(), v1.z());
}

export function add(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).add(v2);
}

export function subtract(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).subtract(v2);
}

export function multiplyVecs(v1: Vec3, v2: Vec3): Vec3 {
    return newVec3From(v1).multiply(v2);
}

export function multiply(v1: Vec3, t: number) {
    return newVec3From(v1).scale(t);
}

export function divide(v1: Vec3, t: number) {
    return newVec3From(v1).scale(1 / t);
}

export function dot(v1: Vec3, v2: Vec3): number {
    let product = newVec3From(v1).multiply(v2);
    return product.x() + product.y() + product.z();
}

export function cross(v1: Vec3, v2: Vec3) {
    // TBC
}

export function unitVecFrom(v1: Vec3): Vec3 {
    return divide(v1, v1.length());
}

export function randomInUnitSphere() {
    let unit = new Vec3(1,1,1);
    let p = (new Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    while (p.lengthSquared() >= 1) {
        p = (new Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    }
    return p;
}

export function reflect(v1: Vec3, normal: Vec3) {
    let bLength = dot(v1, normal);
    let b = multiply(normal, bLength);
    return subtract(v1, b.scale(2));
}