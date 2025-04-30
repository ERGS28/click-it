document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const about = document.getElementById('about');
    const gameUI = document.getElementById('game-ui');
    const startBtn = document.getElementById('start-btn');
    const aboutBtn = document.getElementById('about-btn');
    const backMenuBtn = document.getElementById('back-menu');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const container = document.getElementById('game-container');
    const info = document.getElementById('info');
  
    let level = 1;
    let points = 0;
    let targetClicks = 0;
    let timeout;
    let balls = [];
  
    const levelSettings = [
      { targets: 3, obstacles: 0, speed: 1200, time: 20000 },
      { targets: 4, obstacles: 0, speed: 1100, time: 20000 },
      { targets: 5, obstacles: 1, speed: 1000, time: 18000 },
      { targets: 6, obstacles: 1, speed: 950,  time: 18000 },
      { targets: 6, obstacles: 2, speed: 850,  time: 16000 },
      { targets: 7, obstacles: 3, speed: 800,  time: 16000 },
      { targets: 8, obstacles: 4, speed: 750,  time: 14000 },
      { targets: 9, obstacles: 4, speed: 700,  time: 12000 },
      { targets: 10, obstacles: 5, speed: 650, time: 11000 },
      { targets: 12, obstacles: 6, speed: 600, time: 10000 },
    ];
  
    function randomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 50%)`;
    }
  
    function randomPosition() {
      const maxX = container.clientWidth - 60;
      const maxY = container.clientHeight - 60;
      return {
        x: Math.random() * maxX,
        y: Math.random() * maxY
      };
    }
  
    function moveBall(ball) {
      const { x, y } = randomPosition();
      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;
    }
  
    function animateBalls(speed) {
      balls.forEach(ball => {
        const interval = setInterval(() => {
          moveBall(ball);
        }, speed);
        ball.dataset.moveInterval = interval;
      });
    }
  
    function clearBallIntervals() {
      balls.forEach(ball => {
        clearInterval(ball.dataset.moveInterval);
      });
    }
  
    function createBall(type = "target") {
      const div = document.createElement('div');
      div.classList.add('ball');
      const { x, y } = randomPosition();
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
  
      if (type === "target") {
        div.style.backgroundColor = randomColor();
        div.dataset.type = "moving";
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          points++;
          div.remove();
          checkProgress();
        });
      } else {
        div.style.backgroundColor = "#fff"; // Obstáculo blanco
        div.dataset.type = "obstacle";
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          alert("💥 Tocaste un obstáculo. Nivel reiniciado.");
          restartLevel();
        });
      }
  
      container.appendChild(div);
      balls.push(div);
    }
  
    function generateLevel() {
      if (level > 10) {
        alert("🏆 ¡Has completado todos los niveles!");
        level = 1;
      }
  
      container.innerHTML = "";
      balls = [];
      points = 0;
  
      const { targets, obstacles, speed, time } = levelSettings[level - 1];
      targetClicks = targets;
  
      for (let i = 0; i < targets; i++) {
        createBall("target");
      }
  
      for (let i = 0; i < obstacles; i++) {
        createBall("obstacle");
      }
  
      updateInfo();
      animateBalls(speed);
  
      // ⚠️ Alerta especial para el nivel 3
      if (level === 3) {
        setTimeout(() => {
          alert("⚠️ ¡No hagas clic en la bola blanca!");
        }, 300);
      }
  
      timeout = setTimeout(() => {
        alert("⏱ ¡Tiempo agotado! Nivel reiniciado.");
        restartLevel();
      }, time);
    }
  
    function updateInfo() {
      info.textContent = `Nivel: ${level} | Objetivos restantes: ${targetClicks - points}`;
    }
  
    function checkProgress() {
      updateInfo();
      if (points >= targetClicks) {
        clearTimeout(timeout);
        clearBallIntervals();
        alert(`✅ ¡Nivel ${level} completado!`);
        level++;
        generateLevel();
      }
    }
  
    function restartLevel() {
      clearTimeout(timeout);
      clearBallIntervals();
      generateLevel();
    }
  
    // BOTONES DEL MENÚ PRINCIPAL
    startBtn.addEventListener('click', () => {
      menu.classList.add('hidden');
      about.classList.add('hidden');
      gameUI.classList.remove('hidden');
      backToMenuBtn.classList.remove('hidden');
      generateLevel();
    });
  
    aboutBtn.addEventListener('click', () => {
      menu.classList.add('hidden');
      about.classList.remove('hidden');
    });
  
    backMenuBtn.addEventListener('click', () => {
      about.classList.add('hidden');
      menu.classList.remove('hidden');
    });
  
    backToMenuBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      clearBallIntervals();
      gameUI.classList.add('hidden');
      backToMenuBtn.classList.add('hidden');
      menu.classList.remove('hidden');
    });
  });
  