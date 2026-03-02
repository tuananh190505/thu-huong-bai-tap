# 👨‍💻 Developer Guide - Lucky Draw

Hướng dẫn cho những ai muốn chỉnh sửa/mở rộng project.

---

## 🏗️ Architecture Overview

### Module Pattern
Project sử dụng **Module Pattern** (namespace) để tổ chức code:

```javascript
// Mỗi module là một object chứa các method
const DataManager = { ... };
const AdminPanel = { ... };
const GameModule = { ... };
const MainApp = { ... };
```

**Lợi ích:**
- Tránh global namespace pollution
- Dễ bảo trì
- Dễ test
- Dễ mở rộng

---

## 📚 Module Reference

### 1. **DataManager** (js/data.js)
Quản lý tất cả dữ liệu.

#### Methods:
```javascript
// Lấy tất cả câu hỏi
DataManager.getAllQuestions() → Array

// Thêm câu hỏi mới
DataManager.addQuestion(questionData) → Object

// Xóa câu hỏi
DataManager.deleteQuestion(questionId) → void

// Lấy câu hỏi theo ID
DataManager.getQuestion(questionId) → Object

// Lấy trạng thái game
DataManager.getGameState() → Object

// Cập nhật trạng thái game
DataManager.updateGameState(state) → void

// Đánh dấu phong bao đã dùng
DataManager.markEnvelopeUsed(index) → void

// Lưu câu trả lời
DataManager.recordAnswer(questionId, isCorrect) → void

// Kiểm tra phong bao đã dùng
DataManager.isEnvelopeUsed(index) → Boolean

// Reset game state
DataManager.resetGameState() → void

// Lấy thống kê
DataManager.getStats() → Object
```

#### Storage Keys:
```javascript
'luckydraw_questions'  // Mảng câu hỏi
'luckydraw_gamestate'  // Trạng thái game
```

#### Data Structure:
```javascript
// Question Object
{
    id: 1709534400000,
    text: "Câu hỏi?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,  // 1-4
    congratsMessage: "Chúc mừng!",
    createdAt: "2024-03-02T10:00:00Z"
}

// GameState Object
{
    usedEnvelopes: [0, 2, 5],
    correctCount: 2,
    incorrectCount: 1,
    answers: {
        "123456": true,
        "789012": false
    }
}
```

---

### 2. **AdminPanel** (js/admin.js)
Quản lý form thêm/xóa câu hỏi.

#### Methods:
```javascript
// Khởi tạo
AdminPanel.init() → void

// Setup event listeners
AdminPanel.setupEventListeners() → void

// Validate form
AdminPanel.validateForm() → Boolean

// Xử lý thêm câu hỏi
AdminPanel.handleAddQuestion() → void

// Clear form
AdminPanel.clearForm() → void

// Hiển thị danh sách câu hỏi
AdminPanel.renderQuestionsList() → void

// Escape HTML
AdminPanel.escapeHtml(text) → String
```

#### Form Fields:
```html
#questionText      <!-- Câu hỏi -->
#option1-4         <!-- 4 đáp án -->
#correctAnswer     <!-- Dropdown chọn đáp án đúng -->
#congratsMessage   <!-- Lời chúc -->
#addQuestionBtn    <!-- Nút thêm -->
```

---

### 3. **GameModule** (js/game.js)
Logic game chính.

#### Methods:
```javascript
// Khởi tạo
GameModule.init() → void

// Setup phong bao
GameModule.setupEnvelopes() → void

// Tính vị trí phong bao
GameModule.calculateEnvelopePositions(count) → Array

// Click phong bao
GameModule.handleEnvelopeClick(index) → void

// Hiển thị quiz modal
GameModule.showQuizModal() → void

// Chọn đáp án
GameModule.handleOptionSelect(optionIndex, element) → void

// Setup modal listeners
GameModule.setupModalListeners() → void

// Nộp câu trả lời
GameModule.handleSubmitAnswer() → void

// Hiển thị kết quả
GameModule.showResultModal(isCorrect, question) → void

// Cập nhật thống kê
GameModule.updateStats() → void

// Tạo confetti animation
GameModule.createConfetti() → void

// Tạo hoa đào rơi
GameModule.createFallingPetals() → void

// Escape HTML
GameModule.escapeHtml(text) → String
```

#### State Variables:
```javascript
GameModule.currentQuestion    // Question hiện tại
GameModule.selectedAnswer     // Đáp án được chọn (1-4)
GameModule.currentEnvelopeIndex  // Index phong bao
GameModule.envelopesCount     // Tổng phong bao
```

---

### 4. **MainApp** (js/main.js)
Khởi tạo ứng dụng.

#### Methods:
```javascript
// Khởi tạo
MainApp.init() → void

// Setup tab navigation
MainApp.setupTabNavigation() → void
```

---

## 🎨 Styling Guide

### CSS Structure (styles.css)
```css
/* 1. CSS Variables */
:root { --colors, --sizes, etc }

/* 2. Base Styles */
*, body, html

/* 3. Layout Components */
.app-container, .nav-tabs, .tab-content

/* 4. Navigation */
.nav-btn, .nav-btn.active

/* 5. Game Area */
.game-container, .tree-wrapper, .envelope

/* 6. Admin Area */
.admin-form, form inputs

/* 7. Modals */
.modal, .quiz-modal, .result-modal

/* 8. Animations */
@keyframes ...

/* 9. Responsive */
@media queries

/* 10. Accessibility */
@media (prefers-reduced-motion)
@media (prefers-color-scheme: dark)
```

