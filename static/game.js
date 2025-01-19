const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = 800;
const HEIGHT = 600;

const player = {
    x: WIDTH / 2 - 25,
    y: HEIGHT - 50,
    width: 50,
    height: 40,
    color: 'blue',
    speed: 5,
    lives: 10 // Добавляем жизни игрока
};

const bullets = [];
const enemies = [];
let score = 0;
let gameOver = false; // Флаг для завершения игры

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
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
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
}

function update() {
    if (gameOver) return; // Останавливаем обновление, если игра завершена

    // Обновление позиции пуль
    bullets.forEach(bullet => {
        bullet.y -= 10;
    });

    // Обновление позиции врагов
    enemies.forEach(enemy => {
        enemy.y += 3;
        if (enemy.y > HEIGHT) {
            enemy.y = -30;
            enemy.x = Math.random() * (WIDTH - 40);
        }
    });

    // Проверка столкновений пуль с врагами
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + 40 &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 30 &&
                bullet.y + 15 > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                enemies.push({ x: Math.random() * (WIDTH - 40), y: -30 });
            }
        });
    });

    // Проверка столкновений игрока с врагами
    enemies.forEach(enemy => {
        if (player.x < enemy.x + 40 &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + 30 &&
            player.y + player.height > enemy.y) {
            player.lives -= 1; // Уменьшаем жизни
            if (player.lives <= 0) {
                gameOver = true; // Завершаем игру, если жизни закончились
            }
            // Перемещаем врага за пределы экрана после столкновения
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

document.addEventListener('keydown', (e) => {
    if (gameOver) return; // Игнорируем ввод, если игра завершена

    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    }
    if (e.key === 'ArrowRight' && player.x < WIDTH - player.width) {
        player.x += player.speed;
    }
    if (e.key === 'ArrowUp' && player.y > 0) {
        player.y -= player.speed;
    }
    if (e.key === 'ArrowDown' && player.y < HEIGHT - player.height) {
        player.y += player.speed;
    }
    if (e.key === ' ') {
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
    }
});

// Создание врагов
for (let i = 0; i < 8; i++) {
    enemies.push({ x: Math.random() * (WIDTH - 40), y: Math.random() * -200 });
}

gameLoop();