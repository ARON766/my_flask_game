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
    speed: 5
};

const bullets = [];
const enemies = [];
let score = 0;

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

function update() {
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

    // Проверка столкновений
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
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
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