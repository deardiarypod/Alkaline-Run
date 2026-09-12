// ========================================
// ALKALINE RUN
// Game Logic
// ========================================

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");

const playButton = document.getElementById("play-button");
const player = document.getElementById("player");
const obstaclesContainer = document.getElementById("obstacles");
const levelCount = document.getElementById("level-count");

let gameRunning = false;
let isJumping = false;
let alkalineCount = 0;
let spawnTimer = null;
let animationFrame = null;


// ========================================
// PH BLOCKS
// 9.5 is the collectible
// Everything else is an obstacle
// ========================================

const phBlocks = [
    { ph: "3.5", color: "#e84b3c" },
    { ph: "6.0", color: "#f28c28" },
    { ph: "6.5", color: "#f4d03f" },
    { ph: "7.0", color: "#32a852" },
    { ph: "8.5", color: "#24a8c7" },
    { ph: "9.0", color: "#2878c8" },
    { ph: "9.5", color: "#744cff", collectible: true }
];


// ========================================
// START GAME
// ========================================

playButton.addEventListener("click", startGame);

function startGame() {
    startScreen.classList.remove("active");
    winScreen.classList.remove("active");
    gameScreen.classList.add("active");

    gameRunning = true;
    alkalineCount = 0;
    isJumping = false;

    levelCount.textContent = "0 / 10";
    obstaclesContainer.innerHTML = "";

    player.classList.remove("jumping", "rattle", "capture");

    // First block
    setTimeout(() => {
        if (gameRunning) {
            spawnBlock();
        }
    }, 900);

    // Continue spawning blocks
    spawnTimer = setInterval(() => {
        if (gameRunning) {
            spawnBlock();
        }
    }, 2200);

    checkCollisions();
}


// ========================================
// JUMP
// ========================================

function jump() {
    if (!gameRunning || isJumping) {
        return;
    }

    isJumping = true;
    player.classList.add("jumping");

    setTimeout(() => {
        player.classList.remove("jumping");
        isJumping = false;
    }, 700);
}


// Tap anywhere during gameplay
gameScreen.addEventListener("pointerdown", jump);


// Keyboard support for computer testing
document.addEventListener("keydown", (event) => {
    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {
        event.preventDefault();
        jump();
    }
});


// ========================================
// CREATE PH BLOCK
// ========================================

function spawnBlock() {
    if (!gameRunning) {
        return;
    }

    /*
       Give 9.5 a slightly higher chance of appearing
       so the birthday game doesn't take forever.
    */

    let blockData;

    if (Math.random() < 0.32) {
        blockData = phBlocks.find(block => block.ph === "9.5");
    } else {
        const obstacleBlocks =
            phBlocks.filter(block => block.ph !== "9.5");

        blockData =
            obstacleBlocks[
                Math.floor(Math.random() * obstacleBlocks.length)
            ];
    }

    const block = document.createElement("div");

    block.classList.add("ph-block");
    block.dataset.ph = blockData.ph;
    block.dataset.collectible =
        blockData.collectible ? "true" : "false";

    block.dataset.processed = "false";

    block.textContent = blockData.ph;
    block.style.backgroundColor = blockData.color;

    if (blockData.collectible) {
        block.classList.add("collectible");
    }

    obstaclesContainer.appendChild(block);

    requestAnimationFrame(() => {
        block.classList.add("moving");
    });

    // Remove after it travels off screen
    setTimeout(() => {
        if (block.parentNode) {
            block.remove();
        }
    }, 4300);
}


// ========================================
// COLLISION DETECTION
// ========================================

function checkCollisions() {
    if (!gameRunning) {
        return;
    }

    const playerRect = player.getBoundingClientRect();

    const blocks =
        document.querySelectorAll(".ph-block");

    blocks.forEach(block => {
        if (block.dataset.processed === "true") {
            return;
        }

        const blockRect =
            block.getBoundingClientRect();

        const touching =
            playerRect.left < blockRect.right &&
            playerRect.right > blockRect.left &&
            playerRect.top < blockRect.bottom &&
            playerRect.bottom > blockRect.top;

        if (touching) {
            block.dataset.processed = "true";

            if (block.dataset.collectible === "true") {
                captureAlkaline(block);
            } else {
                hitObstacle(block);
            }
        }
    });

    animationFrame =
        requestAnimationFrame(checkCollisions);
}


// ========================================
// CAPTURE 9.5
// ========================================

function captureAlkaline(block) {
    alkalineCount++;

    if (alkalineCount > 10) {
        alkalineCount = 10;
    }

    levelCount.textContent =
        `${alkalineCount} / 10`;

    // Flash / pop the bottle
    player.classList.remove("capture");

    void player.offsetWidth;

    player.classList.add("capture");

    // Remove collected block immediately
    block.classList.remove("moving");
    block.classList.add("collected");

    setTimeout(() => {
        block.remove();
    }, 180);

    if (alkalineCount >= 10) {
        setTimeout(() => {
            winGame();
        }, 450);
    }
}


// ========================================
// HIT WRONG PH BLOCK
// ========================================

function hitObstacle(block) {
    // No points gained or lost.
    // Bottle simply rattles.

    player.classList.remove("rattle");

    void player.offsetWidth;

    player.classList.add("rattle");

    setTimeout(() => {
        player.classList.remove("rattle");
    }, 350);
}


// ========================================
// WIN GAME
// ========================================

function winGame() {
    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    clearInterval(spawnTimer);
    cancelAnimationFrame(animationFrame);

    obstaclesContainer.innerHTML = "";

    gameScreen.classList.remove("active");
    winScreen.classList.add("active");

    createConfetti();
}


// ========================================
// CONFETTI
// ========================================

function createConfetti() {
    const confettiContainer =
        document.getElementById("confetti");

    confettiContainer.innerHTML = "";

    const colors = [
        "#ff4fa3",
        "#ff9b42",
        "#ffe45e",
        "#43e97b",
        "#38cfff",
        "#8c5cff"
    ];

    for (let i = 0; i < 70; i++) {
        const piece =
            document.createElement("span");

        piece.classList.add("confetti-piece");

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.animationDuration =
            2 + Math.random() * 2 + "s";

        confettiContainer.appendChild(piece);
    }
}
