document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatPopup = document.getElementById('chat-popup');

    if (!chatToggle || !chatWindow || !chatClose || !chatInput || !chatSend || !chatMessages) {
        return;
    }

    const popupMessages = [
        'Need help with something?',
        'Have a question to ask?',
        'Ask about Anthony!',
        'How can I help you?',
        'Click to chat with me!',
        'Questions? I have answers!'
    ];

    let popupIndex = 0;
    const conversationHistory = [];
    const MAX_HISTORY = 8;

    function rotatePopup() {
        if (!chatPopup) return;
        chatPopup.style.opacity = '0';
        setTimeout(() => {
            chatPopup.textContent = popupMessages[popupIndex % popupMessages.length];
            chatPopup.style.opacity = '1';
            popupIndex += 1;
        }, 300);
    }

    if (chatPopup) {
        setInterval(rotatePopup, 4000);
    }

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            if (!chatMessages.children.length) {
                addMessage('assistant', "Hi! I'm Anthony's AI Secretary. Ask me anything about Anthony and I will help.");
            }
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        const historyForRequest = conversationHistory.slice(-MAX_HISTORY);
        addMessage('user', message);
        chatInput.value = '';
        addMessage('assistant', 'Typing...', 'typing', false);

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    history: historyForRequest,
                }),
            });

            const data = await response.json();
            removeTypingIndicator();

            if (response.ok) {
                addMessage('assistant', data.reply);
            } else if (data.error) {
                addMessage(
                    'assistant',
                    `Error: ${data.error}\n\nMake sure setup is completed in SETUP_GUIDE.md`,
                    '',
                    false
                );
            } else {
                addMessage(
                    'assistant',
                    'Something went wrong. Check SETUP_GUIDE.md for setup help.',
                    '',
                    false
                );
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage(
                'assistant',
                'Connection failed.\n\nThis usually means environment variables are missing or functions are not deployed.\n\nCheck SETUP_GUIDE.md.',
                '',
                false
            );
            console.error('Chat error:', error);
        }
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(sender, text, className = '', trackHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender} ${className}`;
        messageDiv.textContent = text;
        messageDiv.style.whiteSpace = 'pre-wrap';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (
            trackHistory &&
            className !== 'typing' &&
            (sender === 'user' || sender === 'assistant')
        ) {
            conversationHistory.push({
                role: sender === 'assistant' ? 'assistant' : 'user',
                content: text,
            });

            if (conversationHistory.length > MAX_HISTORY) {
                conversationHistory.shift();
            }
        }
    }

    function removeTypingIndicator() {
        const typing = document.querySelector('.typing');
        if (typing) typing.remove();
    }
});
