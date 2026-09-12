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
let jumpsCompleted = 0;
let spawnTimer = null;


// ========================================
// PH BLOCK COLORS
// ========================================

const phBlocks = [
    { ph: "3.5", color: "#e84b3c" },
    { ph: "6.0", color: "#f28c28" },
    { ph: "6.5", color: "#f4d03f" },
    { ph: "7.0", color: "#32a852" },
    { ph: "8.5", color: "#24a8c7" },
    { ph: "9.0", color: "#2878c8" },
    { ph: "9.5", color: "#6446b8" }
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
    jumpsCompleted = 0;

    levelCount.textContent = "0 / 10";

    obstaclesContainer.innerHTML = "";

    spawnObstacle();

    spawnTimer = setInterval(() => {
        if (gameRunning) {
            spawnObstacle();
        }
    }, 2300);
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


// Tap anywhere on the game screen to jump
gameScreen.addEventListener("pointerdown", jump);


// Keyboard support for testing on computer
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

function spawnObstacle() {

    if (!gameRunning) {
        return;
    }

    const blockData =
        phBlocks[Math.floor(Math.random() * phBlocks.length)];

    const block = document.createElement("div");

    block.classList.add("ph-block");

    block.textContent = blockData.ph;
    block.style.backgroundColor = blockData.color;

    obstaclesContainer.appendChild(block);

    // Give CSS time to place the block
    requestAnimationFrame(() => {
        block.classList.add("moving");
    });

    // Count this obstacle after it passes the player
    setTimeout(() => {

        if (!gameRunning) {
            block.remove();
            return;
        }

        jumpsCompleted++;

        if (jumpsCompleted > 10) {
            jumpsCompleted = 10;
        }

        levelCount.textContent =
            `${jumpsCompleted} / 10`;

        block.remove();

        if (jumpsCompleted >= 10) {
            winGame();
        }

    }, 4000);
}


// ========================================
// WIN GAME
// ========================================

function winGame() {

    gameRunning = false;

    clearInterval(spawnTimer);

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

        const piece = document.createElement("span");

        piece.classList.add("confetti-piece");

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.animationDuration =
            2 + Math.random() * 2 + "s";

        confettiContainer.appendChild(piece);
    }
}
