// 2 Dimensional Vector Type

export type Vector2 = {
    x: number;
    y: number
};

// Function to normalize a Vector
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
