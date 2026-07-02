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

    // Each particle lives on a depth layer (z: 0.3 far … 1 near). Nearer
    // particles are bigger, faster, brighter, and shift more with the mouse —
    // a parallax camera effect that reads as real depth.
    var parallax = { x: 0, y: 0 };

    function sizeCanvas() {
      heroCanvas.width = hero.offsetWidth;
      heroCanvas.height = hero.offsetHeight;
      var count = Math.min(100, Math.floor((heroCanvas.width * heroCanvas.height) / 12000));
      particles = [];
      for (var i = 0; i < count; i++) {
        var z = Math.random() * 0.7 + 0.3;
        particles.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.45 * z,
          vy: (Math.random() - 0.5) * 0.45 * z,
          r: (Math.random() * 1.5 + 0.7) * (0.6 + z),
          z: z
        });
      }
    }

    function drawParticles() {
      var W = heroCanvas.width, H = heroCanvas.height;
      pctx.clearRect(0, 0, W, H);

      // Ease the parallax camera toward the mouse for a smooth glide
      var targetX = mouse.x !== null ? mouse.x - W / 2 : 0;
      var targetY = mouse.y !== null ? mouse.y - H / 2 : 0;
      parallax.x += (targetX - parallax.x) * 0.06;
      parallax.y += (targetY - parallax.y) * 0.06;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Projected position: deeper layers barely move, near layers sweep
        p.px = p.x - parallax.x * 0.06 * p.z;
        p.py = p.y - parallax.y * 0.06 * p.z;

        pctx.beginPath();
        pctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
        pctx.fillStyle = "rgba(34, 211, 238, " + (0.2 + 0.4 * p.z) + ")";
        pctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          if (q.px === undefined) continue;
          var dx = p.px - q.px, dy = p.py - q.py;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            var depth = (p.z + q.z) / 2;
            pctx.beginPath();
            pctx.moveTo(p.px, p.py);
            pctx.lineTo(q.px, q.py);
            pctx.strokeStyle = "rgba(139, 92, 246, " + (0.22 * depth * (1 - dist / 110)) + ")";
            pctx.lineWidth = depth;
            pctx.stroke();
          }
        }

        if (mouse.x !== null) {
          var mdx = p.px - mouse.x, mdy = p.py - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 170) {
            pctx.beginPath();
            pctx.moveTo(p.px, p.py);
            pctx.lineTo(mouse.x, mouse.y);
            pctx.strokeStyle = "rgba(34, 211, 238, " + (0.35 * p.z * (1 - mdist / 170)) + ")";
            pctx.lineWidth = p.z;
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
  // 3D tilt + light glare — applied across cards and the hero photo
  // ---------------------------------------------------------------
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function makeTilt(selector, maxDeg, lift) {
    document.querySelectorAll(selector).forEach(function (card) {
      card.classList.add("tilt3d");

      var glare = document.createElement("span");
      glare.className = "glare";
      glare.setAttribute("aria-hidden", "true");
      card.appendChild(glare);

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -2 * maxDeg;
        var ry = (px - 0.5) * 2 * maxDeg;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        card.classList.add("tilting");
        card.style.transform =
          "translateY(-" + lift + "px) perspective(900px)" +
          " rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilting");
        card.style.transform = "";
      });
    });
  }

  if (finePointer && !reducedMotion) {
    makeTilt(".project-card", 9, 6);
    makeTilt(".skill-card, .stat-card, .award, .edu-card, .testimonial", 6, 4);
    makeTilt(".photo-ring", 11, 0);
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
