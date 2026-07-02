// Ashish Choudhary — Portfolio 2026

(function () {
  "use strict";

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Animated counters in the stats cards
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");

  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  // Highlight the nav link for the section in view
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------------
  // Particle constellation in the hero — reacts to the mouse
  // ---------------------------------------------------------------
  var heroCanvas = document.getElementById("heroCanvas");

  if (heroCanvas && !reducedMotion) {
    var pctx = heroCanvas.getContext("2d");
    var hero = heroCanvas.parentElement;
    var particles = [];
    var mouse = { x: null, y: null };
    var heroVisible = true;
    var rafId = null;

    function sizeCanvas() {
      heroCanvas.width = hero.offsetWidth;
      heroCanvas.height = hero.offsetHeight;
      var count = Math.min(90, Math.floor((heroCanvas.width * heroCanvas.height) / 14000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function drawParticles() {
      pctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;

        pctx.beginPath();
        pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pctx.fillStyle = "rgba(34, 211, 238, 0.5)";
        pctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            pctx.beginPath();
            pctx.moveTo(p.x, p.y);
            pctx.lineTo(q.x, q.y);
            pctx.strokeStyle = "rgba(139, 92, 246, " + (0.18 * (1 - dist / 110)) + ")";
            pctx.lineWidth = 1;
            pctx.stroke();
          }
        }

        if (mouse.x !== null) {
          var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 160) {
            pctx.beginPath();
            pctx.moveTo(p.x, p.y);
            pctx.lineTo(mouse.x, mouse.y);
            pctx.strokeStyle = "rgba(34, 211, 238, " + (0.3 * (1 - mdist / 160)) + ")";
            pctx.lineWidth = 1;
            pctx.stroke();
          }
        }
      }

      rafId = heroVisible && !document.hidden ? requestAnimationFrame(drawParticles) : null;
    }

    hero.addEventListener("mousemove", function (e) {
      var rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", function () { mouse.x = null; mouse.y = null; });

    function wake() {
      if (rafId === null && heroVisible && !document.hidden) rafId = requestAnimationFrame(drawParticles);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        wake();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", wake);

    window.addEventListener("resize", sizeCanvas);
    sizeCanvas();
    drawParticles();
  }

  // ---------------------------------------------------------------
  // Typewriter effect on the hero role line
  // ---------------------------------------------------------------
  var typed = document.getElementById("typed");

  if (typed && !reducedMotion) {
    var roles = [
      "Staff Software Engineer (Frontend Heavy) @ Nagarro",
      "React & TypeScript specialist",
      "AI-assisted development builder",
      "LeetCode 4★ competitive programmer"
    ];
    var roleIdx = 0, charIdx = roles[0].length, deleting = true, firstPause = true;

    function typeTick() {
      var current = roles[roleIdx];

      if (firstPause) {
        firstPause = false;
        setTimeout(typeTick, 2600);
        return;
      }

      if (deleting) {
        charIdx--;
        typed.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
        setTimeout(typeTick, 26);
      } else {
        current = roles[roleIdx];
        charIdx++;
        typed.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeTick, 2400);
        } else {
          setTimeout(typeTick, 55);
        }
      }
    }
    setTimeout(typeTick, 1200);
  }

  // ---------------------------------------------------------------
  // 3D tilt on project cards
  // ---------------------------------------------------------------
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var rx = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
        var ry = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
        card.classList.add("tilting");
        card.style.transform =
          "translateY(-6px) perspective(800px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilting");
        card.style.transform = "";
      });
    });
  }

  // ---------------------------------------------------------------
  // Snake mini-game
  // ---------------------------------------------------------------
  var fab = document.getElementById("gameFab");
  var modal = document.getElementById("gameModal");
  var closeBtn = document.getElementById("gameClose");
  var startBtn = document.getElementById("gameStart");
  var scoreEl = document.getElementById("gameScore");
  var bestEl = document.getElementById("gameBest");
  var gCanvas = document.getElementById("snakeCanvas");

  if (fab && modal && gCanvas) {
    var gctx = gCanvas.getContext("2d");
    var CELL = 20;
    var GRID = gCanvas.width / CELL; // 18x18
    var snake, dir, dirQueue, food, score, timer, speed, playing = false;
    var best = 0;
    try { best = parseInt(localStorage.getItem("snakeBest"), 10) || 0; } catch (e) {}
    bestEl.textContent = best;

    function openModal() {
      modal.hidden = false;
      drawBoard();
      splash("Press Start");
    }

    function closeModal() {
      modal.hidden = true;
      stopGame();
    }

    fab.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (!modal.hidden && e.key === "Escape") closeModal();
    });

    function splash(msg) {
      gctx.fillStyle = "rgba(5, 8, 15, 0.6)";
      gctx.fillRect(0, 0, gCanvas.width, gCanvas.height);
      gctx.fillStyle = "#e6eaf2";
      gctx.font = "600 20px Sora, sans-serif";
      gctx.textAlign = "center";
      gctx.fillText(msg, gCanvas.width / 2, gCanvas.height / 2);
    }

    function drawBoard() {
      gctx.fillStyle = "#0a0e17";
      gctx.fillRect(0, 0, gCanvas.width, gCanvas.height);
    }

    function placeFood() {
      do {
        food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
      } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
    }

    function startGame() {
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 };
      dirQueue = [];
      score = 0;
      speed = 130;
      scoreEl.textContent = "0";
      placeFood();
      playing = true;
      startBtn.textContent = "Restart";
      clearInterval(timer);
      timer = setInterval(step, speed);
      render();
    }

    function stopGame() {
      playing = false;
      clearInterval(timer);
    }

    function gameOver() {
      stopGame();
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        try { localStorage.setItem("snakeBest", best); } catch (e) {}
        splash("New best: " + score + "! 🏆");
      } else {
        splash("Game over — " + score);
      }
    }

    function step() {
      if (dirQueue.length) dir = dirQueue.shift();
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      var hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
      var hitSelf = snake.some(function (s) { return s.x === head.x && s.y === head.y; });
      if (hitWall || hitSelf) { gameOver(); return; }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        placeFood();
        if (speed > 70) {
          speed -= 3;
          clearInterval(timer);
          timer = setInterval(step, speed);
        }
      } else {
        snake.pop();
      }

      render();
    }

    function render() {
      drawBoard();

      // food with glow
      gctx.save();
      gctx.shadowColor = "#22d3ee";
      gctx.shadowBlur = 12;
      gctx.fillStyle = "#22d3ee";
      gctx.beginPath();
      gctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.8, 0, Math.PI * 2);
      gctx.fill();
      gctx.restore();

      // snake: gradient head → tail
      snake.forEach(function (s, i) {
        var t = i / Math.max(snake.length - 1, 1);
        gctx.fillStyle = "rgb(" + Math.round(34 + t * 105) + "," + Math.round(211 - t * 119) + "," + Math.round(238 + t * 8) + ")";
        gctx.beginPath();
        var r = i === 0 ? 6 : 4;
        var x = s.x * CELL + 1, y = s.y * CELL + 1, w = CELL - 2, h = CELL - 2;
        gctx.moveTo(x + r, y);
        gctx.arcTo(x + w, y, x + w, y + h, r);
        gctx.arcTo(x + w, y + h, x, y + h, r);
        gctx.arcTo(x, y + h, x, y, r);
        gctx.arcTo(x, y, x + w, y, r);
        gctx.fill();
      });
    }

    startBtn.addEventListener("click", startGame);

    function queueDir(x, y) {
      var last = dirQueue.length ? dirQueue[dirQueue.length - 1] : dir;
      if (last.x === -x && last.y === -y) return; // no 180° turns
      if (last.x === x && last.y === y) return;
      dirQueue.push({ x: x, y: y });
    }

    document.addEventListener("keydown", function (e) {
      if (modal.hidden || !playing) return;
      var k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { queueDir(0, -1); e.preventDefault(); }
      else if (k === "arrowdown" || k === "s") { queueDir(0, 1); e.preventDefault(); }
      else if (k === "arrowleft" || k === "a") { queueDir(-1, 0); e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { queueDir(1, 0); e.preventDefault(); }
    });

    // touch: swipe to steer
    var touchStart = null;
    gCanvas.addEventListener("touchstart", function (e) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      e.preventDefault();
    }, { passive: false });
    gCanvas.addEventListener("touchend", function (e) {
      if (!touchStart || !playing) return;
      var dx = e.changedTouches[0].clientX - touchStart.x;
      var dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) queueDir(dx > 0 ? 1 : -1, 0);
      else queueDir(0, dy > 0 ? 1 : -1);
      touchStart = null;
      e.preventDefault();
    }, { passive: false });
  }
})();
