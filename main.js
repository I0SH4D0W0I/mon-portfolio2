// main.js — version robuste (mettre à la racine / même dossier que tes pages)
document.addEventListener('DOMContentLoaded', () => {
  /* ------------------ apparition des sections ------------------ */
  const sections = document.querySelectorAll('.section');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    sections.forEach(s => observer.observe(s));
  }

  /* ------------------ bouton "Retour en haut" ------------------ */
  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    const toggleTop = () => topBtn.style.display = (window.scrollY > 300) ? 'block' : 'none';
    // état initial + écoute
    toggleTop();
    window.addEventListener('scroll', toggleTop);
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ------------------ mode sombre ------------------ */
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    // restaure préférence si souhaité (optionnel)
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
      toggleBtn.textContent = '☀️';
    } else {
      toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    }

    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      toggleBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // --- Bouton d’abonnement avec feux d’artifice rejouable ---
const subscribeBtn = document.getElementById('subscribeBtn');
const canvas = document.getElementById('fireworks');

if (subscribeBtn && canvas) {
  const ctx = canvas.getContext('2d');
  let fireworks = [];

    // Charger le son
  const explosionSound = new Audio("index1/explosion.mp3"); // chemin du son
  explosionSound.volume = 0.3; // volume doux

  // Ajuste la taille du canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Classe Feu d’artifice
  class Firework {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.particles = [];
      for (let i = 0; i < 200; i++) {
        this.particles.push({
          x: this.x,
          y: this.y,
          angle: Math.random() * 2 * Math.PI,
          speed: Math.random() * 6 + 2,
          radius: Math.random() * 3 + 1,
          alpha: 1
        });
      }
    }

    update() {
      this.particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + 0.2;
        p.alpha -= 0.015;
      });
      this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw(ctx) {
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${this.color}, ${p.alpha})`;
        ctx.fill();
      });
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(fw => {
      fw.update();
      fw.draw(ctx);
    });
    fireworks = fireworks.filter(fw => fw.particles.length > 0);
    requestAnimationFrame(animate);
  }
  animate();

  // Lancer les feux d’artifice
  function triggerFireworks() {
    const colors = [
      "255,0,0", "255,128,0", "255,255,0", "0,255,0", "0,255,128","0,200,255", "0,0,255", "180,0,255",
      "255,0,128", "255,0,255", "255,105,180", "255,165,0", "173,255,47", "0,255,255", "138,43,226", "255,20,147"
    ];

    // Lecture du son
    explosionSound.currentTime = 0;
    explosionSound.play().catch(() => {});


    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      fireworks.push(new Firework(x, y, color));
    }, i * 150);
    }
  }

  // Gestion du clic
  subscribeBtn.addEventListener('click', () => {
    // Feux d’artifice
    triggerFireworks();

    // Animation du bouton
    subscribeBtn.textContent = "Abonné ✅";
    subscribeBtn.disabled = true;
    subscribeBtn.style.background = "#666";
    subscribeBtn.style.cursor = "not-allowed";

    // Réactivation après 5 secondes
    setTimeout(() => {
      subscribeBtn.textContent = "S’abonner 🔔";
      subscribeBtn.disabled = false;
      subscribeBtn.style.background = "#ff0000";
      subscribeBtn.style.cursor = "pointer";
    }, 5000);
  });
}

// --- Jeu Snake amélioré 🐍 avec bouton "Lancer le jeu" ---
const canvasSnake = document.getElementById("snakeGame");
if (canvasSnake) {
  const ctx = canvasSnake.getContext("2d");
  const box = 20;
  const gridSize = canvasSnake.width / box;
  let snake, direction, score, food, game;
  const lancerBtn = document.getElementById("lancerSnake");
  const rejouerBtn = document.getElementById("rejouerSnake");

  // Fonction pour initialiser une nouvelle partie
  function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    food = randomFood();
    document.getElementById("snakeScore").textContent = "Score : 0";
    rejouerBtn.style.display = "none";
    lancerBtn.style.display = "none";
    if (game) clearInterval(game);
    game = setInterval(draw, 100);
  }

  // Nourriture aléatoire
  function randomFood() {
    return {
      x: Math.floor(Math.random() * gridSize) * box,
      y: Math.floor(Math.random() * gridSize) * box
    };
  }

  // Direction du serpent
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  });

  // Collision avec soi-même
  function collision(newHead, snakeArray) {
    return snakeArray.some(s => s.x === newHead.x && s.y === newHead.y);
  }

  // Effet visuel explosion quand on perd 💥
  function explosionEffect() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        ctx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.8)`;
        ctx.beginPath();
        ctx.arc(
          snake[0].x + Math.random() * 20 - 10,
          snake[0].y + Math.random() * 20 - 10,
          Math.random() * 6,
          0, Math.PI * 2
        );
        ctx.fill();
      }, i * 30);
    }
  }

  // Dessin du jeu
  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSnake.width, canvasSnake.height);

    // nourriture
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // serpent
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = (i === 0) ? "#00FF00" : "#00AA00";
      ctx.fillRect(snake[i].x, snake[i].y, box - 1, box - 1);
    }

    // tête
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // manger la pomme
    if (headX === food.x && headY === food.y) {
      score++;
      document.getElementById("snakeScore").textContent = "Score : " + score;
      food = randomFood();
    } else {
      snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // fin du jeu (remplace l'ancien bloc "fin de partie")
  if (
    headX < 0 || headY < 0 ||
    headX >= canvasSnake.width || headY >= canvasSnake.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);

    // explosion visuelle
    explosionEffect();

    // assombrir légèrement l'écran pour faire ressortir le message
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, canvasSnake.width, canvasSnake.height);

    // message "Game Over" centré
    ctx.fillStyle = "white";
    ctx.textAlign = "center";         // centre horizontalement
    ctx.textBaseline = "middle";      // centre verticalement par rapport à y donné
    ctx.font = "28px Arial";
    ctx.fillText("💀 GAME OVER 💀", canvasSnake.width / 2, canvasSnake.height / 2 - 18);

    // afficher le score sous le message (centré)
    ctx.font = "18px Arial";
    ctx.fillText("Score : " + score, canvasSnake.width / 2, canvasSnake.height / 2 + 18);

    // afficher le bouton Rejouer centré (CSS .snake-buttons gère le centrage)
    rejouerBtn.style.display = "inline-block";
    rejouerBtn.focus();

    return;
  }

    snake.unshift(newHead);
  }

  // Boutons
  lancerBtn.addEventListener("click", initGame);
  rejouerBtn.addEventListener("click", initGame);

  // État initial : affichage du bouton "Lancer le jeu"
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvasSnake.width, canvasSnake.height);
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Clique sur 🎮 Lancer le jeu", canvasSnake.width / 2, canvasSnake.height / 2);
}

  /* ------------------ mini-jeu : clique rapide ------------------ */
  const playBtn = document.getElementById('playBtn');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');

  if (playBtn && scoreDisplay && timerDisplay) {
    let score = 0;
    let timeLeft = 10;
    let timerInterval = null;
    let gameActive = false;

    const updateScore = () => scoreDisplay.textContent = `Score : ${score}`;
    const updateTimer = () => timerDisplay.textContent = `Temps restant : ${timeLeft}s`;

    playBtn.addEventListener('click', () => {
      if (!gameActive) {
        // démarrer la partie
        score = 0;
        timeLeft = 10;
        gameActive = true;
        updateScore();
        updateTimer();

        timerInterval = setInterval(() => {
          timeLeft--;
          updateTimer();
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            gameActive = false;
            timerDisplay.textContent = '⏳ Temps écoulé !';
            alert(`🎉 Partie terminée ! Ton score est de ${score} clics.`);
          }
        }, 1000);
      } else {
        // incrémenter le score pendant la partie
        score++;
        updateScore();
        // animation simple si tu l'ajoutes en CSS (.score-animate)
        scoreDisplay.classList.add('score-animate');
        setTimeout(() => scoreDisplay.classList.remove('score-animate'), 160);
      }
    });
  }
});
