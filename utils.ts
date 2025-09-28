import { Vec3 } from './Vec3';

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
    return new Vec3(v1.y() * v2.z() - v1.z() * v2.y(),
        v1.z() * v2.x() - v1.x() * v2.z(),
        v1.x() * v2.y() - v1.y() * v2.x())
}

export function unitVecFrom(v1: Vec3): Vec3 {
    return divide(v1, v1.length());
}

export function randomInUnitSphere() {
    let unit = new Vec3(1, 1, 1);
    let p = (new Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    while (p.lengthSquared() >= 1) {
        p = (new Vec3(Math.random(), Math.random(), Math.random()).scale(2)).subtract(unit);
    }
    return p;
}

export function reflect(v1: Vec3, normal: Vec3) {
    let uv = unitVecFrom(v1);
    let bLength = dot(uv, normal);
    let b = multiply(normal, bLength);
    return subtract(v1, b.scale(2));
}

export function refract(v1: Vec3, normal: Vec3, niNt: number) {
    let uv = unitVecFrom(v1);
    let dt = dot(uv, normal);
    let discriminant = 1 - Math.pow(niNt, 2) * (1 - Math.pow(dt, 2));
    if (discriminant > 0) {
        return ((uv.subtract(multiply(normal, dt))).scale(niNt)).subtract(multiply(normal, Math.sqrt(discriminant)));
    }
    return undefined;
}

export function schlick(cosine: number, refIndex: number) {
    let r0 = (1 - refIndex) / (1 + refIndex);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
}