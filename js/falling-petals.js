// Falling Petals Effect - Using real petal image
// Hiệu ứng cánh hoa đào rơi mượt mà với ảnh thật

(function() {
    'use strict';
    
    const PetalFall = {
        canvas: null,
        ctx: null,
        petals: [],
        petalCount: 80,
        animationId: null,
        petalImage: null,
        imageLoaded: false,
        celebrationCanvas: null,
        celebrationCtx: null,
        celebrationPetals: [],
        
        init() {
            this.loadImage();
            this.createCanvas();
            this.createCelebrationCanvas();
            
            // Handle resize
            window.addEventListener('resize', () => {
                this.resize();
                this.resizeCelebrationCanvas();
            });
        },
        
        loadImage() {
            this.petalImage = new Image();
            this.petalImage.onload = () => {
                this.imageLoaded = true;
                this.createPetals();
                this.animate();
            };
            this.petalImage.onerror = () => {
                console.warn('Petal image not found, using fallback');
                this.imageLoaded = false;
                this.createPetals();
                this.animate();
            };
            this.petalImage.src = 'images/petal.png';
        },
        
        createCanvas() {
            // Create fullscreen canvas for falling petals
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'petalCanvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 5;
            `;
            
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
        },
        
        createCelebrationCanvas() {
            // Create full-screen canvas for celebration effects
            this.celebrationCanvas = document.createElement('canvas');
            this.celebrationCanvas.id = 'celebrationCanvas';
            this.celebrationCanvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(this.celebrationCanvas);
            this.celebrationCtx = this.celebrationCanvas.getContext('2d');
            this.resizeCelebrationCanvas();
        },
        
        resizeCelebrationCanvas() {
            if (!this.celebrationCanvas) return;
            this.celebrationCanvas.width = window.innerWidth;
            this.celebrationCanvas.height = window.innerHeight;
        },
        
        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },
        
        createPetals() {
            this.petals = [];
            for (let i = 0; i < this.petalCount; i++) {
                this.petals.push(this.createPetal(true));
            }
        },
        
        createPetal(randomY = false) {
            return {
                x: Math.random() * (this.canvas?.width || 500),
                y: randomY ? Math.random() * (this.canvas?.height || 600) - 50 : -40,
                size: 20 + Math.random() * 25, // Size for image
                speedY: 0.6 + Math.random() * 1.0,
                speedX: (Math.random() - 0.5) * 0.6,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                wobblePhase: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.015 + Math.random() * 0.015,
                wobbleAmount: 1 + Math.random() * 1.5,
                opacity: 0.7 + Math.random() * 0.3,
                scale: 0.5 + Math.random() * 0.5, // Random scale variation
                flipX: Math.random() > 0.5, // Flip horizontally for variety
                flipSpeed: (Math.random() - 0.5) * 0.02 // 3D flip effect
            };
        },
        
        drawPetal(petal) {
            this.drawPetalOnCanvas(this.ctx, petal);
        },
        
        drawPetalOnCanvas(ctx, petal) {
            const { x, y, size, rotation, opacity, scale, flipX } = petal;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.scale(flipX ? -scale : scale, scale);
            ctx.globalAlpha = opacity;
            
            if (this.imageLoaded && this.petalImage) {
                // Draw image petal
                ctx.drawImage(
                    this.petalImage,
                    -size / 2,
                    -size / 2,
                    size,
                    size
                );
            } else {
                // Fallback: draw simple pink petal
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
                gradient.addColorStop(0, '#FFD1DC');
                gradient.addColorStop(0.5, '#FFB6C1');
                gradient.addColorStop(1, '#FF69B4');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size / 3, size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        },
        
        update() {
            const width = this.canvas.width;
            const height = this.canvas.height;
            
            this.petals.forEach((petal, index) => {
                // Wobble movement
                petal.wobblePhase += petal.wobbleSpeed;
                const wobbleX = Math.sin(petal.wobblePhase) * petal.wobbleAmount;
                
                // Update position
                petal.x += petal.speedX + wobbleX * 0.3;
                petal.y += petal.speedY;
                petal.rotation += petal.rotationSpeed;
                
                // Wind effect - slight horizontal drift
                petal.x += Math.sin(petal.y * 0.01) * 0.15;
                
                // Reset if out of bounds
                if (petal.y > height + 50 || petal.x < -60 || petal.x > width + 60) {
                    this.petals[index] = this.createPetal(false);
                }
            });
        },
        
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.petals.forEach(petal => {
                this.drawPetal(petal);
            });
        },
        
        animate() {
            this.update();
            this.draw();
            this.updateCelebrationPetals();
            this.drawCelebrationPetals();
            this.animationId = requestAnimationFrame(() => this.animate());
        },
        
        updateCelebrationPetals() {
            const width = this.celebrationCanvas.width;
            const height = this.celebrationCanvas.height;
            
            this.celebrationPetals = this.celebrationPetals.filter(petal => {
                // Update position
                petal.wobblePhase += petal.wobbleSpeed;
                const wobbleX = Math.sin(petal.wobblePhase) * petal.wobbleAmount;
                
                petal.x += petal.speedX + wobbleX * 0.3;
                petal.y += petal.speedY;
                petal.rotation += petal.rotationSpeed;
                petal.speedY += 0.15; // Gravity
                
                // Fade out
                petal.opacity -= 0.01;
                
                // Keep if still visible and in bounds
                return petal.opacity > 0 && petal.y < height + 100;
            });
        },
        
        drawCelebrationPetals() {
            this.celebrationCtx.clearRect(0, 0, this.celebrationCanvas.width, this.celebrationCanvas.height);
            
            this.celebrationPetals.forEach(petal => {
                this.drawPetalOnCanvas(this.celebrationCtx, petal);
            });
        },
        
        drawPetalOnCanvas(ctx, petal) {
            const { x, y, size, rotation, opacity, scale, flipX } = petal;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.scale(flipX ? -scale : scale, scale);
            ctx.globalAlpha = opacity;
            
            if (this.imageLoaded && this.petalImage) {
                ctx.drawImage(
                    this.petalImage,
                    -size / 2,
                    -size / 2,
                    size,
                    size
                );
            } else {
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
                gradient.addColorStop(0, '#FFD1DC');
                gradient.addColorStop(0.5, '#FFB6C1');
                gradient.addColorStop(1, '#FF69B4');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size / 3, size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        },
        
        // Burst effect when answer is correct
        burst(x, y, count = 15) {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                const speed = 3 + Math.random() * 5;
                
                const petal = {
                    x: x,
                    y: y,
                    size: 25 + Math.random() * 20,
                    speedY: Math.sin(angle) * speed - 3,
                    speedX: Math.cos(angle) * speed,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.05,
                    wobblePhase: Math.random() * Math.PI * 2,
                    wobbleSpeed: 0.02 + Math.random() * 0.02,
                    wobbleAmount: 2 + Math.random() * 2,
                    opacity: 1,
                    scale: 0.6 + Math.random() * 0.6,
                    flipX: Math.random() > 0.5
                };
                
                this.celebrationPetals.push(petal);
            }
        },
        
        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            if (this.canvas && this.canvas.parentElement) {
                this.canvas.parentElement.removeChild(this.canvas);
            }
            if (this.celebrationCanvas && this.celebrationCanvas.parentElement) {
                this.celebrationCanvas.parentElement.removeChild(this.celebrationCanvas);
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PetalFall.init());
    } else {
        PetalFall.init();
    }
    
    // Expose to global for burst effect
    window.PetalFall = PetalFall;
})();
