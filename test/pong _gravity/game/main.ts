import {
    createCanvas,
    enableFullscreen,
    setupFullscreenButton,
    setupInput,
    resetInput,
    startEngine,
    drawRect,
    renderText,
    isKeyPressed,
    Key,
    drawCircle
} from "samengine";

import { makeCircle, makeRect, makeVector2d, normalize2d, scale2d } from "samengine/types";

// 👉 DEINE PHYSICS ENGINE IMPORTS
import { RigidBody, PhysicsObject, PhysicsWorld } from "samengine/physics"; 

const { canvas, ctx, applyScaling, virtualWidth, virtualHeight } = createCanvas({
    fullscreen: true,
    scaling: "fit",
    virtualWidth: 1920,
    virtualHeight: 1080
});

setupInput(canvas, virtualWidth, virtualHeight);

enableFullscreen(canvas);
setupFullscreenButton(canvas);

// ======================
// 🌍 PHYSICS WORLD
// ======================

let world = new PhysicsWorld();

// ======================
// 🏓 OBJECTS
// ======================

let ball: PhysicsObject;
let paddleLeft: PhysicsObject;
let paddleRight: PhysicsObject;
let floor: PhysicsObject;
let ceiling: PhysicsObject;

// ======================
// 🧮 SCORE
// ======================

let scoreLeft = 0;
let scoreRight = 0;

// Ball Speed
const speed = 500;

// ======================
// 🚀 INIT
// ======================

async function gameStart() {

    // Gravity 😈
    world.gravity = makeVector2d(0, 50);

    // Ball
    ball = new PhysicsObject(
        new RigidBody(makeVector2d(virtualWidth / 2, virtualHeight / 2), 1, 0.9),
        { type: "circle", radius: 12 }
    );

    ball.body.velocity = makeVector2d(400, -200);

    // Paddles (STATIC!)
    paddleLeft = new PhysicsObject(
        new RigidBody(makeVector2d(60, virtualHeight / 2), 1, 1, true),
        { type: "box", width: 20, height: 140 }
    );

    paddleRight = new PhysicsObject(
        new RigidBody(makeVector2d(virtualWidth - 60, virtualHeight / 2), 1, 1, true),
        { type: "box", width: 20, height: 140 }
    );

    // Floor + Ceiling
    floor = new PhysicsObject(
        new RigidBody(makeVector2d(virtualWidth / 2, virtualHeight + 20), 1, 1, true),
        { type: "box", width: virtualWidth, height: 40 }
    );

    ceiling = new PhysicsObject(
        new RigidBody(makeVector2d(virtualWidth / 2, -20), 1, 1, true),
        { type: "box", width: virtualWidth, height: 40 }
    );

    world.objects.push(ball, paddleLeft, paddleRight, floor, ceiling);
}

// ======================
// 🎮 GAME LOOP
// ======================

function gameLoop(dt: number) {

    ctx.clearRect(0, 0, virtualWidth, virtualHeight);
    applyScaling();

    clampBallSpeed(ball);

    // Background
    drawRect(ctx, makeRect(0, 0, virtualWidth, virtualHeight), "black");

    // ======================
    // 🎮 PADDLE CONTROL
    // ======================

    // Direct position move (kinematic style)
    if (isKeyPressed(Key.KeyW)) paddleLeft.body.position.y -= 800 * dt;
    if (isKeyPressed(Key.KeyS)) paddleLeft.body.position.y += 800 * dt;

    if (isKeyPressed(Key.ArrowUp)) paddleRight.body.position.y -= 800 * dt;
    if (isKeyPressed(Key.ArrowDown)) paddleRight.body.position.y += 800 * dt;

    // Clamp paddles
    paddleLeft.body.position.y = Math.max(70, Math.min(virtualHeight - 70, paddleLeft.body.position.y));
    paddleRight.body.position.y = Math.max(70, Math.min(virtualHeight - 70, paddleRight.body.position.y));

    // ======================
    // ⚡ PHYSICS STEP
    // ======================

    world.step(dt);

    // ======================
    // 🧮 SCORE (wenn Ball rausfliegt)
    // ======================

    if (ball.body.position.x < 0) {
        scoreRight++;
        resetBall();
    }

    if (ball.body.position.x > virtualWidth) {
        scoreLeft++;
        resetBall();
    }

    // ======================
    // 🎨 DRAW
    // ======================

    // Ball
    drawCircle(
        ctx,
        makeCircle(
            ball.body.position.x - 12,
            ball.body.position.y - 12,
            12
        ),
        "white"
    );

    // Paddles
    drawRect(
        ctx,
        makeRect(
            paddleLeft.body.position.x - 10,
            paddleLeft.body.position.y - 70,
            20,
            140
        ),
        "white"
    );

    drawRect(
        ctx,
        makeRect(
            paddleRight.body.position.x - 10,
            paddleRight.body.position.y - 70,
            20,
            140
        ),
        "white"
    );

    // Score
    renderText(ctx, scoreLeft.toString(), virtualWidth * 0.25, 80, "white", "60px Arial");
    renderText(ctx, scoreRight.toString(), virtualWidth * 0.75, 80, "white", "60px Arial");

    resetInput();
}

// ======================
// 🔁 RESET BALL
// ======================

function resetBall() {
    ball.body.position = makeVector2d(virtualWidth / 2, virtualHeight / 2);

    const dir = Math.random() > 0.5 ? 1 : -1;

    ball.body.velocity = makeVector2d(400 * dir, -300);
}

function clampBallSpeed(ball: PhysicsObject) {
  const dir = normalize2d(ball.body.velocity);
  ball.body.velocity = scale2d(dir, speed);
}

// ======================
// ▶️ START
// ======================

startEngine(() => { gameStart().then(() => {}) }, gameLoop);
