const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Получаем кнопки управления
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const shootButton = document.getElementById('shootButton');

const WIDTH = 800;
const HEIGHT = 600;

let player;
let bullets;
let enemies;
let score;
let gameOver;

function initGame() {
    player = {
        x: WIDTH / 2 - 25,
        y: HEIGHT - 50,
        width: 50,
        height: 40,
        color: 'blue',
        speed: 5,
        lives: 3
    };

    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;

    for (let i = 0; i < 8; i++) {
        spawnEnemy();
    }

    restartButton.style.display = 'none';
}

function spawnEnemy() {
    const type = Math.random() < 0.1 ? 'life' : 'normal';
    const enemy = {
        x: Math.random() * (WIDTH - 40),
        y: Math.random() * -200,
        type: type,
        color: type === 'life' ? 'yellow' : 'red'
    };
    enemies.push(enemy);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'green';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 15);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, 40, 30);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawLives() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Lives: ${player.lives}`, WIDTH - 150, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', WIDTH / 2, HEIGHT / 2);
    restartButton.style.display = 'block';
}

function update() {
    if (gameOver) return;

    bullets.forEach(bullet => {
        bullet.y -= 10;
    });

    enemies.forEach(enemy => {
        enemy.y += 3;
        if (enemy.y > HEIGHT) {
            enemy.y = -30;
            enemy.x = Math.random() * (WIDTH - 40);
        }
    });

    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + 40 &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 30 &&
                bullet.y + 15 > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                spawnEnemy();
            }
        });
    });

    enemies.forEach(enemy => {
        if (player.x < enemy.x + 40 &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + 30 &&
            player.y + player.height > enemy.y) {
            if (enemy.type === 'life') {
                player.lives += 1;
            } else {
                player.lives -= 1;
            }
            if (player.lives <= 0) {
                gameOver = true;
            }
            enemy.y = -30;
            enemy.x = Math.random() * (WIDTH - 40);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();
    drawLives();

    if (gameOver) {
        drawGameOver();
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Обработчики для кнопок управления
leftButton.addEventListener('touchstart', () => {
    if (player.x > 0) {
        player.x -= player.speed;
    }
});

rightButton.addEventListener('touchstart', () => {
    if (player.x < WIDTH - player.width) {
        player.x += player.speed;
    }
});

upButton.addEventListener('touchstart', () => {
    if (player.y > 0) {
        player.y -= player.speed;
    }
});

downButton.addEventListener('touchstart', () => {
    if (player.y < HEIGHT - player.height) {
        player.y += player.speed;
    }
});

shootButton.addEventListener('touchstart', () => {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
});

// Обработчик для кнопки перезапуска
restartButton.addEventListener('click', () => {
    initGame();
    gameLoop();
});

// Инициализация игры при загрузке страницы
initGame();
gameLoop();