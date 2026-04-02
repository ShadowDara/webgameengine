// Rectangle Type for Hitboxes

import { type Vector2 } from "./vector2d";

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number
};

// Function to get the Center of the Width of the Object
export function centerRectX(rect: Rect): number {
    return (rect.x + (rect.width / 2));
}

// Function to get the Center of the Height of the Object
export function centerRectY(rect: Rect): number {
    return (rect.y + (rect.height / 2));
}

// Get the Center of a Rectangle
export function centerRect(rect: Rect): Vector2 {
    let vector: Vector2 = { x: centerRectX(rect), y: centerRectY(rect) };
    return vector;
}
