const textures: Record<string, HTMLImageElement> = {};

export function loadTextureCached(src: string): Promise<HTMLImageElement> {
    if (textures[src]) {
        // Bereits geladen → direkt zurückgeben
        return Promise.resolve(textures[src]);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            textures[src] = img; // speichern für später
            resolve(img);
        };

        img.onerror = reject;
    });
}

export function getTexture(src: string): HTMLImageElement | undefined {
    return textures[src];
}
