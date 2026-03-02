// Data Management Module
// Lưu trữ tất cả các câu hỏi và dữ liệu game

const DataManager = {
    STORAGE_KEY: 'luckydraw_questions',
    GAME_STATE_KEY: 'luckydraw_gamestate',

    // Initialize data from localStorage
    init() {
        if (!this.getAllQuestions()) {
            this.resetData();
        }
    },

    // Get all questions
    getAllQuestions() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Add a new question
    addQuestion(questionData) {
        const questions = this.getAllQuestions();
        const newQuestion = {
            id: Date.now(),
            ...questionData,
            createdAt: new Date().toISOString()
        };
        questions.push(newQuestion);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questions));
        return newQuestion;
    },

    // Delete a question
    deleteQuestion(questionId) {
        const questions = this.getAllQuestions();
        const filtered = questions.filter(q => q.id !== questionId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    },

    // Get a specific question by ID
    getQuestion(questionId) {
        const questions = this.getAllQuestions();
        return questions.find(q => q.id === questionId);
    },

    // Get game state
    getGameState() {
        const state = localStorage.getItem(this.GAME_STATE_KEY);
        return state ? JSON.parse(state) : {
            usedEnvelopes: [],
            correctCount: 0,
            incorrectCount: 0,
            answers: {}
        };
    },

    // Update game state
    updateGameState(state) {
        localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(state));
    },

    // Mark envelope as used
    markEnvelopeUsed(envelopeIndex) {
        const state = this.getGameState();
        if (!state.usedEnvelopes.includes(envelopeIndex)) {
            state.usedEnvelopes.push(envelopeIndex);
        }
        this.updateGameState(state);
    },

    // Update answer
    recordAnswer(questionId, isCorrect) {
        const state = this.getGameState();
        if (isCorrect) {
            state.correctCount++;
        } else {
            state.incorrectCount++;
        }
        state.answers[questionId] = isCorrect;
        this.updateGameState(state);
    },

    // Check if envelope is used
    isEnvelopeUsed(envelopeIndex) {
        const state = this.getGameState();
        return state.usedEnvelopes.includes(envelopeIndex);
    },

    // Reset all envelopes (for reset button)
    resetAllEnvelopes() {
        const state = this.getGameState();
        state.usedEnvelopes = [];
        state.correctCount = 0;
        state.incorrectCount = 0;
        state.answers = {};
        this.updateGameState(state);
    },

    // Reset all game data
    resetGameState() {
        const state = {
            usedEnvelopes: [],
            correctCount: 0,
            incorrectCount: 0,
            answers: {}
        };
        this.updateGameState(state);
    },

    // Reset all data (questions and game state)
    resetData() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.GAME_STATE_KEY);
        this.updateGameState({
            usedEnvelopes: [],
            correctCount: 0,
            incorrectCount: 0,
            answers: {}
        });
    },

    // Reset questions to sample data
    resetToSampleQuestions() {
        localStorage.removeItem(this.STORAGE_KEY);
        // SampleQuestions will be loaded automatically on next getAllQuestions call
    },

    // Get random question (not used yet)
    getRandomUnusedQuestion() {
        const questions = this.getAllQuestions();
        const state = this.getGameState();
        
        if (questions.length === 0) return null;

        const unusedQuestions = questions.filter(q => !state.answers.hasOwnProperty(q.id));
        
        if (unusedQuestions.length === 0) {
            return null; // All questions used
        }

        return unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    },

    // Get stats
    getStats() {
        const questions = this.getAllQuestions();
        const state = this.getGameState();
        return {
            totalQuestions: questions.length,
            correctCount: state.correctCount,
            incorrectCount: state.incorrectCount,
            totalAnswered: state.correctCount + state.incorrectCount
        };
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
});
