const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

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
        lives: 3 // Начальное количество жизней
    };

    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;

    // Создание врагов
    for (let i = 0; i < 8; i++) {
        spawnEnemy();
    }

    restartButton.style.display = 'none'; // Скрываем кнопку при старте игры
}

function spawnEnemy() {
    const type = Math.random() < 0.1 ? 'life' : 'normal'; // 10% шанс появления врага с жизнью
    const enemy = {
        x: Math.random() * (WIDTH - 40),
        y: Math.random() * -200,
        type: type, // Тип врага: 'normal' или 'life'
        color: type === 'life' ? 'yellow' : 'red' // Цвет врага
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
    restartButton.style.display = 'block'; // Показываем кнопку
}

function update() {
    if (gameOver) return;

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
                spawnEnemy(); // Создаем нового врага вместо удаленного
            }
        });
    });

    // Проверка столкновений игрока с врагами
    enemies.forEach(enemy => {
        if (player.x < enemy.x + 40 &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + 30 &&
            player.y + player.height > enemy.y) {
            if (enemy.type === 'life') {
                player.lives += 1; // Добавляем жизнь
            } else {
                player.lives -= 1; // Отнимаем жизнь
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

// Обработчик событий для управления игроком
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

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

// Обработчик для кнопки перезапуска
restartButton.addEventListener('click', () => {
    initGame(); // Перезапуск игры
    gameLoop(); // Запуск игрового цикла
});

// Инициализация игры при загрузке страницы
initGame();
gameLoop();