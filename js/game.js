// Game Module
// Quản lý logic game, phong bao, câu hỏi popup

const GameModule = {
    currentQuestion: null,
    selectedAnswer: null,
    currentEnvelopeIndex: null,
    envelopesCount: 0,
    randomSelectedIndex: null,

    init() {
        this.setupEnvelopes();
        this.setupModalListeners();
        this.setupRandomButton();
        this.updateStats();
        // Petals and Tree are initialized in their own modules
    },

    // Setup Random Lucky Draw Button
    setupRandomButton() {
        const randomBtn = document.getElementById('randomBtn');
        const randomModal = document.getElementById('randomModal');
        const randomCloseBtn = document.getElementById('randomCloseBtn');
        const randomOpenBtn = document.getElementById('randomOpenBtn');
        const shakeBox = document.querySelector('.shake-box');
        const randomResult = document.getElementById('randomResult');
        const randomNumber = document.getElementById('randomNumber');

        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                // Get unused envelopes
                const unusedEnvelopes = this.getUnusedEnvelopes();
                
                if (unusedEnvelopes.length === 0) {
                    alert('🎉 Tất cả lì xì đã được mở hết rồi!');
                    return;
                }

                // Reset modal state
                randomResult.classList.remove('show');
                randomOpenBtn.classList.remove('show');
                shakeBox.classList.remove('shaking');
                randomNumber.textContent = '?';
                
                const shakeEmoji = document.getElementById('shakeEmoji');
                if (shakeEmoji) shakeEmoji.textContent = '🎲';

                // Show modal
                randomModal.classList.add('active');

                // Start dice rolling animation
                setTimeout(() => {
                    shakeBox.classList.add('shaking');
                    
                    // Dice faces animation
                    const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
                    let rollCount = 0;
                    const maxRolls = 15;
                    
                    const rollInterval = setInterval(() => {
                        if (shakeEmoji) {
                            shakeEmoji.textContent = diceFaces[Math.floor(Math.random() * 6)];
                        }
                        rollCount++;
                        
                        if (rollCount >= maxRolls) {
                            clearInterval(rollInterval);
                            
                            // Pick random unused envelope
                            const randomIndex = Math.floor(Math.random() * unusedEnvelopes.length);
                            this.randomSelectedIndex = unusedEnvelopes[randomIndex];
                            
                            // Final dice face
                            if (shakeEmoji) shakeEmoji.textContent = '🎲';
                            
                            setTimeout(() => {
                                // Show result with animation
                                randomNumber.textContent = (this.randomSelectedIndex + 1);
                                randomResult.classList.add('show');
                                randomOpenBtn.classList.add('show');
                            }, 200);
                        }
                    }, 100);
                }, 100);
            });
        }

        if (randomCloseBtn) {
            randomCloseBtn.addEventListener('click', () => {
                randomModal.classList.remove('active');
                this.randomSelectedIndex = null;
            });
        }

        if (randomOpenBtn) {
            randomOpenBtn.addEventListener('click', () => {
                if (this.randomSelectedIndex !== null) {
                    randomModal.classList.remove('active');
                    // Highlight and click the envelope
                    this.highlightAndOpenEnvelope(this.randomSelectedIndex);
                }
            });
        }

        // Close on backdrop click
        if (randomModal) {
            randomModal.addEventListener('click', (e) => {
                if (e.target === randomModal) {
                    randomModal.classList.remove('active');
                    this.randomSelectedIndex = null;
                }
            });
        }
    },

    // Get list of unused envelope indices
    getUnusedEnvelopes() {
        const unused = [];
        for (let i = 0; i < this.envelopesCount; i++) {
            if (!DataManager.isEnvelopeUsed(i)) {
                unused.push(i);
            }
        }
        return unused;
    },

    // Highlight envelope and open it
    highlightAndOpenEnvelope(index) {
        const envelope = document.querySelector(`.envelope[data-index="${index}"]`);
        if (envelope) {
            // Scroll to envelope
            envelope.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight effect
            envelope.style.transform = 'scale(1.3)';
            envelope.style.zIndex = '1000';
            envelope.style.filter = 'drop-shadow(0 0 20px #FFD700)';
            
            setTimeout(() => {
                envelope.style.transform = '';
                envelope.style.zIndex = '';
                envelope.style.filter = '';
                // Trigger click
                this.handleEnvelopeClick(index);
            }, 800);
        }
    },

    // Setup envelopes on the tree
    setupEnvelopes() {
        const questions = DataManager.getAllQuestions();
        this.envelopesCount = questions.length; // Match number of questions exactly

        const container = document.getElementById('envelopesContainer');
        container.innerHTML = '';

        // Calculate positions for envelopes on the tree (circular arrangement)
        const positions = this.calculateEnvelopePositions(this.envelopesCount);

        for (let i = 0; i < this.envelopesCount; i++) {
            const envelope = document.createElement('div');
            envelope.className = 'envelope';
            envelope.textContent = (i + 1).toString();
            envelope.style.left = positions[i].x + '%';
            envelope.style.top = positions[i].y + '%';
            envelope.dataset.index = i;
            
            // Random swing animation
            const swingDuration = 2.5 + Math.random() * 1.5;
            const swingDelay = Math.random() * 2;
            envelope.style.setProperty('--swing-duration', swingDuration + 's');
            envelope.style.setProperty('--swing-delay', swingDelay + 's');

            // Check if used
            if (DataManager.isEnvelopeUsed(i)) {
                envelope.classList.add('used');
            }

            envelope.addEventListener('click', () => {
                this.handleEnvelopeClick(i);
            });

            container.appendChild(envelope);
        }
    },

    // Calculate positions for envelopes on the peach tree branches
    calculateEnvelopePositions(count) {
        const positions = [];
        
        // Define positions following the tree branches layout
        // Adjusted to center more within the tree crown area (x: 20-80, y: 8-55)
        const treePositions = [
            // Top center area
            { x: 50, y: 10 },
            { x: 42, y: 16 },
            { x: 58, y: 16 },
            // Upper left branch
            { x: 30, y: 22 },
            { x: 22, y: 30 },
            { x: 28, y: 38 },
            // Upper right branch  
            { x: 70, y: 22 },
            { x: 78, y: 30 },
            { x: 72, y: 38 },
            // Middle area
            { x: 38, y: 45 },
            { x: 62, y: 45 },
            { x: 50, y: 32 },
            // Lower branches
            { x: 25, y: 50 },
            { x: 75, y: 50 },
            { x: 35, y: 55 },
            { x: 65, y: 55 },
            // Additional positions
            { x: 45, y: 25 },
            { x: 55, y: 25 },
            { x: 40, y: 40 },
            { x: 60, y: 40 },
        ];

        for (let i = 0; i < count; i++) {
            if (i < treePositions.length) {
                positions.push(treePositions[i]);
            } else {
                // Generate additional positions in a pattern
                const row = Math.floor((i - treePositions.length) / 4);
                const col = (i - treePositions.length) % 4;
                positions.push({
                    x: 20 + col * 20,
                    y: 65 + row * 8
                });
            }
        }

        return positions;
    },

    // Handle envelope click
    handleEnvelopeClick(envelopeIndex) {
        if (DataManager.isEnvelopeUsed(envelopeIndex)) {
            alert('❌ Phong bao này đã được mở rồi!');
            return;
        }

        const questions = DataManager.getAllQuestions();
        if (questions.length === 0) {
            alert('❌ Chưa có câu hỏi nào! Vui lòng thêm câu hỏi trước.');
            return;
        }

        // Get question for this envelope
        const question = questions[envelopeIndex % questions.length];
        this.currentQuestion = question;
        this.currentEnvelopeIndex = envelopeIndex;
        this.selectedAnswer = null;

        this.showQuizModal();
    },

    // Show quiz modal
    showQuizModal() {
        const modal = document.getElementById('quizModal');
        const question = this.currentQuestion;

        // Set question
        document.getElementById('modalQuestion').textContent = question.text;
        document.getElementById('questionNumber').textContent = `Phong bao #${this.currentEnvelopeIndex + 1}`;

        // Clear previous selection
        this.selectedAnswer = null;

        // Create options
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.dataset.index = index + 1;

            optionDiv.addEventListener('click', () => {
                this.handleOptionSelect(index + 1, optionDiv);
            });

            optionsContainer.appendChild(optionDiv);
        });

        // Enable submit button
        document.getElementById('submitAnswerBtn').disabled = false;

        // Show modal
        modal.classList.remove('hidden');

        // Add animation
        this.createConfetti();
    },

    // Handle option selection
    handleOptionSelect(optionIndex, element) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Select new option
        element.classList.add('selected');
        this.selectedAnswer = optionIndex;

        // Enable submit button
        document.getElementById('submitAnswerBtn').disabled = false;
    },

    // Setup modal listeners
    setupModalListeners() {
        // Close modal button
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal');
                modal.classList.add('hidden');
            });
        });

        // Submit answer button
        document.getElementById('submitAnswerBtn').addEventListener('click', () => {
            this.handleSubmitAnswer();
        });

        // Next question button
        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            document.getElementById('resultModal').classList.add('hidden');
            this.setupEnvelopes(); // Refresh envelope display
        });

        // Close modal by clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    },

    // Handle submit answer
    handleSubmitAnswer() {
        if (this.selectedAnswer === null) {
            alert('Vui lòng chọn một đáp án!');
            return;
        }

        const question = this.currentQuestion;
        const isCorrect = this.selectedAnswer === question.correctAnswer;

        // Record answer
        DataManager.recordAnswer(question.id, isCorrect);
        DataManager.markEnvelopeUsed(this.currentEnvelopeIndex);

        // Close quiz modal
        document.getElementById('quizModal').classList.add('hidden');

        // Show result
        this.showResultModal(isCorrect, question);

        // Update stats
        this.updateStats();
    },

    // Show result modal
    showResultModal(isCorrect, question) {
        const modal = document.getElementById('resultModal');
        const resultContent = document.getElementById('resultContent');

        if (isCorrect) {
            resultContent.innerHTML = `
                <div class="result-icon">🎉</div>
                <h2 class="result-title">Chính Xác!</h2>
                <p class="result-message">${this.escapeHtml(question.congratsMessage)}</p>
            `;
            
            // Trigger petal burst effect at center of screen
            if (window.PetalFall) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                window.PetalFall.burst(centerX, centerY, 30);
                
                // Additional bursts for celebration
                setTimeout(() => {
                    window.PetalFall.burst(centerX - 200, centerY - 100, 20);
                }, 200);
                setTimeout(() => {
                    window.PetalFall.burst(centerX + 200, centerY - 100, 20);
                }, 400);
            }
        } else {
            resultContent.innerHTML = `
                <div class="result-icon">❌</div>
                <h2 class="result-title error">Sai Rồi!</h2>
                <p class="result-message error">
                    Đáp án đúng là: <strong>${this.escapeHtml(question.options[question.correctAnswer - 1])}</strong>
                </p>
            `;
        }

        modal.classList.remove('hidden');

        // Add confetti animation
        if (isCorrect) {
            this.createConfetti();
        }
    },

    // Update game statistics
    updateStats() {
        const stats = DataManager.getStats();
        document.getElementById('totalQuestions').textContent = stats.totalQuestions;
        document.getElementById('correctCount').textContent = stats.correctCount;
        document.getElementById('incorrectCount').textContent = stats.incorrectCount;
    },

    // Create confetti animation
    createConfetti() {
        const container = document.body;
        const confettiCount = 30;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = this.getRandomColor();
                confetti.style.borderRadius = '50%';
                confetti.style.opacity = '1';
                confetti.style.zIndex = '999';
                confetti.style.pointerEvents = 'none';

                container.appendChild(confetti);

                // Animate
                let top = -10;
                let left = parseFloat(confetti.style.left);
                let opacity = 1;

                const animate = () => {
                    top += Math.random() * 5 + 3;
                    left += Math.random() * 4 - 2;
                    opacity -= 0.01;

                    confetti.style.top = top + 'px';
                    confetti.style.left = left + '%';
                    confetti.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        confetti.remove();
                    }
                };

                animate();
            }, i * 30);
        }
    },

    // Get random color
    getRandomColor() {
        const colors = ['#FFD700', '#FFB6C1', '#FF69B4', '#FF1744', '#DC143C', '#FFA500'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    GameModule.init();
});
