const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Размер одной "ячейки"
let gameInterval; // Переменная для управления интервалами

// Логика для "Змейки"
let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, box, box);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, box, box);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBox(food.x, food.y, "red");

    for (let segment of snake) {
        drawBox(segment.x, segment.y, "green");
    }

    let head = { ...snake[0] };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        alert("Игра окончена!");
        snake = [{ x: 5 * box, y: 5 * box }];
        direction = "RIGHT";
    }

    snake.unshift(head);
}

function startSnake() {
    clearInterval(gameInterval);
    direction = "RIGHT";
    snake = [{ x: 5 * box, y: 5 * box }];
    gameInterval = setInterval(drawGame, 100);
}

// Логика для "Тетриса"
let tetrisBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
let currentPiece;
let pieces = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]]
];

document.addEventListener("keydown", controlPiece);

function drawTetris() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tetrisBoard.length; y++) {
        for (let x = 0; x < tetrisBoard[y].length; x++) {
            if (tetrisBoard[y][x]) drawBox(x * box, y * box, "blue");
        }
    }

    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                drawBox((currentPiece.x + x) * box, (currentPiece.y + y) * box, "purple");
            }
        }
    }

    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        freezePiece();
        currentPiece = generateNewPiece();
        if (collision()) {
            alert("Игра окончена!");
            initTetris();
        }
    }
}

function collision() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (
                currentPiece.shape[y][x] &&
                (tetrisBoard[currentPiece.y + y]?.[currentPiece.x + x] || currentPiece.y + y >= tetrisBoard.length)
            ) {
                return true;
            }
        }
    }
}

function freezePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                tetrisBoard[currentPiece.y + y][currentPiece.x + x] = 1;
            }
        }
    }
}

function generateNewPiece() {
    let shape = pieces[Math.floor(Math.random() * pieces.length)];
    return { shape, x: Math.floor((10 - shape[0].length) / 2), y: 0 };
}

function rotatePiece() {
    currentPiece.shape = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
    );
    if (collision()) {
        currentPiece.shape = currentPiece.shape[0].map((_, index) =>
            currentPiece.shape.map(row => row.reverse()[index])
        );
    }
}

function controlPiece(event) {
    if (event.key === "ArrowLeft") {
        currentPiece.x--;
        if (collision()) currentPiece.x++;
    }
    if (event.key === "ArrowRight") {
        currentPiece.x++;
        if (collision()) currentPiece.x--;
    }
    if (event.key === "ArrowDown") {
        currentPiece.y++;
        if (collision()) currentPiece.y--;
    }
    if (event.key === "ArrowUp") {
        rotatePiece();
    }
}

function initTetris() {
    tetrisBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
    currentPiece = generateNewPiece();
    gameInterval = setInterval(drawTetris, 500);
}

function startTetris() {
    clearInterval(gameInterval);
    initTetris();
}

// Логика для "Уворота"
let players = [
    { x: 40, y: 100, color: "red", controls: { up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD" }, alive: true },
    { x: 360, y: 100, color: "blue", controls: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }, alive: true },
    { x: 40, y: 300, color: "green", controls: { up: "KeyI", down: "KeyK", left: "KeyJ", right: "KeyL" }, alive: true },
    { x: 360, y: 300, color: "yellow", controls: { up: "KeyT", down: "KeyG", left: "KeyF", right: "KeyH" }, alive: true }
];

let redLine = { x: 0, width: 20, speed: 2 }; // Красная линия
let gapPosition = Math.floor(Math.random() * (canvas.height - 100)) + 50; // Расположение прохода

document.addEventListener("keydown", movePlayers);

function drawDodgeGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(redLine.x, 0, redLine.width, canvas.height);

    ctx.clearRect(redLine.x, gapPosition, redLine.width, 50);

    for (let player of players) {
        if (player.alive) {
            drawBox(player.x, player.y, player.color);
        }
    }

    redLine.x += redLine.speed;

    for (let player of players) {
        if (
            player.alive &&
            redLine.x < player.x + 20 &&
            redLine.x + redLine.width > player.x &&
            !(player.y > gapPosition && player.y < gapPosition + 50)
        ) {
            player.alive = false;
        }
    }

    if (redLine.x > canvas.width) {
        redLine.x = 0;
        gapPosition = Math.floor(Math.random() * (canvas.height - 100)) + 50;
        redLine.speed *= 1.01; // Увеличиваем скорость линии на 1%
    }

    if (players.every(player => !player.alive)) {
        clearInterval(gameInterval);
        alert("Игра окончена!");
    }
}

function movePlayers(event) {
    for (let player of players) {
        if (player.alive) {
            if (event.code === player.controls.up && player.y > 0) player.y -= 20; // Движение вверх
            if (event.code === player.controls.down && player.y < canvas.height - 20) player.y += 20; // Движение вниз
            if (event.code === player.controls.left && player.x > 0) player.x -= 20; // Движение влево
            if (event.code === player.controls.right && player.x < canvas.width - 20) player.x += 20; // Движение вправо
        }
    }
}

function startDodgeGame() {
    clearInterval(gameInterval);
    players = [
        { x: 360, y: 80, color: "red", controls: { up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD" }, alive: true },
        { x: 360, y: 160, color: "blue", controls: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }, alive: true },
        { x: 360, y: 240, color: "green", controls: { up: "KeyI", down: "KeyK", left: "KeyJ", right: "KeyL" }, alive: true },
        { x: 360, y: 320, color: "yellow", controls: { up: "KeyT", down: "KeyG", left: "KeyF", right: "KeyH" }, alive: true }
    ];
    redLine = { x: 0, width: 20, speed: 2 };
    gapPosition = Math.floor(Math.random() * (canvas.height - 100)) + 50;
    gameInterval = setInterval(drawDodgeGame, 50);
}
