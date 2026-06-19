/* ═══════════════════════════════════════════════════════
   🐾 CAT ANIMATIONS - LegionX Shoutout
   Floating paw prints, hearts, sparkles on canvas
   Cat walking, purring, and interactive effects
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── CONFIG ───────────────────────────────────── */
    const CFG = {
        pawCount:      18,    // max paw particles alive at once
        spawnInterval: 900,   // ms between new particles
        catEmojis:     ['🐱', '😺', '😸', '🐾', '🐈', '🐈‍⬛'],
        heartColors:   ['#ff8c2a', '#ffaa55', '#ffcc00', '#e05a00', '#c47a00'],
        pinkGlow:      'rgba(255, 140, 42, 0.7)',
    };

    /* ─── STATE ─────────────────────────────────────── */
    let canvas, ctx;
    let particles = [];
    let animFrame;
    let spawnTimer;
    let catEmojiEl;

    /* ─── WAIT FOR DOM ──────────────────────────────── */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupCanvas();
        setupCatWalker();
        spawnParticles();
        tick();
    }

    /* ─── CANVAS SETUP ──────────────────────────────── */
    function setupCanvas() {
        canvas = document.getElementById('cat-paw-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /* ─── CAT WALKER SETUP ──────────────────────────── */
    function setupCatWalker() {
        catEmojiEl = document.getElementById('cat-walker');
        if (!catEmojiEl) return;

        // Randomize which cat emoji is shown
        const emojis = ['🐱', '😺', '😸', '🐈', '🐈‍⬛'];
        catEmojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Add tiny bounce / walk bob animation via JS
        let bobDir = 1;
        let bobY   = 0;
        let bobT   = 0;

        function bobStep() {
            bobT += 0.12;
            bobY  = Math.sin(bobT) * 4;
            catEmojiEl.style.transform = `translateY(${bobY}px)`;
            requestAnimationFrame(bobStep);
        }
        bobStep();

        // Randomise the animation delay so it doesn't always start at screen edge
        const delay = -(Math.random() * 18);
        catEmojiEl.style.animationDelay = `${delay}s`;

        // Change cat emoji each walk cycle
        catEmojiEl.addEventListener('animationiteration', () => {
            catEmojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        });
    }

    /* ─── PARTICLE FACTORY ──────────────────────────── */
    function createPawParticle() {
        const types = ['paw', 'heart', 'sparkle', 'fish'];
        const type  = types[Math.floor(Math.random() * types.length)];

        return {
            type,
            x:     Math.random() * window.innerWidth,
            y:     window.innerHeight + 20,
            size:  10 + Math.random() * 22,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: -(0.5 + Math.random() * 1.2),
            opacity: 0.6 + Math.random() * 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.04,
            color:  CFG.heartColors[Math.floor(Math.random() * CFG.heartColors.length)],
            life:   0,
            maxLife: 200 + Math.random() * 180,
            wobbleT: Math.random() * Math.PI * 2,
            wobbleAmp: 0.3 + Math.random() * 0.8,
        };
    }

    function spawnParticles() {
        spawnTimer = setInterval(() => {
            if (particles.length < CFG.pawCount) {
                particles.push(createPawParticle());
                // Occasionally spawn 2
                if (Math.random() < 0.25) {
                    particles.push(createPawParticle());
                }
            }
        }, CFG.spawnInterval);
    }

    /* ─── DRAWING ───────────────────────────────────── */

    function drawPaw(ctx, x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = CFG.pinkGlow;
        ctx.shadowBlur  = 10;

        // Main pad
        ctx.beginPath();
        ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Toe beans
        const toeOffsets = [
            [-size*0.35, -size*0.5],
            [ size*0.35, -size*0.5],
            [-size*0.55, -size*0.2],
            [ size*0.55, -size*0.2],
        ];
        const toeR = size * 0.22;
        for (const [dx, dy] of toeOffsets) {
            ctx.beginPath();
            ctx.arc(x + dx, y + dy, toeR, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawHeart(ctx, x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        const s = size * 0.55;
        ctx.moveTo(x, y + s * 0.4);
        ctx.bezierCurveTo(x, y, x - s, y, x - s, y - s * 0.5);
        ctx.bezierCurveTo(x - s, y - s * 1.2, x, y - s * 1.1, x, y - s * 0.6);
        ctx.bezierCurveTo(x, y - s * 1.1, x + s, y - s * 1.2, x + s, y - s * 0.5);
        ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.4);
        ctx.fill();
        ctx.restore();
    }

    function drawSparkle(ctx, x, y, size, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur  = 10;
        const arms = 4;
        for (let i = 0; i < arms; i++) {
            const angle = (i / arms) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * size * 0.7,
                y + Math.sin(angle) * size * 0.7
            );
            ctx.stroke();
            // Cross arms (shorter)
            const a2 = angle + Math.PI / arms;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(a2) * size * 0.35,
                y + Math.sin(a2) * size * 0.35
            );
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawFish(ctx, x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        // Body
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.7, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.beginPath();
        ctx.moveTo(x + size * 0.65, y);
        ctx.lineTo(x + size * 1.1, y - size * 0.4);
        ctx.lineTo(x + size * 1.1, y + size * 0.4);
        ctx.closePath();
        ctx.fill();
        // Eye
        ctx.fillStyle = '#fff0f7';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(x - size * 0.35, y - size * 0.05, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /* ─── MAIN ANIMATION LOOP ───────────────────────── */
    function tick() {
        if (!canvas || !ctx) { animFrame = requestAnimationFrame(tick); return; }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const toRemove = [];

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.life++;
            p.wobbleT += 0.04;
            p.x += p.speedX + Math.sin(p.wobbleT) * p.wobbleAmp;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            // Fade in / fade out
            let alpha = p.opacity;
            if (p.life < 20)                     alpha *= p.life / 20;
            else if (p.life > p.maxLife - 40)    alpha *= (p.maxLife - p.life) / 40;
            if (alpha <= 0) { toRemove.push(i); continue; }

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            switch (p.type) {
                case 'paw':     drawPaw(ctx, 0, 0, p.size, p.color);     break;
                case 'heart':   drawHeart(ctx, 0, 0, p.size, p.color);   break;
                case 'sparkle': drawSparkle(ctx, 0, 0, p.size, p.color); break;
                case 'fish':    drawFish(ctx, 0, 0, p.size, p.color);    break;
            }

            ctx.restore();
        }

        // Remove dead particles (reverse order to keep indices valid)
        for (let j = toRemove.length - 1; j >= 0; j--) {
            particles.splice(toRemove[j], 1);
        }

        animFrame = requestAnimationFrame(tick);
    }

    /* ─── SHOUTOUT CARD ENTRANCE ENHANCEMENT ─────────── */
    // When the shoutout card shows, emit a burst of particles from it
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
                const el = m.target;
                if (el.classList.contains('show')) {
                    burstParticles(
                        window.innerWidth  / 2,
                        window.innerHeight / 2 - 80,
                        20
                    );
                }
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const card = document.getElementById('shoutout-card');
        if (card) {
            observer.observe(card, { attributes: true });
        }
    });

    function burstParticles(cx, cy, count) {
        for (let i = 0; i < count; i++) {
            const p = createPawParticle();
            const angle = (i / count) * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3;
            p.x = cx + (Math.random() - 0.5) * 120;
            p.y = cy + (Math.random() - 0.5) * 60;
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed - 1;
            p.size   = 6 + Math.random() * 16;
            p.maxLife = 90 + Math.random() * 60;
            particles.push(p);
        }
    }

    /* ─── PURR SOUND on card show (Web Audio API) ───── */
    // Generates a soft purr-like rumble using oscillators
    let audioCtx = null;

    function playPurrSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            const now = audioCtx.currentTime;
            const duration = 1.8;

            // Low frequency purr
            for (let i = 0; i < 3; i++) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(28 + i * 4, now);
                osc.frequency.exponentialRampToValueAtTime(22 + i * 3, now + duration);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
                gain.gain.setValueAtTime(0.06, now + duration - 0.2);
                gain.gain.linearRampToValueAtTime(0, now + duration);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + duration);
            }

            // High harmonic (cat-like)
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(440, now);
            osc2.frequency.exponentialRampToValueAtTime(330, now + 0.3);
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.04, now + 0.05);
            gain2.gain.linearRampToValueAtTime(0, now + 0.3);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(now);
            osc2.stop(now + 0.35);

        } catch (e) {
            // Audio not supported – silent fail
        }
    }

    // Hook into shoutout card mutation to play purr
    document.addEventListener('DOMContentLoaded', () => {
        const card = document.getElementById('shoutout-card');
        if (!card) return;

        const purObs = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === 'attributes' && m.target.classList.contains('show')) {
                    playPurrSound();
                }
            }
        });
        purObs.observe(card, { attributes: true });
    });

})();