### Color Variables:
```css
--primary-color: #E74C3C      /* Red */
--success-color: #27AE60      /* Green */
--error-color: #E74C3C        /* Red */
--warning-color: #F39C12      /* Orange */
--bg-color: #FFF5E1           /* Light cream */
--text-color: #2C3E50         /* Dark gray */
```

### Changing Colors:
```css
/* Tìm :root và sửa các biến */
:root {
    --primary-color: #new-color;
}
```

---

## 🔧 Common Customizations

### 1. Thay đổi số phong bao
```javascript
// js/game.js, line ~30
this.envelopesCount = Math.max(questions.length, 6);
// Thay 6 thành số bạn muốn (vd: 12)
```

### 2. Thay đổi vị trí phong bao
```javascript
// js/game.js, calculateEnvelopePositions()
const centerX = 50;  // Tâm X (%)
const centerY = 40;  // Tâm Y (%)
const radiusX = 35;  // Bán kính X
const radiusY = 30;  // Bán kính Y
```

### 3. Thay đổi màu phong bao
```css
/* css/styles.css, .envelope */
background: linear-gradient(135deg, #DC143C, #FF1744);
border: 3px solid #FFD700;  /* Border color */
```

### 4. Thay đổi tốc độ hoa đào
```javascript
// js/game.js, createFallingPetals()
const duration = 6 + Math.random() * 2;  // 6-8 giây
// Giảm xuống để hoa rơi nhanh hơn
```

### 5. Thay đổi confetti
```javascript
// js/game.js, createConfetti()
const confettiCount = 30;  // Số confetti
// Tăng lên để nhiều confetti hơn
```

### 6. Thêm âm thanh
```javascript
// Thêm trong handleSubmitAnswer()
if (isCorrect) {
    new Audio('sound.mp3').play();
}
```

---

## 📝 Adding New Features

### Ví dụ: Thêm Timer cho mỗi câu

**Bước 1:** Thêm field HTML
```html
<div class="timer" id="timer">30</div>
```

**Bước 2:** Thêm CSS
```css
#timer {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #E74C3C;
}
```

**Bước 3:** Thêm logic trong GameModule
```javascript
showQuizModal() {
    // ... existing code ...
    this.startTimer();
}

startTimer() {
    let timeLeft = 30;
    const timerEl = document.getElementById('timer');
    
    this.timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(this.timerInterval);
            this.handleSubmitAnswer(); // Auto-submit
        }
    }, 1000);
}
```

**Bước 4:** Clear timer khi close modal
```javascript
setupModalListeners() {
    // ...
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (this.timerInterval) clearInterval(this.timerInterval);
            // ... rest of code ...
        });
    });
}
```

---

## 🐛 Debugging Tips

### 1. Kiểm tra localStorage
```javascript
// Console
JSON.parse(localStorage.getItem('luckydraw_questions'))
JSON.parse(localStorage.getItem('luckydraw_gamestate'))
```

### 2. Test DataManager
```javascript
// Console
DataManager.getAllQuestions()
DataManager.getStats()
DataManager.getGameState()
```

### 3. Add console logs
```javascript
// Thêm dòng này để debug
console.log('Debug info:', {
    questions: DataManager.getAllQuestions(),
    state: DataManager.getGameState(),
    currentQuestion: GameModule.currentQuestion
});
```

### 4. Check DOM elements
```javascript
// Console
document.getElementById('envelopesContainer')
document.querySelectorAll('.envelope')
document.getElementById('quizModal')
```

---

## 📦 Building & Deployment

### Local Testing
```bash
# Option 1: Direct open
open index.html

# Option 2: Simple server
python -m http.server 8000
# Or: npx http-server

# Option 3: VS Code Live Server
# Install: Live Server extension
# Right-click index.html → Open with Live Server
```

### Deployment
```bash
# GitHub Pages
1. Create repo on GitHub
2. Push files
3. Go to Settings → Pages
4. Select main branch as source

# Other hosting
- Netlify (drag & drop)
- Vercel
- Firebase Hosting
- Traditional hosting (FTP)
```

### Building for Production
```bash
# Minify CSS (optional)
npx uglifycss css/styles.css > css/styles.min.css

# Minify JS (optional)
npx terser js/*.js -o js/app.min.js
```

---

## 📋 Code Style Guide

### Naming Conventions
```javascript
// Variables: camelCase
const envelopeIndex = 0;
let selectedAnswer = null;

// Constants: UPPER_SNAKE_CASE
const STORAGE_KEY = 'luckydraw_questions';
const MAX_ENVELOPES = 12;

// Functions/Methods: camelCase
function validateForm() { }
AdminPanel.handleAddQuestion()

// Classes: PascalCase
class QuestionManager { }

// CSS Classes: kebab-case
class="quiz-option"
class="envelope-used"
```

### Comments
```javascript
// Use descriptive comments
// Single line: //

/* Multi-line comments
   for longer explanations */

// TODO: Future enhancement
// FIXME: Known issue
// HACK: Temporary solution
```

### Indentation
```javascript
// Use 4 spaces (not tabs)
function example() {
    if (condition) {
        doSomething();
    }
}
```

---

## 🚀 Performance Tips

1. **Minimize reflows**
   - Batch DOM updates
   - Use CSS animations instead of JS

2. **Use event delegation**
   - Instead of adding listeners to each item
   - Add one listener to parent

3. **Optimize selectors**
   - Avoid universal selector
   - Be specific with classes

4. **Clean up intervals**
   - Always clearInterval() when done
   - Prevent memory leaks

5. **Lazy load data**
   - Only process needed data
   - Cache results when possible

---

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)

---

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Happy Coding! 🎉**

Nếu có câu hỏi, tham khảo README.md hoặc QUICK-START.md
