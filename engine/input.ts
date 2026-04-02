type KeyState = {
  pressed: boolean;
  justPressed: boolean;
  justReleased: boolean;
};

const keys: Record<string, KeyState> = {};
const mouse = {
  x: 0,
  y: 0,
  pressed: false,
  justPressed: false,
  justReleased: false,
};

export function setupInput(canvas: HTMLCanvasElement) {
  window.addEventListener("keydown", (e) => {
    if (!keys[e.code]) keys[e.code] = { pressed: false, justPressed: false, justReleased: false };
    const key = keys[e.code];
    if (!key.pressed) key.justPressed = true;
    key.pressed = true;
  });

  window.addEventListener("keyup", (e) => {
    if (!keys[e.code]) keys[e.code] = { pressed: false, justPressed: false, justReleased: false };
    const key = keys[e.code];
    key.pressed = false;
    key.justReleased = true;
  });

  canvas.addEventListener("mousedown", () => {
    if (!mouse.pressed) mouse.justPressed = true;
    mouse.pressed = true;
  });

  canvas.addEventListener("mouseup", () => {
    mouse.pressed = false;
    mouse.justReleased = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
}

export function isKeyPressed(code: string) {
  return keys[code]?.pressed || false;
}

export function isKeyJustPressed(code: string) {
  return keys[code]?.justPressed || false;
}

export function isKeyJustReleased(code: string) {
  return keys[code]?.justReleased || false;
}

export function getMouse() {
  return { ...mouse };
}

// Am Ende jedes Frames aufrufen
export function resetInput() {
  for (const k in keys) {
    keys[k].justPressed = false;
    keys[k].justReleased = false;
  }
  mouse.justPressed = false;
  mouse.justReleased = false;
}
