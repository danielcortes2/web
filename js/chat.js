class ChatBot {
    constructor() {
        this.chatTrigger = document.querySelector('.chat-trigger');
        this.chatContainer = document.querySelector('.chat-container');
        this.chatMessages = document.querySelector('.chat-messages');
        this.textarea = document.querySelector('.chat-input textarea');
        this.sendButton = document.querySelector('.send-message');
        this.toggleButton = document.querySelector('.toggle-chat');
        this.isOpen = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.chatTrigger.addEventListener('click', () => this.toggleChat());
        this.toggleButton.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.textarea.addEventListener('keypress', (e) => this.handleEnterKey(e));
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.classList.toggle('active');
        this.chatTrigger.style.display = this.isOpen ? 'none' : 'block';
        
        if (this.isOpen) {
            this.chatContainer.style.display = 'flex';
            setTimeout(() => {
                this.textarea.focus();
            }, 300);
        } else {
            setTimeout(() => {
                this.chatContainer.style.display = 'none';
            }, 300);
        }
    }

    async sendMessage(message) {
        this.addMessage(message, 'user-message');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: message
                    }],
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            this.addMessage(botResponse, 'bot-message');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot-message');
        }
    }

    addMessage(text, className) {
        const message = document.createElement('div');
        message.className = `message ${className}`;
        message.textContent = text;
        this.chatMessages.appendChild(message);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    handleSendMessage() {
        const message = this.textarea.value.trim();
        if (message) {
            this.sendMessage(message);
            this.textarea.value = '';
        }
    }

    handleEnterKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendButton.click();
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});