type GameLoop = (dt: number) => void;

let lastTime = 0;
let loop: GameLoop;

export function startEngine(start: () => void, gameLoop: GameLoop) {
  loop = gameLoop;
  start();

  requestAnimationFrame(run);
}

function run(time: number) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  loop(dt);

  requestAnimationFrame(run);
}
