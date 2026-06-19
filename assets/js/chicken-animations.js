document.addEventListener('DOMContentLoaded', () => {
    const sizzleContainer = document.querySelector('.sizzle-container');
    if (!sizzleContainer) return;

    // Apply basic styles to the container
    sizzleContainer.style.position = 'absolute';
    sizzleContainer.style.top = '-100px';
    sizzleContainer.style.right = '-20px';
    sizzleContainer.style.width = '200px';
    sizzleContainer.style.height = '300px';
    sizzleContainer.style.pointerEvents = 'none';
    sizzleContainer.style.zIndex = '150';
    sizzleContainer.style.overflow = 'visible';

    let isAnimating = false;
    let particleInterval = null;

    function createParticle() {
        if (!isAnimating) return;

        const isSteam = Math.random() > 0.3; // 70% steam, 30% sizzle sparks
        const particle = document.createElement('div');
        
        particle.style.position = 'absolute';
        particle.style.bottom = '100px'; // Start near the bucket top
        particle.style.left = `${Math.random() * 120 + 40}px`;
        particle.style.borderRadius = '50%';

        if (isSteam) {
            // Steam particle
            particle.style.width = `${Math.random() * 15 + 10}px`;
            particle.style.height = `${Math.random() * 15 + 10}px`;
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            particle.style.filter = 'blur(4px)';
            particle.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
            
            // Random horizontal drift
            const drift = Math.random() * 40 - 20;
            const riseHeight = Math.random() * 100 + 100;
            
            sizzleContainer.appendChild(particle);
            
            // Trigger animation
            setTimeout(() => {
                particle.style.transform = `translate(${drift}px, -${riseHeight}px) scale(2)`;
                particle.style.opacity = '0';
            }, 10);
            
            // Cleanup
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 2000);
            
        } else {
            // Sizzle spark/grease droplet
            particle.style.width = `${Math.random() * 3 + 2}px`;
            particle.style.height = `${Math.random() * 3 + 2}px`;
            particle.style.backgroundColor = Math.random() > 0.5 ? '#FFA500' : '#FFD700'; // Orange or Gold
            particle.style.boxShadow = '0 0 4px #FF4500';
            particle.style.transition = 'transform 0.6s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.6s ease-in';
            
            const throwX = Math.random() * 100 - 50;
            const throwY = Math.random() * 60 + 40;
            
            sizzleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${throwX}px, -${throwY}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 600);
        }
    }

    const card = document.getElementById('shoutout-card');
    
    // Check periodically if card has .show class
    setInterval(() => {
        if (card.classList.contains('show')) {
            if (!isAnimating) {
                isAnimating = true;
                particleInterval = setInterval(createParticle, 150); // Create a particle every 150ms
            }
        } else {
            if (isAnimating) {
                isAnimating = false;
                clearInterval(particleInterval);
                sizzleContainer.innerHTML = ''; // Clear existing particles
            }
        }
    }, 500);
});
