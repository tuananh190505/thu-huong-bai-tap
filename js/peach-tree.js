// Peach Tree Canvas Module
// Vẽ cây đào đẹp bằng Canvas API với hiệu ứng rung rinh

const PeachTree = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    time: 0,
    branches: [],
    flowers: [],
    
    init() {
        this.canvas = document.getElementById('treeCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.generateTree();
        this.animate();
        
        // Debounce resize for performance
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
        
        // Regenerate tree for new size
        this.generateTree();
    },
    
    generateTree() {
        this.branches = [];
        this.flowers = [];
        
        const centerX = this.width / 2;
        const baseY = this.height * 0.85;
        
        // Generate thick main trunk
        this.generateBranch(centerX, baseY, -90, this.height * 0.4, 35, 10);
        
        // Generate flowers on branches (MASSIVE flower coverage)
        this.generateFlowers();
    },
    
    generateBranch(x, y, angle, length, width, depth) {
        if (depth <= 0 || length < 10) return;
        
        const endX = x + Math.cos(angle * Math.PI / 180) * length;
        const endY = y + Math.sin(angle * Math.PI / 180) * length;
        
        this.branches.push({
            startX: x,
            startY: y,
            endX: endX,
            endY: endY,
            width: width,
            depth: depth,
            angle: angle,
            swayOffset: Math.random() * Math.PI * 2
        });
        
        // Balanced branching - dense but not excessive
        if (depth > 1) {
            const numBranches = depth > 9 ? 3 : depth > 6 ? 2 : 2;
            for (let i = 0; i < numBranches; i++) {
                const spreadAngle = depth > 7 ? 60 : depth > 4 ? 45 : 35;
                const newAngle = angle + (Math.random() - 0.5) * spreadAngle + (i - numBranches/2) * 20;
                const newLength = length * (0.68 + Math.random() * 0.2);
                const newWidth = width * 0.75;
                this.generateBranch(endX, endY, newAngle, newLength, newWidth, depth - 1);
            }
        }
    },
    
    generateFlowers() {
        // Lightweight flowers - aim for ~60 total
        this.branches.forEach(branch => {
            // Flowers at endpoints only
            if (branch.depth <= 4) {
                const numFlowers = Math.floor(Math.random() * 3) + 4; // 4-7 flowers per endpoint
                for (let i = 0; i < numFlowers; i++) {
                    const radius = 40 + Math.random() * 30;
                    const angle = Math.random() * Math.PI * 2;
                    const offsetX = Math.cos(angle) * radius * Math.random();
                    const offsetY = Math.sin(angle) * radius * Math.random();
                    this.flowers.push({
                        x: branch.endX + offsetX,
                        y: branch.endY + offsetY,
                        size: 6 + Math.random() * 8,
                        petals: 5,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.008,
                        color: this.getFlowerColor(),
                        pulseOffset: Math.random() * Math.PI * 2
                    });
                }
            }
            
            // Sparse flowers along branches
            if (branch.depth <= 6 && Math.random() > 0.5) { // 50% chance
                const numFlowers = Math.floor(Math.random() * 2) + 2; // 2-4 per branch
                for (let i = 0; i < numFlowers; i++) {
                    const t = Math.random();
                    const x = branch.startX + (branch.endX - branch.startX) * t;
                    const y = branch.startY + (branch.endY - branch.startY) * t;
                    const spreadRadius = 20 + Math.random() * 15;
                    const spreadAngle = Math.random() * Math.PI * 2;
                    const offsetX = Math.cos(spreadAngle) * spreadRadius * Math.random();
                    const offsetY = Math.sin(spreadAngle) * spreadRadius * Math.random();
                    
                    this.flowers.push({
                        x: x + offsetX,
                        y: y + offsetY,
                        size: 5 + Math.random() * 7,
                        petals: 5,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.008,
                        color: this.getFlowerColor(),
                        pulseOffset: Math.random() * Math.PI * 2
                    });
                }
            }
        });
        
        // Add extra clusters to fill gaps - reduced to 40
        for (let i = 0; i < 40; i++) {
            const x = this.width * (0.3 + Math.random() * 0.4);
            const y = this.height * (0.2 + Math.random() * 0.4);
            this.flowers.push({
                x: x,
                y: y,
                size: 5 + Math.random() * 7,
                petals: 5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.006,
                color: this.getFlowerColor(),
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    },
    
    getFlowerColor() {
        const colors = [
            { inner: '#FFFFFF', outer: '#FFB6C1' },
            { inner: '#FFF0F5', outer: '#FF69B4' },
            { inner: '#FFE4EC', outer: '#FFB6C1' },
            { inner: '#FFDEE9', outer: '#FF85A2' },
            { inner: '#FFF5F7', outer: '#FFA0B4' }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    animate() {
        this.time += 0.016; // ~60fps
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    },
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw gradient background
        this.drawBackground();
        
        // Draw pot
        this.drawPot();
        
        // Draw branches with sway
        this.drawBranches();
        
        // Draw flowers
        this.drawFlowers();
    },
    
    drawBackground() {
        // Sky gradient like image
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#B8D8F2');
        gradient.addColorStop(0.3, '#D4E8F7');
        gradient.addColorStop(0.6, '#E8F2F7');
        gradient.addColorStop(0.75, '#C8DFC8');
        gradient.addColorStop(1, '#A8C8A8');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Add distant trees/background blur
        this.ctx.fillStyle = 'rgba(120, 180, 120, 0.3)';
        this.ctx.fillRect(0, this.height * 0.6, this.width, this.height * 0.15);
        
        // Ground/platform
        const platformY = this.height * 0.75;
        const platformGradient = this.ctx.createLinearGradient(0, platformY, 0, this.height);
        platformGradient.addColorStop(0, '#D4C4B0');
        platformGradient.addColorStop(0.3, '#C8B8A0');
        platformGradient.addColorStop(1, '#B8A890');
        
        this.ctx.fillStyle = platformGradient;
        this.ctx.fillRect(0, platformY, this.width, this.height);
        
        // Platform tiles
        this.ctx.strokeStyle = 'rgba(160, 140, 120, 0.3)';
        this.ctx.lineWidth = 1;
        const tileSize = 40;
        for (let x = 0; x < this.width; x += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, platformY);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = platformY; y < this.height; y += tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    },
    
    drawPot() {
        const centerX = this.width / 2;
        const potY = this.height * 0.78;
        const potWidth = 100;
        const potHeight = 60;
        
        // Red table cloth drape
        const tableY = potY + 30;
        const tableGradient = this.ctx.createLinearGradient(
            centerX - 150, tableY,
            centerX + 150, tableY
        );
        tableGradient.addColorStop(0, '#8B0000');
        tableGradient.addColorStop(0.2, '#B22222');
        tableGradient.addColorStop(0.5, '#DC143C');
        tableGradient.addColorStop(0.8, '#B22222');
        tableGradient.addColorStop(1, '#8B0000');
        
        this.ctx.fillStyle = tableGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 150, tableY);
        this.ctx.quadraticCurveTo(centerX - 120, tableY + 10, centerX - 100, tableY + 5);
        this.ctx.lineTo(centerX + 100, tableY + 5);
        this.ctx.quadraticCurveTo(centerX + 120, tableY + 10, centerX + 150, tableY);
        this.ctx.lineTo(centerX + 130, this.height * 0.87);
        this.ctx.lineTo(centerX - 130, this.height * 0.87);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Pot body with ornate design
        const potGradient = this.ctx.createRadialGradient(
            centerX, potY + 20, 10,
            centerX, potY + 20, potWidth/2
        );
        potGradient.addColorStop(0, '#FFE87C');
        potGradient.addColorStop(0.4, '#FFD700');
        potGradient.addColorStop(0.7, '#DAA520');
        potGradient.addColorStop(1, '#B8860B');
        
        this.ctx.fillStyle = potGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - potWidth/2 + 5, potY);
        this.ctx.lineTo(centerX - potWidth/2 + 15, potY + potHeight);
        this.ctx.quadraticCurveTo(centerX, potY + potHeight + 5, centerX + potWidth/2 - 15, potY + potHeight);
        this.ctx.lineTo(centerX + potWidth/2 - 5, potY);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Pot rim ornate
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(centerX - potWidth/2, potY - 12, potWidth, 15);
        
        // Decorative pattern on pot
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const y = potY + 15 + i * 15;
            this.ctx.beginPath();
            for (let x = -potWidth/2; x < potWidth/2; x += 10) {
                this.ctx.lineTo(centerX + x, y + Math.sin(x * 0.5) * 3);
            }
            this.ctx.stroke();
        }
        
        // Gold coins/ingots piled up
        this.ctx.fillStyle = '#FFD700';
        const coinPositions = [
            [-35, -10], [-20, -12], [-5, -15], [10, -13], [25, -10],
            [-28, 0], [-15, -2], [0, -5], [15, -3], [28, 0],
            [-20, 8], [-8, 5], [8, 5], [20, 8]
        ];
        
        coinPositions.forEach(([x, y]) => {
            this.ctx.save();
            this.ctx.translate(centerX + x, potY + y);
            
            // Coin shine
            const coinGrad = this.ctx.createRadialGradient(-2, -2, 0, 0, 0, 10);
            coinGrad.addColorStop(0, '#FFEB3B');
            coinGrad.addColorStop(1, '#FFA000');
            this.ctx.fillStyle = coinGrad;
            
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#B8860B';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    },
    
    drawBranches() {
        // Sort by depth (draw deeper branches first)
        const sortedBranches = [...this.branches].sort((a, b) => b.depth - a.depth);
        
        sortedBranches.forEach(branch => {
            // Calculate sway
            const swayAmount = (8 - branch.depth) * 0.5;
            const sway = Math.sin(this.time * 2 + branch.swayOffset) * swayAmount;
            
            const swayX = sway * Math.cos((branch.angle + 90) * Math.PI / 180);
            const swayY = sway * Math.sin((branch.angle + 90) * Math.PI / 180);
            
            // Draw branch
            this.ctx.beginPath();
            this.ctx.moveTo(branch.startX, branch.startY);
            this.ctx.lineTo(branch.endX + swayX, branch.endY + swayY);
            
            // Branch gradient
            const branchGradient = this.ctx.createLinearGradient(
                branch.startX, branch.startY,
                branch.endX, branch.endY
            );
            branchGradient.addColorStop(0, '#4A3728');
            branchGradient.addColorStop(1, '#6B4423');
            
            this.ctx.strokeStyle = branchGradient;
            this.ctx.lineWidth = branch.width;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            
            // Update flower positions based on sway
            this.flowers.forEach(flower => {
                const dx = flower.x - branch.endX;
                const dy = flower.y - branch.endY;
                if (Math.sqrt(dx*dx + dy*dy) < 50) {
                    flower.swayX = swayX;
                    flower.swayY = swayY;
                }
            });
        });
    },
    
    drawFlowers() {
        this.flowers.forEach(flower => {
            const swayX = flower.swayX || 0;
            const swayY = flower.swayY || 0;
            const x = flower.x + swayX;
            const y = flower.y + swayY;
            
            // Pulse effect
            const pulse = 1 + Math.sin(this.time * 3 + flower.pulseOffset) * 0.1;
            const size = flower.size * pulse;
            
            // Update rotation
            flower.rotation += flower.rotationSpeed;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(flower.rotation);
            
            // Draw petals
            for (let i = 0; i < flower.petals; i++) {
                const angle = (i / flower.petals) * Math.PI * 2;
                this.ctx.save();
                this.ctx.rotate(angle);
                
                // Petal gradient
                const petalGradient = this.ctx.createRadialGradient(0, -size/2, 0, 0, -size/2, size);
                petalGradient.addColorStop(0, flower.color.inner);
                petalGradient.addColorStop(1, flower.color.outer);
                
                this.ctx.fillStyle = petalGradient;
                this.ctx.beginPath();
                this.ctx.ellipse(0, -size/2, size/3, size/2, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
            
            // Draw center
            const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size/4);
            centerGradient.addColorStop(0, '#FFE066');
            centerGradient.addColorStop(1, '#FFB347');
            
            this.ctx.fillStyle = centerGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size/4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PeachTree.init();
});
