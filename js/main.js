// Main Module
// Quản lý điều hướng và các sự kiện chính

const MainApp = {
    isAdminOpen: false,
    isStatsOpen: false,

    init() {
        this.setupSettingsButton();
        this.setupAdminOverlay();
        this.setupCloseButton();
        this.setupStatsButton();
        this.setupResetButton();
    },

    setupSettingsButton() {
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.toggleAdminPanel();
            });
        }
    },

    setupStatsButton() {
        const statsBtn = document.getElementById('statsBtn');
        const closeStatsBtn = document.getElementById('closeStatsBtn');
        
        if (statsBtn) {
            statsBtn.addEventListener('click', () => {
                this.toggleStatsPopup();
            });
        }

        if (closeStatsBtn) {
            closeStatsBtn.addEventListener('click', () => {
                this.closeStatsPopup();
            });
        }

        // Close stats when clicking outside
        document.addEventListener('click', (e) => {
            const statsPopup = document.getElementById('statsPopup');
            const statsBtn = document.getElementById('statsBtn');
            if (this.isStatsOpen && !statsPopup.contains(e.target) && !statsBtn.contains(e.target)) {
                this.closeStatsPopup();
            }
        });
    },

    toggleStatsPopup() {
        if (this.isStatsOpen) {
            this.closeStatsPopup();
        } else {
            this.openStatsPopup();
        }
    },

    openStatsPopup() {
        const statsPopup = document.getElementById('statsPopup');
        const statsBtn = document.getElementById('statsBtn');
        
        this.isStatsOpen = true;
        statsPopup.classList.add('active');
        statsBtn.classList.add('active');
    },

    closeStatsPopup() {
        const statsPopup = document.getElementById('statsPopup');
        const statsBtn = document.getElementById('statsBtn');
        
        this.isStatsOpen = false;
        statsPopup.classList.remove('active');
        statsBtn.classList.remove('active');
    },

    setupCloseButton() {
        const closeBtn = document.getElementById('closeAdminBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAdminPanel();
            });
        }
    },

    setupAdminOverlay() {
        // Add click outside to close admin
        const adminPanel = document.getElementById('admin');
        if (adminPanel) {
            // Create overlay for admin panel
            const overlay = document.createElement('div');
            overlay.className = 'admin-overlay';
            overlay.id = 'adminOverlay';
            adminPanel.parentNode.insertBefore(overlay, adminPanel);

            overlay.addEventListener('click', () => {
                this.closeAdminPanel();
            });
        }
    },

    toggleAdminPanel() {
        const adminPanel = document.getElementById('admin');
        const overlay = document.getElementById('adminOverlay');
        const settingsBtn = document.getElementById('settingsBtn');

        if (this.isAdminOpen) {
            this.closeAdminPanel();
        } else {
            // Open admin panel
            this.isAdminOpen = true;
            adminPanel.classList.add('active');
            overlay.classList.add('active');
            settingsBtn.classList.add('active');
            AdminPanel.renderQuestionsList();
        }
    },

    closeAdminPanel() {
        const adminPanel = document.getElementById('admin');
        const overlay = document.getElementById('adminOverlay');
        const settingsBtn = document.getElementById('settingsBtn');

        this.isAdminOpen = false;
        adminPanel.classList.remove('active');
        overlay.classList.remove('active');
        settingsBtn.classList.remove('active');
        
        // Refresh game when closing admin
        GameModule.setupEnvelopes();
        GameModule.updateStats();
    },

    setupResetButton() {
        const resetBtn = document.getElementById('resetBtn');
        const resetQuestionsBtn = document.getElementById('resetQuestionsBtn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }

        if (resetQuestionsBtn) {
            resetQuestionsBtn.addEventListener('click', () => {
                this.resetQuestions();
            });
        }
    },

    resetGame() {
        if (confirm('Bạn có chắc muốn reset tất cả đáp án và bắt đầu lại?')) {
            // Reset all envelope states
            DataManager.resetAllEnvelopes();
            
            // Refresh UI
            GameModule.setupEnvelopes();
            GameModule.updateStats();
            
            // Show success message
            alert('✅ Đã reset game thành công!');
        }
    },

    resetQuestions() {
        if (confirm('Bạn có chắc muốn xóa tất cả câu hỏi và load lại câu hỏi mẫu?')) {
            // Reset questions to sample data
            DataManager.resetToSampleQuestions();
            
            // Also reset envelope states
            DataManager.resetAllEnvelopes();
            
            // Refresh UI
            GameModule.setupEnvelopes();
            GameModule.updateStats();
            AdminModule.renderQuestionsList();
            
            // Show success message
            alert('✅ Đã reset câu hỏi thành công!');
        }
    }
};

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    MainApp.init();
    DataManager.init();
    AdminPanel.init();
    GameModule.init();
    // PeachTree.init(); // Disabled - using SVG instead
    // FallingPetals.init(); // Disabled for performance
});
