const board = document.getElementById("game-board");
const instrectionText = document.getElementById("instraction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highscore");

let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let barrier = null;
let direction = "right";
let isGameStarted = false;
let gameSpeedDelay = 200;
let highScore = 0;
let gameIntervalId;
let barrierElement = createElement("div", "barrier");

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    snakescore();
    if(snake.length >= 5 && barrier){
        // alert("if----->>>>")
        drawBarrier();
        
       }
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    let foodElement = createElement("div", "food");
    foodElement.textContent = "🍏";
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function generateBarrier() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    snake.unshift(head);

  


    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        gameSpeedDelay = Math.max(gameSpeedDelay - 5);
        barrier = generateBarrier();
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);

       
        // setPosition(barrierElement, barrier); 
    } else {
        snake.pop();
    }
}

function startGame() {
    isGameStarted = true;
    instrectionText.style.display = "none";

    logo.style.display = "none";
  
    // barrier = generateBarrier();
    // drawBarrier(); 

    gameIntervalId = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(e) {
    if ((!isGameStarted && e.code === "Space") ||
        (!isGameStarted && e.key === " ")) {
        startGame();
    } else {
        switch (e.key) {
            case "ArrowUp":
                if (direction !== "down") { direction = "up"; }
                break;
            case "ArrowDown":
                if (direction !== "up") { direction = "down"; }
                break;
            case "ArrowLeft":
                if (direction !== "right") { direction = "left"; }
                break;
            case "ArrowRight":
                if (direction !== "left") { direction = "right"; }
                break;
        }
    }
}

function checkCollision() {
    let head = { ...snake[0] };
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
    if (barrier && head.x === barrier.x && head.y === barrier.y) {
        resetGame();
    }
}

function resetGame() {
    stopGame();
    updateHighScore();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    snakescore();
}

function stopGame() {
    clearInterval(gameIntervalId);
    isGameStarted = false;
    logo.style.display = "block";
    instrectionText.style.display = "block";
}

function getCurrentScore() {
    return snake.length - 1 ;
}

function snakescore() {
    let currentScore = getCurrentScore();
    score.textContent = currentScore.toString().padStart(3, "0");
    if (currentScore >= 30) {
        board.style.backgroundColor = "pink";
    } else if (currentScore >= 25) {
        board.style.backgroundColor = "yellow";
    } else if (currentScore >= 20) {
        board.style.backgroundColor = "aqua";
    } else if (currentScore >= 15) {
        board.style.backgroundColor = "blue";
    } else if (currentScore >= 10) {
        board.style.backgroundColor = "red";
    } else {
        board.style.backgroundColor = "";
    }
}

function updateHighScore() {
    let currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
    }

    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}

function drawBarrier() {
    let barrierElement = createElement("div", "barrier");
    barrierElement.textContent = "🪨";
    barrierElement.style.gridColumn = barrier.x;
    barrierElement.style.gridRow = barrier.y;
    board.appendChild(barrierElement);
}

    

document.addEventListener("keydown", handleKeyPress);
