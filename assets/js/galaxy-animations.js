document.addEventListener('DOMContentLoaded', () => {
    // Inject canvas into galaxy-background
    const bgContainer = document.querySelector('.galaxy-background');
    if (!bgContainer) return;
    
    bgContainer.style.position = 'fixed';
    bgContainer.style.top = '0';
    bgContainer.style.left = '0';
    bgContainer.style.width = '100%';
    bgContainer.style.height = '100%';
    bgContainer.style.zIndex = '0';
    bgContainer.style.pointerEvents = 'none';

    const canvas = document.createElement('canvas');
    bgContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    let shootingStars = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 1; // slightly larger
            this.speed = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random() * 0.5 + 0.5; // Brighter baseline
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.03 + 0.01;
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0) {
                this.x = width;
                this.y = Math.random() * height;
            }
            this.opacity += this.fadeSpeed * this.fadeDir;
            if (this.opacity > 1) {
                this.opacity = 1;
                this.fadeDir = -1;
            } else if (this.opacity < 0.1) {
                this.opacity = 0.1;
                this.fadeDir = 1;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width * 2;
            this.y = -Math.random() * height;
            this.length = Math.random() * 100 + 50;
            this.speed = Math.random() * 15 + 10;
            this.angle = Math.PI / 4; // 45 degrees
            this.active = false;
        }
        update() {
            if (this.active) {
                this.x -= this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
                if (this.x < -this.length || this.y > height + this.length) {
                    this.active = false;
                }
            } else {
                if (Math.random() < 0.01) {
                    this.reset();
                    this.active = true;
                }
            }
        }
        draw() {
            if (!this.active) return;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    for (let i = 0; i < 150; i++) stars.push(new Star());
    for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

    let animationFrame;
    function animate() {
        // Clear background with slight opacity for trails
        ctx.clearRect(0, 0, width, height);

        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(s => { s.update(); s.draw(); });

        animationFrame = requestAnimationFrame(animate);
    }

    // Only animate when the shoutout card is active
    const card = document.getElementById('shoutout-card');
    
    // Check periodically if card has .show class
    let isAnimating = false;
    setInterval(() => {
        if (card.classList.contains('show')) {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        } else {
            if (isAnimating) {
                isAnimating = false;
                cancelAnimationFrame(animationFrame);
                ctx.clearRect(0, 0, width, height);
            }
        }
    }, 500);
});
