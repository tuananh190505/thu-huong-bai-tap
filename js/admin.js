// Admin Panel Module
// Quản lý thêm, xóa, chỉnh sửa câu hỏi

const AdminPanel = {
    init() {
        this.setupEventListeners();
        this.renderQuestionsList();
    },

    setupEventListeners() {
        // Add question button
        document.getElementById('addQuestionBtn').addEventListener('click', () => {
            this.handleAddQuestion();
        });

        // Allow Enter key to add question
        document.getElementById('questionText').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.handleAddQuestion();
            }
        });
    },

    // Validate form
    validateForm() {
        const questionText = document.getElementById('questionText')?.value.trim() || '';
        const option1 = document.getElementById('option1')?.value.trim() || '';
        const option2 = document.getElementById('option2')?.value.trim() || '';
        const option3 = document.getElementById('option3')?.value.trim() || '';
        const option4 = document.getElementById('option4')?.value.trim() || '';
        const correctAnswer = document.getElementById('correctAnswer')?.value || '';
        const congratsMessage = document.getElementById('congratsMessage')?.value.trim() || '';

        console.log('Validation Check:', {
            questionText: questionText.length,
            option1: option1.length,
            option2: option2.length,
            option3: option3.length,
            option4: option4.length,
            correctAnswer: correctAnswer,
            congratsMessage: congratsMessage.length
        });

        if (!questionText) {
            alert('❌ Vui lòng nhập câu hỏi!');
            return false;
        }

        if (!option1 || !option2 || !option3 || !option4) {
            alert('❌ Vui lòng nhập đầy đủ 4 đáp án!');
            return false;
        }

        if (!correctAnswer) {
            alert('❌ Vui lòng chọn đáp án đúng!');
            return false;
        }

        if (!congratsMessage) {
            alert('❌ Vui lòng nhập lời chúc!');
            return false;
        }

        return true;
    },

    // Handle add question
    handleAddQuestion() {
        if (!this.validateForm()) {
            return;
        }

        const questionData = {
            text: document.getElementById('questionText').value.trim(),
            options: [
                document.getElementById('option1').value.trim(),
                document.getElementById('option2').value.trim(),
                document.getElementById('option3').value.trim(),
                document.getElementById('option4').value.trim()
            ],
            correctAnswer: parseInt(document.getElementById('correctAnswer').value),
            congratsMessage: document.getElementById('congratsMessage').value.trim()
        };

        DataManager.addQuestion(questionData);

        // Clear form
        this.clearForm();

        // Re-render list
        this.renderQuestionsList();

        // Show success message
        this.showSuccessMessage('✅ Thêm câu hỏi thành công!');
    },

    // Clear form
    clearForm() {
        document.getElementById('questionText').value = '';
        document.getElementById('option1').value = '';
        document.getElementById('option2').value = '';
        document.getElementById('option3').value = '';
        document.getElementById('option4').value = '';
        document.getElementById('correctAnswer').value = '';
        document.getElementById('congratsMessage').value = '';
    },

    // Show success message
    showSuccessMessage(message) {
        const btn = document.getElementById('addQuestionBtn');
        const originalText = btn.textContent;
        btn.textContent = message;
        btn.style.background = 'linear-gradient(135deg, #27AE60, #229954)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    },

    // Render questions list
    renderQuestionsList() {
        const questions = DataManager.getAllQuestions();
        const listContainer = document.getElementById('questionsList');
        const questionCount = document.getElementById('questionCount');

        questionCount.textContent = questions.length;

        if (questions.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên! 📝</p>';
            return;
        }

        listContainer.innerHTML = questions.map(question => `
            <div class="question-item">
                <div class="question-item-content">
                    <div class="question-item-text">
                        <strong>Câu:</strong> ${this.escapeHtml(question.text)}
                    </div>
                    <div class="question-item-answer">
                        ✓ Đáp án đúng: ${this.escapeHtml(question.options[question.correctAnswer - 1])}
                    </div>
                    <div class="question-item-congrats">
                        💌 "${this.escapeHtml(question.congratsMessage)}"
                    </div>
                    <details style="font-size: 12px; color: #666; margin-top: 8px;">
                        <summary style="cursor: pointer;">Xem 4 đáp án →</summary>
                        <div style="margin-top: 8px; padding: 8px; background: #F9F9F9; border-radius: 5px;">
                            ${question.options.map((opt, idx) => `
                                <div>• <strong>${idx + 1}:</strong> ${this.escapeHtml(opt)}</div>
                            `).join('')}
                        </div>
                    </details>
                </div>
                <div class="question-item-actions">
                    <button class="btn-secondary btn-delete" data-id="${question.id}">
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = parseInt(e.currentTarget.dataset.id);
                if (confirm('Bạn chắc chắn muốn xóa câu hỏi này?')) {
                    DataManager.deleteQuestion(questionId);
                    this.renderQuestionsList();
                }
            });
        });
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Image Configuration Module
const ImageConfig = {
    STORAGE_KEY: 'luckyDraw_images',
    defaultBg: 'images/tet-background.jpg',
    defaultTree: 'images/peach-tree.png',

    init() {
        this.loadSavedImages();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Background image upload
        const bgUpload = document.getElementById('bgUpload');
        if (bgUpload) {
            bgUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'background'));
        }

        // Tree image upload
        const treeUpload = document.getElementById('treeUpload');
        if (treeUpload) {
            treeUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'tree'));
        }

        // Reset buttons
        const resetBgBtn = document.getElementById('resetBgBtn');
        if (resetBgBtn) {
            resetBgBtn.addEventListener('click', () => this.resetImage('background'));
        }

        const resetTreeBtn = document.getElementById('resetTreeBtn');
        if (resetTreeBtn) {
            resetTreeBtn.addEventListener('click', () => this.resetImage('tree'));
        }
    },

    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('❌ Vui lòng chọn file ảnh!');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            this.saveImage(type, imageData);
            this.applyImage(type, imageData);
            this.updatePreview(type, imageData);
            alert('✅ Đã cập nhật ảnh thành công!');
        };
        reader.readAsDataURL(file);
    },

    saveImage(type, data) {
        const images = this.getSavedImages();
        images[type] = data;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
    },

    getSavedImages() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    },

    loadSavedImages() {
        const images = this.getSavedImages();
        
        if (images.background) {
            this.applyImage('background', images.background);
            this.updatePreview('background', images.background);
        }
        
        if (images.tree) {
            this.applyImage('tree', images.tree);
            this.updatePreview('tree', images.tree);
        }
    },

    applyImage(type, imageData) {
        if (type === 'background') {
            document.body.style.backgroundImage = `url('${imageData}')`;
        } else if (type === 'tree') {
            const treeImg = document.getElementById('peachTreeImg');
            if (treeImg) {
                treeImg.src = imageData;
            }
        }
    },

    updatePreview(type, imageData) {
        if (type === 'background') {
            const preview = document.getElementById('bgPreview');
            if (preview) preview.src = imageData;
        } else if (type === 'tree') {
            const preview = document.getElementById('treePreview');
            if (preview) preview.src = imageData;
        }
    },

    resetImage(type) {
        const images = this.getSavedImages();
        delete images[type];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));

        if (type === 'background') {
            document.body.style.backgroundImage = `url('${this.defaultBg}')`;
            this.updatePreview('background', this.defaultBg);
            alert('✅ Đã khôi phục ảnh nền mặc định!');
        } else if (type === 'tree') {
            const treeImg = document.getElementById('peachTreeImg');
            if (treeImg) treeImg.src = this.defaultTree;
            this.updatePreview('tree', this.defaultTree);
            alert('✅ Đã khôi phục ảnh cây đào mặc định!');
        }
    }
};

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
    ImageConfig.init();
});
