// Function to render Text
export function renderText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = "white",
    font = "20px Arial"
) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillText(text, x, y);
}
