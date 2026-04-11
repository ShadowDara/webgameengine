// A empty Project with the Web Framework

import { createCanvas, enableFullscreen, setupFullscreenButton } from "samengine";
import { setupInput, resetInput, getMouse, isKeyJustPressed, Key } from "samengine";
import { startEngine } from "samengine";

const { canvas, ctx, applyScaling } = createCanvas({
    fullscreen: true,
    scaling: "fit",
    virtualWidth: window.innerWidth,
    virtualHeight: window.innerHeight
});

setupInput(canvas);

enableFullscreen(canvas);
setupFullscreenButton(canvas);

// ======================
// 🏓 GAME STATE
// ======================

let ball = {
    x: 0,
    y: 0,
    vx: 400,
    vy: 200,
    r: 10
};

let paddleLeft = {
    x: 30,
    y: 0,
    w: 20,
    h: 100,
    speed: 500
};

let paddleRight = {
    x: 0,
    y: 0,
    w: 20,
    h: 100,
    speed: 500
};

let scoreLeft = 0;
let scoreRight = 0;

// ======================
// 🚀 INIT
// ======================

async function gameStart() {
    resetBall();

    paddleLeft.y = canvas.height / 2;
    paddleRight.x = canvas.width - 50;
    paddleRight.y = canvas.height / 2;
}

// ======================
// 🔁 RESET BALL
// ======================

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    const dir = Math.random() > 0.5 ? 1 : -1;

    ball.vx = 400 * dir;
    ball.vy = (Math.random() * 2 - 1) * 300;
}

// ======================
// 🎮 GAME LOOP
// ======================

function gameLoop(dt: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyScaling();

    // ======================
    // 🎮 INPUT
    // ======================

    // Player Left (W/S)
    if (isKeyPressed(Key.KeyW)) {
        paddleLeft.y -= paddleLeft.speed * dt;
    }
    if (isKeyPressed(Key.KeyS)) {
        paddleLeft.y += paddleLeft.speed * dt;
    }

    // Player Right (Arrow Keys)
    if (isKeyPressed(Key.ArrowUp)) {
        paddleRight.y -= paddleRight.speed * dt;
    }
    if (isKeyPressed(Key.ArrowDown)) {
        paddleRight.y += paddleRight.speed * dt;
    }

    // Clamp paddles
    paddleLeft.y = Math.max(0, Math.min(canvas.height - paddleLeft.h, paddleLeft.y));
    paddleRight.y = Math.max(0, Math.min(canvas.height - paddleRight.h, paddleRight.y));

    // ======================
    // ⚡ BALL MOVE
    // ======================

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Top / Bottom bounce
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.vy *= -1;
    }

    if (ball.y + ball.r > canvas.height) {
        ball.y = canvas.height - ball.r;
        ball.vy *= -1;
    }

    // ======================
    // 💥 PADDLE COLLISION
    // ======================

    // Left paddle
    if (
        ball.x - ball.r < paddleLeft.x + paddleLeft.w &&
        ball.y > paddleLeft.y &&
        ball.y < paddleLeft.y + paddleLeft.h
    ) {
        ball.x = paddleLeft.x + paddleLeft.w + ball.r;
        ball.vx *= -1;

        // Winkel basierend auf Trefferpunkt
        const hit = (ball.y - paddleLeft.y) / paddleLeft.h;
        ball.vy = (hit - 0.5) * 600;
    }

    // Right paddle
    if (
        ball.x + ball.r > paddleRight.x &&
        ball.y > paddleRight.y &&
        ball.y < paddleRight.y + paddleRight.h
    ) {
        ball.x = paddleRight.x - ball.r;
        ball.vx *= -1;

        const hit = (ball.y - paddleRight.y) / paddleRight.h;
        ball.vy = (hit - 0.5) * 600;
    }

    // ======================
    // 🧮 SCORE
    // ======================

    if (ball.x < 0) {
        scoreRight++;
        resetBall();
    }

    if (ball.x > canvas.width) {
        scoreLeft++;
        resetBall();
    }

    // ======================
    // 🎨 DRAW
    // ======================

    ctx.fillStyle = "white";

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    // Paddles
    ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
    ctx.fillRect(paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);

    // Score
    ctx.font = "40px Arial";
    ctx.fillText(scoreLeft.toString(), canvas.width / 4, 50);
    ctx.fillText(scoreRight.toString(), canvas.width * 0.75, 50);

    resetInput();
}

// ======================
// ▶️ START
// ======================

startEngine(() => { gameStart().then(() => {}) }, gameLoop);
