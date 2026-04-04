// Core Engine Exports
export { startEngine } from "./core.js";

// Rendering
export { renderText, renderBitmapText } from "./renderer.js";

// Input System
export { setupInput, isKeyJustPressed, resetInput, getMouse } from "./input.js";
export type { Mouse } from "./input.js";

// Logging
export { dlog } from "./logger.js";

// Save System
export { saveGame, loadGame, clearSave } from "./save.js";

// Texture Management
export { drawTexture, getTexture, type Texture, loadTextureAsync } from "./texture.js";

// HTML Generation
export { createCanvas, enableFullscreen, setupFullscreenButton } from "./html.js";

// Keys Reference
export { Key } from "./keys.js";
