// Voice Todo App - Main JavaScript
class VoiceTodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('voiceTodos')) || [];
        this.currentFilter = 'all';
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voiceSettings = {
            volume: parseFloat(localStorage.getItem('voiceVolume')) || 0.8,
            speed: parseFloat(localStorage.getItem('voiceSpeed')) || 1.0
        };
        
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.setupEventListeners();
        this.renderTodos();
        this.updateStats();
        this.updateConnectionStatus();
        this.showNotification('Welcome to Voice Todo! Tap the microphone to start.', 'info');
    }

    setupVoiceRecognition() {
        // Use browser's built-in speech recognition with improved error handling
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Configure recognition settings
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;
            
            // Add timeout to prevent hanging
            this.recognition.timeout = 10000; // 10 seconds
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI();
                this.showNotification('Listening... Speak now!', 'info');
                
                // Add timeout fallback
                setTimeout(() => {
                    if (this.isListening) {
                        this.recognition.stop();
                        this.showNotification('Listening timeout. Please try again.', 'warning');
                    }
                }, 15000); // 15 second timeout
            };
            
            this.recognition.onresult = (event) => {
                if (event.results && event.results.length > 0) {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    this.processVoiceCommand(transcript);
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceUI();
                
                let errorMessage = 'Voice recognition error. Please try again.';
                let errorType = 'error';
                
                switch(event.error) {
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                        errorType = 'warning';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please speak clearly and try again.';
                        errorType = 'warning';
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone found. Please connect a microphone and try again.';
                        break;
                    case 'service-not-allowed':
                        errorMessage = 'Voice recognition service not available. Please try again later.';
                        errorType = 'warning';
                        break;
                    case 'aborted':
                        errorMessage = 'Voice recognition was aborted. Please try again.';
                        errorType = 'warning';
                        break;
                    case 'bad-grammar':
                        errorMessage = 'Speech recognition grammar error. Please try again.';
                        errorType = 'warning';
                        break;
                    case 'language-not-supported':
                        errorMessage = 'Language not supported. Please try again.';
                        break;
                    default:
                        errorMessage = `Voice recognition error: ${event.error}. Please try again.`;
                        errorType = 'warning';
                }
                
                this.showNotification(errorMessage, errorType);
                
                // Provide helpful instructions for specific errors
                if (event.error === 'network') {
                    setTimeout(() => {
                        this.showNotification('💡 Tip: Try refreshing the page or check your internet connection', 'info');
                    }, 3000);
                } else if (event.error === 'not-allowed') {
                    setTimeout(() => {
                        this.showNotification('💡 Tip: Click the microphone icon in your browser address bar to allow access', 'info');
                    }, 3000);
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceUI();
            };
            
            // Test recognition availability
            this.testRecognitionAvailability();
        } else {
            this.showNotification('Voice recognition not supported in this browser. Please use Chrome, Edge, or Firefox.', 'error');
            document.getElementById('voiceBtn').disabled = true;
        }
    }
    
    testRecognitionAvailability() {
        // Test if recognition is actually working
        try {
            const testRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            testRecognition.lang = 'en-US';
            testRecognition.continuous = false;
            testRecognition.interimResults = false;
            
            testRecognition.onerror = (event) => {
                if (event.error === 'network' || event.error === 'service-not-allowed') {
                    this.showNotification('Voice recognition service may be unavailable. Please try again later.', 'warning');
                }
            };
            
            testRecognition.onend = () => {
                // Recognition is available
            };
            
            // Start and immediately stop to test
            testRecognition.start();
            setTimeout(() => {
                try {
                    testRecognition.stop();
                } catch (e) {
                    // Ignore errors during test
                }
            }, 100);
        } catch (e) {
            console.warn('Speech recognition test failed:', e);
        }
    }

    setupEventListeners() {
        // Voice button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        // Manual input
        document.getElementById('addBtn').addEventListener('click', () => {
            this.addTodo();
        });

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Voice settings
        this.setupVoiceSettings();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('todoInput').focus();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.toggleVoiceRecognition();
                        break;
                }
            }
        });
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showNotification('Voice recognition not available. Please refresh the page.', 'error');
            return;
        }
        
        if (this.isListening) {
            try {
                this.recognition.stop();
            } catch (e) {
                console.warn('Error stopping recognition:', e);
                this.isListening = false;
                this.updateVoiceUI();
            }
        } else {
            try {
                // Check if we're on HTTPS or localhost
                const isSecure = window.location.protocol === 'https:' || 
                                window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1';
                
                if (!isSecure) {
                    this.showNotification('Voice recognition requires HTTPS. Please use the HTTPS URL.', 'warning');
                    return;
                }
                
                this.recognition.start();
            } catch (e) {
                console.error('Error starting recognition:', e);
                this.showNotification('Failed to start voice recognition. Please try again.', 'error');
            }
        }
    }

    setupVoiceSettings() {
        const volumeSlider = document.getElementById('voiceVolume');
        const speedSlider = document.getElementById('voiceSpeed');
        const volumeValue = volumeSlider.nextElementSibling;
        const speedValue = speedSlider.nextElementSibling;

        // Set initial values
        volumeSlider.value = this.voiceSettings.volume;
        speedSlider.value = this.voiceSettings.speed;
        volumeValue.textContent = Math.round(this.voiceSettings.volume * 100) + '%';
        speedValue.textContent = this.voiceSettings.speed + 'x';

        // Volume slider
        volumeSlider.addEventListener('input', (e) => {
            this.voiceSettings.volume = parseFloat(e.target.value);
            volumeValue.textContent = Math.round(this.voiceSettings.volume * 100) + '%';
            localStorage.setItem('voiceVolume', this.voiceSettings.volume);
        });

        // Speed slider
        speedSlider.addEventListener('input', (e) => {
            this.voiceSettings.speed = parseFloat(e.target.value);
            speedValue.textContent = this.voiceSettings.speed + 'x';
            localStorage.setItem('voiceSpeed', this.voiceSettings.speed);
        });
    }

    updateConnectionStatus() {
        const connectionStatus = document.getElementById('connectionStatus');
        const isHttps = window.location.protocol === 'https:';
        
        if (isHttps) {
            connectionStatus.className = 'status-badge https';
            connectionStatus.innerHTML = '<i class="fas fa-shield-alt"></i><span>HTTPS Secure - Voice Ready</span>';
        } else {
            connectionStatus.className = 'status-badge';
            connectionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>HTTP Mode - Enable HTTPS for voice</span>';
        }
    }

    updateVoiceUI() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceIndicator = document.getElementById('voiceIndicator');
        
        if (this.isListening) {
            voiceBtn.classList.add('listening');
            voiceBtn.querySelector('span').textContent = 'Listening...';
            voiceStatus.textContent = 'Listening...';
            voiceIndicator.classList.add('listening');
        } else {
            voiceBtn.classList.remove('listening');
            voiceBtn.querySelector('span').textContent = 'Tap to speak';
            voiceStatus.textContent = 'Ready to listen';
            voiceIndicator.classList.remove('listening');
        }
    }

    processVoiceCommand(transcript) {
        console.log('Voice command:', transcript);
        
        // Add task commands
        if (transcript.includes('add task') || transcript.includes('add todo') || transcript.includes('new task')) {
            const taskText = transcript.replace(/(add task|add todo|new task)/gi, '').trim();
            if (taskText) {
                this.addTodoByVoice(taskText);
            } else {
                this.speak('Please say the task you want to add');
            }
            return;
        }

        // Complete task commands
        if (transcript.includes('complete task') || transcript.includes('mark done') || transcript.includes('finish task')) {
            const taskNumber = this.extractTaskNumber(transcript);
            if (taskNumber !== null) {
                this.completeTodoByNumber(taskNumber);
            } else {
                this.speak('Please specify which task number to complete');
            }
            return;
        }

        // Delete task commands
        if (transcript.includes('delete task') || transcript.includes('remove task')) {
            const taskNumber = this.extractTaskNumber(transcript);
            if (taskNumber !== null) {
                this.deleteTodoByNumber(taskNumber);
            } else {
                this.speak('Please specify which task number to delete');
            }
            return;
        }

        // Clear all commands
        if (transcript.includes('clear all') || transcript.includes('delete all') || transcript.includes('remove all')) {
            this.clearAllTodos();
            return;
        }

        // List tasks command
        if (transcript.includes('list tasks') || transcript.includes('show tasks') || transcript.includes('read tasks')) {
            this.listTasks();
            return;
        }

        // If no specific command, treat as new task
        this.addTodoByVoice(transcript);
    }

    extractTaskNumber(transcript) {
        const numbers = transcript.match(/\d+/);
        return numbers ? parseInt(numbers[0]) : null;
    }

    addTodoByVoice(text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.speak(`Added task: ${text}`);
        this.showNotification(`Added: ${text}`, 'success');
    }

    completeTodoByNumber(number) {
        const activeTodos = this.todos.filter(todo => !todo.completed);
        if (number > 0 && number <= activeTodos.length) {
            const todo = activeTodos[number - 1];
            todo.completed = true;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.speak(`Completed task: ${todo.text}`);
            this.showNotification(`Completed: ${todo.text}`, 'success');
        } else {
            this.speak(`Task number ${number} not found`);
        }
    }

    deleteTodoByNumber(number) {
        const activeTodos = this.todos.filter(todo => !todo.completed);
        if (number > 0 && number <= activeTodos.length) {
            const todo = activeTodos[number - 1];
            const index = this.todos.indexOf(todo);
            this.todos.splice(index, 1);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.speak(`Deleted task: ${todo.text}`);
            this.showNotification(`Deleted: ${todo.text}`, 'success');
        } else {
            this.speak(`Task number ${number} not found`);
        }
    }

    clearAllTodos() {
        if (this.todos.length === 0) {
            this.speak('No tasks to clear');
            return;
        }
        
        this.todos = [];
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.speak('All tasks cleared');
        this.showNotification('All tasks cleared', 'success');
    }

    listTasks() {
        const activeTodos = this.todos.filter(todo => !todo.completed);
        if (activeTodos.length === 0) {
            this.speak('No active tasks');
            return;
        }
        
        let message = `You have ${activeTodos.length} active tasks: `;
        activeTodos.forEach((todo, index) => {
            message += `Task ${index + 1}: ${todo.text}. `;
        });
        
        this.speak(message);
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            input.value = '';
            this.showNotification(`Added: ${text}`, 'success');
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification(
                todo.completed ? `Completed: ${todo.text}` : `Uncompleted: ${todo.text}`, 
                'success'
            );
        }
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const index = this.todos.indexOf(todo);
            this.todos.splice(index, 1);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification(`Deleted: ${todo.text}`, 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        
        let filteredTodos = this.todos;
        
        switch (this.currentFilter) {
            case 'active':
                filteredTodos = this.todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = this.todos.filter(todo => todo.completed);
                break;
        }
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        todoList.innerHTML = filteredTodos.map((todo, index) => {
            const displayNumber = this.currentFilter === 'all' ? 
                this.todos.filter(t => !t.completed).indexOf(todo) + 1 : 
                index + 1;
            
            return `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="app.toggleTodo(${todo.id})">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="todo-text">
                        ${this.currentFilter === 'all' && !todo.completed ? `<span class="task-number">${displayNumber}.</span> ` : ''}
                        ${todo.text}
                    </div>
                    <div class="todo-actions">
                        <button class="todo-btn delete" onclick="app.deleteTodo(${todo.id})" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const totalTasks = this.todos.length;
        const completedTasks = this.todos.filter(todo => todo.completed).length;
        
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
    }

    saveTodos() {
        localStorage.setItem('voiceTodos', JSON.stringify(this.todos));
    }

    async speak(text) {
        // Use browser's built-in speech synthesis for text-to-speech
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.voiceSettings.speed;
            utterance.pitch = 1;
            utterance.volume = this.voiceSettings.volume;
            this.synthesis.speak(utterance);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = notification.querySelector('.notification-text');
        
        notification.className = `notification ${type}`;
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VoiceTodoApp();
});

// Add some CSS for task numbers
const style = document.createElement('style');
style.textContent = `
    .task-number {
        color: #00d4ff;
        font-weight: 600;
        margin-right: 8px;
    }
`;
document.head.appendChild(style);
