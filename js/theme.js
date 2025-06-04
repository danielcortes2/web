class ThemeManager {
    constructor() {
        this.darkBtn = document.querySelector('.dark-btn');
        this.lightBtn = document.querySelector('.light-btn');
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.initializeTheme();
        this.initializeEventListeners();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('light-mode', savedTheme === 'light');
        } else {
            document.body.classList.toggle('light-mode', !this.prefersDark.matches);
        }
    }

    initializeEventListeners() {
        this.darkBtn.addEventListener('click', () => this.activateDarkMode());
        this.lightBtn.addEventListener('click', () => this.activateLightMode());
        this.prefersDark.addEventListener('change', (e) => this.handleSystemThemeChange(e));
    }

    activateDarkMode() {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }

    activateLightMode() {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }

    handleSystemThemeChange(e) {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('light-mode', !e.matches);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});