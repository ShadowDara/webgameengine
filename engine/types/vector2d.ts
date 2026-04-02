// 2 Dimensional Vector Type

import { clamp } from "./math-utils";

export type Vector2 = {
    x: number;
    y: number
};

// Function to normalize a Vector 2d
export function normalize2d(vector: Vector2): Vector2 {
    // Check if the Vector is zero because then you dont need to
    // calculate sth
    if (vector.x == 0 && vector.y == 0) {
        return vector;
    }

    let produkt = vector.x * vector.x + vector.y * vector.y;
    let root = Math.sqrt(produkt);
    vector.x = vector.x / root;
    vector.y = vector.y / root;

    return vector;
}

// Function to clamp a Vector 2d
export function clamp2d(vector: Vector2, min: Vector2, max: Vector2): Vector2 {
    return {
        x: clamp(vector.x, min.x, max.x),
        y: clamp(vector.y, min.y, max.y),
    };
}
