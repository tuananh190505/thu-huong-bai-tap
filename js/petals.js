// Falling Petals Animation Module
// Hiệu ứng hoa đào rơi đẹp mắt với Canvas

const FallingPetals = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    petals: [],
    maxPetals: 30,
    spawnRate: 1, // petals per frame
    animationFrame: null,
    
    init() {
        this.canvas = document.getElementById('petalsCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createInitialPetals();
        this.animate();
        
        // Debounce resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 200);
        });
    },
    
    resize() {
        const container = this.canvas.parentElement;
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    createInitialPetals() {
        // Create initial batch of petals
        for (let i = 0; i < 10; i++) {
            this.createPetal(true);
        }
    },
    
    createPetal(randomY = false) {
        if (this.petals.length >= this.maxPetals) return;
        
        const petal = {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -20,
            size: 8 + Math.random() * 12,
            speedY: 0.5 + Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            wobbleAmount: 30 + Math.random() * 40,
            wobbleOffset: Math.random() * Math.PI * 2,
            type: Math.floor(Math.random() * 5),
            opacity: 0.7 + Math.random() * 0.3,
            color: this.getRandomColor()
        };
        
        this.petals.push(petal);
    },
    
    getRandomColor() {
        const colors = [
            { fill: '#FFB6C1', stroke: '#FF69B4' },  // Light pink
            { fill: '#FFC0CB', stroke: '#FF85A2' },  // Pink
            { fill: '#FFD1DC', stroke: '#FFB6C1' },  // Pale pink
            { fill: '#FFDEE9', stroke: '#FFA0B4' },  // Blush
            { fill: '#FFF0F5', stroke: '#FFB6C1' },  // Lavender blush
            { fill: '#FFE4E9', stroke: '#FF69B4' },  // Light rose
            { fill: '#FFFFFF', stroke: '#FFB6C1' }   // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    animate() {
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    },
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.petals = [];
    },
    
    update() {
        // Spawn new petals
        if (Math.random() < 0.3) {
            this.createPetal();
        }
        
        // Update existing petals
        this.petals.forEach((petal, index) => {
            // Wobble movement
            petal.wobbleOffset += petal.wobbleSpeed;
            const wobble = Math.sin(petal.wobbleOffset) * petal.wobbleAmount * 0.01;
            
            // Update position
            petal.x += petal.speedX + wobble;
            petal.y += petal.speedY;
            
            // Update rotation
            petal.rotation += petal.rotationSpeed;
            
            // Wind effect occasionally
            if (Math.random() < 0.01) {
                petal.speedX += (Math.random() - 0.5) * 0.3;
            }
            
            // Remove if off screen
            if (petal.y > this.height + 20 || petal.x < -50 || petal.x > this.width + 50) {
                this.petals.splice(index, 1);
            }
        });
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.petals.forEach(petal => {
            this.ctx.save();
            this.ctx.translate(petal.x, petal.y);
            this.ctx.rotate(petal.rotation);
            this.ctx.globalAlpha = petal.opacity;
            
            this.drawPetalShape(petal);
            
            this.ctx.restore();
        });
    },
    
    drawPetalShape(petal) {
        const size = petal.size;
        
        switch(petal.type) {
            case 0: // Classic petal shape
                this.drawClassicPetal(size, petal.color);
                break;
            case 1: // Round petal
                this.drawRoundPetal(size, petal.color);
                break;
            case 2: // Elongated petal
                this.drawElongatedPetal(size, petal.color);
                break;
            case 3: // Heart-like petal
                this.drawHeartPetal(size, petal.color);
                break;
            case 4: // Small flower cluster
                this.drawFlowerCluster(size, petal.color);
                break;
        }
    },
    
    drawClassicPetal(size, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size/2);
        this.ctx.bezierCurveTo(
            size/2, -size/2,
            size/2, size/4,
            0, size/2
        );
        this.ctx.bezierCurveTo(
            -size/2, size/4,
            -size/2, -size/2,
            0, -size/2
        );
        
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, color.fill);
        gradient.addColorStop(1, color.stroke);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.strokeStyle = color.stroke;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    },
    
    drawRoundPetal(size, color) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        
        const gradient = this.ctx.createRadialGradient(-size/6, -size/6, 0, 0, 0, size/2);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, color.fill);
        gradient.addColorStop(1, color.stroke);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    },
    
    drawElongatedPetal(size, color) {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size/4, size/2, 0, 0, Math.PI * 2);
        
        const gradient = this.ctx.createLinearGradient(0, -size/2, 0, size/2);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, color.fill);
        gradient.addColorStop(1, color.stroke);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    },
    
    drawHeartPetal(size, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, size/4);
        this.ctx.bezierCurveTo(
            -size/2, -size/4,
            -size/4, -size/2,
            0, -size/4
        );
        this.ctx.bezierCurveTo(
            size/4, -size/2,
            size/2, -size/4,
            0, size/4
        );
        
        const gradient = this.ctx.createRadialGradient(0, -size/6, 0, 0, 0, size/2);
        gradient.addColorStop(0, color.fill);
        gradient.addColorStop(1, color.stroke);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    },
    
    drawFlowerCluster(size, color) {
        // Draw mini 5-petal flower
        const petalSize = size / 3;
        
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const x = Math.cos(angle) * petalSize;
            const y = Math.sin(angle) * petalSize;
            
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, petalSize/2, petalSize, angle, 0, Math.PI * 2);
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, petalSize);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(1, color.fill);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        // Center
        this.ctx.beginPath();
        this.ctx.arc(0, 0, petalSize/2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFE066';
        this.ctx.fill();
    },
    
    // Add burst of petals (called on correct answer)
    burst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            
            const petal = {
                x: x || this.width / 2,
                y: y || this.height / 3,
                size: 10 + Math.random() * 15,
                speedY: Math.sin(angle) * speed,
                speedX: Math.cos(angle) * speed,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                wobbleSpeed: 0.05,
                wobbleAmount: 20,
                wobbleOffset: Math.random() * Math.PI * 2,
                type: Math.floor(Math.random() * 5),
                opacity: 1,
                color: this.getRandomColor()
            };
            
            this.petals.push(petal);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FallingPetals.init();
});

// Make available globally for game module
window.FallingPetals = FallingPetals;
