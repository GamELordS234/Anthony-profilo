document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatPopup = document.getElementById('chat-popup');

    // Popup messages
    const popupMessages = [
        'Need help with something?',
        'Have a question to ask?',
        'Ask about Anthony!',
        'How can I help you?',
        'Click to chat with me!',
        'Questions? I\'ve got answers!'
    ];

    let popupIndex = 0;

    // Rotate popup messages
    function rotatePopup() {
        if (chatPopup) {
            chatPopup.style.opacity = '0';
            setTimeout(() => {
                chatPopup.textContent = popupMessages[popupIndex % popupMessages.length];
                chatPopup.style.opacity = '1';
                popupIndex++;
            }, 300);
        }
    }

    // Change popup messages every 4 seconds
    if (chatPopup) {
        setInterval(rotatePopup, 4000);
    }

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            if (!chatMessages.children.length) {
                addMessage('assistant', 'Hi! I\'m Anthony\'s AI Secretary. Ask me anything about Anthony and I\'ll help you out! 😊');
            }
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send message
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage('user', message);
        chatInput.value = '';

        // Show typing indicator
        addMessage('assistant', 'Typing...', 'typing');

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
                timeout: 10000
            });

            const data = await response.json();

            // Remove typing indicator
            removeTypingIndicator();

            if (response.ok) {
                addMessage('assistant', data.reply);
            } else if (data.error) {
                addMessage('assistant', `❌ Error: ${data.error}\n\nMake sure you\'ve completed the setup in SETUP_GUIDE.md`);
            } else {
                addMessage('assistant', '❌ Something went wrong. Check the SETUP_GUIDE.md for help setting up the AI.');
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage('assistant', 
              '❌ Connection Failed!\n\nThe AI isn\'t connected properly. This usually means:\n' +
              '1. Environment variables not set in Netlify\n' +
              '2. Netlify functions not deployed\n\n' +
              '👉 Check SETUP_GUIDE.md for complete setup steps!');
            console.error('Chat error:', error);
        }
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(sender, text, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender} ${className}`;
        messageDiv.textContent = text;
        messageDiv.style.whiteSpace = 'pre-wrap';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.querySelector('.typing');
        if (typing) typing.remove();
    }
});