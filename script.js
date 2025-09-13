// Voice Todo App - Main JavaScript
class VoiceTodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('voiceTodos')) || [];
        this.currentFilter = 'all';
        this.currentDate = null;
        this.currentType = '';
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voiceSettings = {
            volume: parseFloat(localStorage.getItem('voiceVolume')) || 0.8,
            speed: parseFloat(localStorage.getItem('voiceSpeed')) || 1.0
        };
        this.aiSuggestions = [];
        this.notificationPermission = false;
        this.themes = ['dark', 'light', 'blue', 'purple'];
        this.currentThemeIndex = parseInt(localStorage.getItem('themeIndex')) || 0;
        this.currentTheme = this.themes[this.currentThemeIndex];
        
        // New features
        this.timeTracking = JSON.parse(localStorage.getItem('timeTracking')) || {};
        this.goals = JSON.parse(localStorage.getItem('goals')) || [];
        this.activeTimers = new Map();
        this.currentCalendarDate = new Date();
        this.calendarViewVisible = false;
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.timerInterval = null;
        this.stopwatchInterval = null;
        this.timerTime = 0;
        this.stopwatchTime = 0;
        this.lapTimes = [];
        this.taskTimers = JSON.parse(localStorage.getItem('taskTimers')) || [];
        
        this.init();
    }

    // Theme Toggle Functionality
    toggleTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[this.currentThemeIndex];
        localStorage.setItem('themeIndex', this.currentThemeIndex);
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        this.updateThemeIcon();
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    updateThemeIcon() {
        const olderThemeBtn = document.getElementById('olderThemeBtn');
        if (olderThemeBtn) {
            const icon = olderThemeBtn.querySelector('i');
            if (icon) {
                const iconMap = {
                    'dark': 'fas fa-moon',
                    'light': 'fas fa-sun',
                    'blue': 'fas fa-droplet',
                    'purple': 'fas fa-palette'
                };
                icon.className = iconMap[this.currentTheme] || 'fas fa-palette';
            }
        }
    }

    showOlderTheme() {
        // Cycle through all themes
        this.toggleTheme();
        
        // Show notification about current theme
        const themeNames = {
            'dark': 'Dark',
            'light': 'Light',
            'blue': 'Blue',
            'purple': 'Purple'
        };
        const themeName = themeNames[this.currentTheme] || 'Unknown';
        this.showNotification(`Switched to ${themeName} theme`, 'success');
        
        // Add visual feedback
        const olderThemeBtn = document.getElementById('olderThemeBtn');
        if (olderThemeBtn) {
            olderThemeBtn.classList.add('active');
            setTimeout(() => {
                olderThemeBtn.classList.remove('active');
            }, 1000);
        }
    }

    init() {
        this.setupVoiceRecognition();
        this.setupEventListeners();
        this.setupDatePicker();
        this.applyTheme();
        this.updateThemeIcon();
        this.setupNotifications();
        this.initTheme();
        this.initClock();
        this.renderTodos();
        this.updateStats();
        this.updateConnectionStatus();
        
        // Delay voice settings setup to ensure DOM is ready
        setTimeout(() => {
            this.setupVoiceSettings();
        }, 100);
        
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

        // Theme toggle button
        const olderThemeBtn = document.getElementById('olderThemeBtn');
        if (olderThemeBtn) {
            olderThemeBtn.addEventListener('click', () => {
                this.showOlderTheme();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Date filter
        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.setDateFilter(e.target.value);
        });

        // Today button
        document.getElementById('todayBtn').addEventListener('click', () => {
            this.setToday();
        });

        // Type filter
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.setTypeFilter(e.target.value);
        });

        // AI Recommendations
        document.getElementById('todoInput').addEventListener('input', (e) => {
            this.handleInputChange(e.target.value);
        });

        document.getElementById('todoInput').addEventListener('focus', () => {
            this.showRecommendations();
        });

        document.getElementById('todoInput').addEventListener('blur', (e) => {
            // Delay hiding to allow clicking on recommendations
            setTimeout(() => {
                this.hideRecommendations();
            }, 200);
        });

        // Settings Modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideSettings();
        });


        // Theme Selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.setTheme(e.currentTarget.dataset.theme);
            });
        });

        // Settings
        document.getElementById('enableTimeTracking').addEventListener('change', (e) => {
            this.toggleTimeTracking(e.target.checked);
        });

        document.getElementById('enableGoals').addEventListener('change', (e) => {
            this.toggleGoals(e.target.checked);
        });

        // Calendar View
        document.getElementById('calendarViewBtn').addEventListener('click', () => {
            this.toggleCalendarView();
        });

        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Analytics
        document.getElementById('analyticsBtn').addEventListener('click', () => {
            this.showAnalytics();
        });

        document.getElementById('closeAnalytics').addEventListener('click', () => {
            this.hideAnalytics();
        });

        document.getElementById('enableAnalytics').addEventListener('change', (e) => {
            this.toggleAnalytics(e.target.checked);
        });

        // Habit Tracking
        document.getElementById('habitsBtn').addEventListener('click', () => {
            this.showHabits();
        });

        document.getElementById('closeHabits').addEventListener('click', () => {
            this.hideHabits();
        });

        document.getElementById('addHabitBtn').addEventListener('click', () => {
            this.showAddHabitModal();
        });

        document.getElementById('enableHabits').addEventListener('change', (e) => {
            this.toggleHabits(e.target.checked);
        });

        // Clock Timer and Alarm
        document.getElementById('clockBtn').addEventListener('click', () => {
            this.showClock();
        });

        document.getElementById('closeClock').addEventListener('click', () => {
            this.hideClock();
        });

        document.getElementById('addAlarmBtn').addEventListener('click', () => {
            this.showAddAlarmModal();
        });

        // Timer controls
        document.getElementById('timerStart').addEventListener('click', () => {
            this.startTimer();
        });

        document.getElementById('timerPause').addEventListener('click', () => {
            this.pauseTimer();
        });

        document.getElementById('timerReset').addEventListener('click', () => {
            this.resetTimer();
        });

        // Stopwatch controls
        document.getElementById('stopwatchStart').addEventListener('click', () => {
            this.startStopwatch();
        });

        document.getElementById('stopwatchPause').addEventListener('click', () => {
            this.pauseStopwatch();
        });

        document.getElementById('stopwatchReset').addEventListener('click', () => {
            this.resetStopwatch();
        });

        document.getElementById('stopwatchLap').addEventListener('click', () => {
            this.addLapTime();
        });

        // Voice settings are now set up in init() with a delay

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
                    case 'a':
                        e.preventDefault();
                        this.toggleAISidebar();
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
        const volumeValue = document.getElementById('voiceVolumeValue');
        const speedValue = document.getElementById('voiceSpeedValue');
        
        // Check if voice settings elements exist before trying to use them
        if (!volumeSlider || !speedSlider || !volumeValue || !speedValue) {
            return; // Silently skip if elements not found
        }

        try {
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
        } catch (error) {
            console.warn('Error setting up voice settings:', error);
        }
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
        
        // Check if elements exist before trying to update them
        if (!voiceBtn || !voiceStatus || !voiceIndicator) {
            return; // Silently skip if elements not found
        }
        
        try {
            if (this.isListening) {
                voiceBtn.classList.add('listening');
                const voiceBtnSpan = voiceBtn.querySelector('span');
                if (voiceBtnSpan) voiceBtnSpan.textContent = 'Listening...';
                voiceStatus.textContent = 'Listening...';
                voiceIndicator.classList.add('listening');
            } else {
                voiceBtn.classList.remove('listening');
                const voiceBtnSpan = voiceBtn.querySelector('span');
                if (voiceBtnSpan) voiceBtnSpan.textContent = 'Tap to speak';
                voiceStatus.textContent = 'Ready to listen';
                voiceIndicator.classList.remove('listening');
            }
        } catch (error) {
            console.warn('Error updating voice UI:', error);
        }
    }

    processVoiceCommand(transcript) {
        
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
        const detectedType = this.detectTaskType(text);
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            date: this.currentDate || new Date().toISOString().split('T')[0],
            type: detectedType,
            reminderTime: null
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.generateAISuggestions();
        
        // Check for timer/alarm keywords and create them
        this.checkAndCreateTimerOrAlarm(text, todo.id);
        
        this.speak(`Added ${detectedType} task: ${text}`);
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
        const dateInput = document.getElementById('taskDate');
        const typeInput = document.getElementById('taskType');
        const text = input.value.trim();
        
        if (text) {
            const selectedType = typeInput.value || this.detectTaskType(text);
            const selectedDate = dateInput.value || new Date().toISOString().split('T')[0];
            
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString(),
                date: selectedDate,
                type: selectedType,
                reminderTime: null
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.generateAISuggestions();
            
            // Check for timer/alarm keywords and create them
            this.checkAndCreateTimerOrAlarm(text, todo.id);
            
            input.value = '';
            dateInput.value = '';
            typeInput.value = '';
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
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                filteredTodos = this.todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = this.todos.filter(todo => todo.completed);
                break;
        }

        // Apply date filter
        if (this.currentDate) {
            filteredTodos = filteredTodos.filter(todo => todo.date === this.currentDate);
        }

        // Apply type filter
        if (this.currentType) {
            filteredTodos = filteredTodos.filter(todo => todo.type === this.currentType);
        }
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.6);"><i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i><h3>No tasks yet</h3><p>Add a new task to get started!</p></div>';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        todoList.innerHTML = filteredTodos.map((todo, index) => {
            const displayNumber = this.currentFilter === 'all' ? 
                this.todos.filter(t => !t.completed).indexOf(todo) + 1 : 
                index + 1;
            
            const taskDate = new Date(todo.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            return `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-todo-id="${todo.id}">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="todo-content">
                        <div class="todo-text">
                            ${this.currentFilter === 'all' && !todo.completed ? `<span class="task-number">${displayNumber}.</span> ` : ''}
                            ${todo.text}
                        </div>
                        <div class="todo-meta">
                            <span class="todo-type ${todo.type}">${todo.type}</span>
                            <span class="todo-date">${taskDate}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="todo-btn timer" data-todo-id="${todo.id}" title="Start timer">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="todo-btn delete" data-todo-id="${todo.id}" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners for todo items
        todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const todoId = parseInt(e.currentTarget.getAttribute('data-todo-id'));
                this.toggleTodo(todoId);
            });
        });

        todoList.querySelectorAll('.todo-btn.timer').forEach(button => {
            button.addEventListener('click', (e) => {
                const todoId = parseInt(e.currentTarget.getAttribute('data-todo-id'));
                this.toggleTimer(todoId);
            });
        });

        todoList.querySelectorAll('.todo-btn.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const todoId = parseInt(e.currentTarget.getAttribute('data-todo-id'));
                this.deleteTodo(todoId);
            });
        });
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

    // Date functionality
    setupDatePicker() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDate').value = today;
        document.getElementById('dateFilter').value = today;
        this.currentDate = today;
    }

    setDateFilter(date) {
        this.currentDate = date;
        this.renderTodos();
    }

    setToday() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateFilter').value = today;
        this.currentDate = today;
        this.renderTodos();
    }

    setTypeFilter(type) {
        this.currentType = type;
        this.renderTodos();
    }

    // AI Type Detection
    detectTaskType(text) {
        const workKeywords = ['meeting', 'project', 'deadline', 'work', 'office', 'client', 'presentation', 'report', 'email', 'call', 'conference'];
        const personalKeywords = ['home', 'family', 'personal', 'house', 'clean', 'grocery', 'shopping', 'appointment', 'visit'];
        const studyKeywords = ['study', 'learn', 'read', 'course', 'homework', 'assignment', 'exam', 'research', 'book', 'tutorial'];
        const healthKeywords = ['exercise', 'gym', 'doctor', 'health', 'fitness', 'workout', 'medical', 'appointment', 'medicine'];
        const shoppingKeywords = ['buy', 'purchase', 'shop', 'store', 'mall', 'order', 'shopping', 'grocery'];

        const lowerText = text.toLowerCase();
        
        if (workKeywords.some(keyword => lowerText.includes(keyword))) return 'work';
        if (personalKeywords.some(keyword => lowerText.includes(keyword))) return 'personal';
        if (studyKeywords.some(keyword => lowerText.includes(keyword))) return 'study';
        if (healthKeywords.some(keyword => lowerText.includes(keyword))) return 'health';
        if (shoppingKeywords.some(keyword => lowerText.includes(keyword))) return 'shopping';
        
        return 'other';
    }

    // AI Recommendations (Netflix-style)
    handleInputChange(inputValue) {
        if (inputValue.length < 2) {
            this.hideRecommendations();
            return;
        }

        const recommendations = this.generateSmartRecommendations(inputValue);
        this.renderRecommendations(recommendations);
        this.showRecommendations();
    }

    generateSmartRecommendations(input) {
        const allSuggestions = [
            ...this.getRecurringTasks(),
            ...this.getPatternSuggestions(),
            ...this.getSmartSuggestions(input)
        ];

        // Filter and score based on input
        const filtered = allSuggestions
            .map(suggestion => ({
                ...suggestion,
                score: this.calculateRelevanceScore(input, suggestion.text)
            }))
            .filter(suggestion => suggestion.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Show top 5 recommendations

        return filtered;
    }

    getSmartSuggestions(input) {
        const suggestions = [];
        const lowerInput = input.toLowerCase();

        // Context-aware suggestions based on what user is typing
        if (lowerInput.includes('meet') || lowerInput.includes('call')) {
            suggestions.push({ text: 'Schedule team meeting', type: 'work', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Call client about project', type: 'work', id: Date.now() + Math.random() });
        }

        if (lowerInput.includes('buy') || lowerInput.includes('shop')) {
            suggestions.push({ text: 'Buy groceries', type: 'shopping', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Order office supplies', type: 'shopping', id: Date.now() + Math.random() });
        }

        if (lowerInput.includes('study') || lowerInput.includes('learn')) {
            suggestions.push({ text: 'Review course materials', type: 'study', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Complete assignment', type: 'study', id: Date.now() + Math.random() });
        }

        if (lowerInput.includes('exercise') || lowerInput.includes('gym')) {
            suggestions.push({ text: 'Go for a run', type: 'health', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Gym workout session', type: 'health', id: Date.now() + Math.random() });
        }

        // Time-based suggestions
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 17) {
            suggestions.push({ text: 'Check emails', type: 'work', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Update project status', type: 'work', id: Date.now() + Math.random() });
        } else if (hour >= 18 && hour <= 22) {
            suggestions.push({ text: 'Plan tomorrow', type: 'personal', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Family time', type: 'personal', id: Date.now() + Math.random() });
        }

        // Timer and alarm suggestions
        if (lowerInput.includes('timer') || lowerInput.includes('time')) {
            suggestions.push({ text: 'Study for 30 minutes timer', type: 'study', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Workout for 45 minutes timer', type: 'health', id: Date.now() + Math.random() });
            suggestions.push({ text: 'Focus work for 2 hours timer', type: 'work', id: Date.now() + Math.random() });
        }

        if (lowerInput.includes('alarm') || lowerInput.includes('remind') || lowerInput.includes('wake')) {
            const now = new Date();
            const nextHour = now.getHours() + 1;
            const nextHourStr = nextHour.toString().padStart(2, '0');
            const currentMinStr = now.getMinutes().toString().padStart(2, '0');
            
            suggestions.push({ text: `Alarm at ${nextHourStr}:${currentMinStr} for meeting`, type: 'work', id: Date.now() + Math.random() });
            suggestions.push({ text: `Remind me at ${nextHourStr}:30 to call mom`, type: 'personal', id: Date.now() + Math.random() });
            suggestions.push({ text: `Wake up at 7:00 AM tomorrow`, type: 'personal', id: Date.now() + Math.random() });
        }

        return suggestions;
    }

    calculateRelevanceScore(input, suggestionText) {
        const inputWords = input.toLowerCase().split(' ');
        const suggestionWords = suggestionText.toLowerCase().split(' ');
        
        let score = 0;
        
        // Exact word matches
        inputWords.forEach(inputWord => {
            suggestionWords.forEach(suggestionWord => {
                if (suggestionWord.includes(inputWord) || inputWord.includes(suggestionWord)) {
                    score += 2;
                }
            });
        });

        // Partial matches
        inputWords.forEach(inputWord => {
            if (suggestionText.toLowerCase().includes(inputWord)) {
                score += 1;
            }
        });

        return score;
    }

    showRecommendations() {
        const recommendations = document.getElementById('aiRecommendations');
        if (recommendations) {
            recommendations.classList.add('show');
        }
    }

    hideRecommendations() {
        const recommendations = document.getElementById('aiRecommendations');
        if (recommendations) {
            recommendations.classList.remove('show');
        }
    }

    toggleAISidebar() {
        const recommendations = document.getElementById('aiRecommendations');
        if (recommendations) {
            if (recommendations.classList.contains('show')) {
                this.hideRecommendations();
            } else {
                this.showRecommendations();
            }
        }
    }

    renderRecommendations(recommendations) {
        const recommendationsList = document.getElementById('recommendationsList');
        
        if (recommendations.length === 0) {
            recommendationsList.innerHTML = '<div class="recommendation-item"><div class="recommendation-text">No suggestions available</div></div>';
            return;
        }

        recommendationsList.innerHTML = recommendations.map((rec, index) => `
            <div class="recommendation-item" data-text="${rec.text}" data-type="${rec.type}" data-index="${index}">
                <div class="recommendation-text">${rec.text}</div>
                <div class="recommendation-type">${rec.type}</div>
                <div class="recommendation-confidence">${Math.round(rec.score * 20)}% match</div>
            </div>
        `).join('');

        // Add event listeners to each recommendation item
        recommendationsList.querySelectorAll('.recommendation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-text');
                const type = e.currentTarget.getAttribute('data-type');
                this.selectRecommendation(text, type);
            });
        });
    }

    selectRecommendation(text, type) {
        try {
            // Hide the recommendations dropdown first
            this.hideRecommendations();
            
            // Get the selected date
            const selectedDate = document.getElementById('taskDate').value || new Date().toISOString().split('T')[0];
            
            // Create the todo object directly
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString(),
                date: selectedDate,
                type: type,
                reminderTime: null
            };
            
            // Add the todo directly to the array
            this.todos.push(todo);
            
            // Save and render
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            
            // Check for timer/alarm keywords and create them
            this.checkAndCreateTimerOrAlarm(text, todo.id);
            
            // Clear the input field
            document.getElementById('todoInput').value = '';
            document.getElementById('taskType').value = '';
            
            // Show success notifications
            this.showNotification(`Added: ${text}`, 'success');
            
        } catch (error) {
            console.error('Error adding task:', error);
            this.showNotification('Error adding task', 'error');
        }
    }

    // Test function to verify task addition works
    testAddTask() {
        console.log('Test button clicked');
        this.selectRecommendation('Test Task', 'work');
    }

    // Test function for timer/alarm functionality
    testTimerAlarm() {
        console.log('🧪 Testing timer/alarm functionality...');
        
        // Test timer patterns
        const testTexts = [
            'Study for 30 minutes timer',
            'Workout for 1 hour timer',
            'Focus work for 2:30 timer',
            'Alarm at 3:00 PM for meeting',
            'Remind me at 14:30 to call mom'
        ];
        
        testTexts.forEach((text, index) => {
            console.log(`🧪 Test ${index + 1}: "${text}"`);
            this.checkAndCreateTimerOrAlarm(text, Date.now() + index);
        });
    }

    // Theme Management
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.body.className = `theme-${theme}`;
        
        // Update active theme option
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        this.showNotification(`Theme changed to ${theme}`, 'success');
    }


    // Settings Modal
    showSettings() {
        document.getElementById('settingsModal').classList.add('show');
    }

    hideSettings() {
        document.getElementById('settingsModal').classList.remove('show');
    }

    // Time Tracking
    toggleTimeTracking(enabled) {
        localStorage.setItem('timeTrackingEnabled', enabled);
        this.showNotification(enabled ? 'Time tracking enabled' : 'Time tracking disabled', 'info');
    }

    toggleTimer(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo) return;

        if (this.activeTimers.has(todoId)) {
            // Stop timer
            this.stopTimer(todoId);
        } else {
            // Start timer
            this.startTimer(todoId);
        }
    }

    startTimer(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo) return;

        // Stop any other active timers
        this.activeTimers.forEach((_, id) => {
            if (id !== todoId) this.stopTimer(id);
        });

        const startTime = Date.now();
        this.activeTimers.set(todoId, startTime);

        // Update UI
        const timerBtn = document.querySelector(`[data-todo-id="${todoId}"].timer`);
        if (timerBtn) {
            timerBtn.classList.add('running');
            timerBtn.innerHTML = '<i class="fas fa-pause"></i>';
            timerBtn.title = 'Stop timer';
        }

        this.showNotification(`Timer started for: ${todo.text}`, 'success');
    }

    stopTimer(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo) return;

        const startTime = this.activeTimers.get(todoId);
        if (!startTime) return;

        const duration = Date.now() - startTime;
        this.activeTimers.delete(todoId);

        // Update time tracking data
        if (!this.timeTracking[todoId]) {
            this.timeTracking[todoId] = 0;
        }
        this.timeTracking[todoId] += duration;
        localStorage.setItem('timeTracking', JSON.stringify(this.timeTracking));

        // Update UI
        const timerBtn = document.querySelector(`[data-todo-id="${todoId}"].timer`);
        if (timerBtn) {
            timerBtn.classList.remove('running');
            timerBtn.innerHTML = '<i class="fas fa-play"></i>';
            timerBtn.title = 'Start timer';
        }

        const minutes = Math.round(duration / 60000);
        this.showNotification(`Timer stopped. Time spent: ${minutes} minutes`, 'success');
    }

    // Goals Management
    toggleGoals(enabled) {
        localStorage.setItem('goalsEnabled', enabled);
        this.showNotification(enabled ? 'Goal tracking enabled' : 'Goal tracking disabled', 'info');
    }

    addGoal(goal) {
        const newGoal = {
            id: Date.now(),
            text: goal,
            completed: false,
            createdAt: new Date().toISOString(),
            targetDate: null
        };
        this.goals.push(newGoal);
        this.saveGoals();
        this.showNotification(`Goal added: ${goal}`, 'success');
    }

    saveGoals() {
        localStorage.setItem('goals', JSON.stringify(this.goals));
    }

    // Initialize theme on load
    initTheme() {
        document.body.className = `theme-${this.currentTheme}`;
        
        // Set active theme option
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeOption = document.querySelector(`[data-theme="${this.currentTheme}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    // Calendar Integration
    toggleCalendarView() {
        this.calendarViewVisible = !this.calendarViewVisible;
        const calendarSection = document.getElementById('calendarSection');
        
        if (this.calendarViewVisible) {
            calendarSection.style.display = 'block';
            this.renderCalendar();
            this.showNotification('Calendar view opened', 'info');
        } else {
            calendarSection.style.display = 'none';
            this.showNotification('Calendar view closed', 'info');
        }
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonth = document.getElementById('currentMonth');
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        currentMonth.textContent = this.currentCalendarDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-tasks"></div>
            `;

            const currentDate = new Date(year, month, day);
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Check if this day has tasks
            const dayTasks = this.todos.filter(todo => todo.date === dateString);
            if (dayTasks.length > 0) {
                dayElement.classList.add('has-tasks');
                const tasksElement = dayElement.querySelector('.calendar-day-tasks');
                tasksElement.textContent = `${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}`;
            }

            // Check if this is today
            const today = new Date();
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Add click event to filter by date
            dayElement.addEventListener('click', () => {
                this.setDateFilter(dateString);
                this.toggleCalendarView(); // Close calendar after selection
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    changeMonth(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.renderCalendar();
    }

    // Analytics Dashboard
    showAnalytics() {
        document.getElementById('analyticsSection').style.display = 'block';
        this.updateAnalytics();
        this.showNotification('Analytics dashboard opened', 'info');
    }

    hideAnalytics() {
        document.getElementById('analyticsSection').style.display = 'none';
        this.showNotification('Analytics dashboard closed', 'info');
    }

    toggleAnalytics(enabled) {
        localStorage.setItem('analyticsEnabled', enabled);
        this.showNotification(enabled ? 'Analytics enabled' : 'Analytics disabled', 'info');
    }

    updateAnalytics() {
        const totalTasks = this.todos.length;
        const completedTasks = this.todos.filter(todo => todo.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Update basic metrics
        document.getElementById('totalTasksAnalytics').textContent = totalTasks;
        document.getElementById('completionRate').textContent = `${completionRate}%`;

        // Calculate time tracking metrics
        const totalTimeMs = Object.values(this.timeTracking).reduce((sum, time) => sum + time, 0);
        const totalHours = Math.round(totalTimeMs / (1000 * 60 * 60) * 10) / 10;
        const avgTimePerTask = totalTasks > 0 ? Math.round(totalTimeMs / (1000 * 60) / totalTasks) : 0;

        document.getElementById('totalTimeSpent').textContent = `${totalHours}h`;
        document.getElementById('avgTimePerTask').textContent = `${avgTimePerTask}m`;

        // Generate task type chart
        this.generateTaskTypeChart();
        
        // Generate weekly progress chart
        this.generateWeeklyChart();
    }

    generateTaskTypeChart() {
        const typeCounts = {};
        this.todos.forEach(todo => {
            const type = todo.type || 'other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const chartContainer = document.getElementById('taskTypeChart');
        chartContainer.innerHTML = '';

        if (Object.keys(typeCounts).length === 0) {
            chartContainer.innerHTML = '<div style="color: #b0b0b0;">No data available</div>';
            return;
        }

        const maxCount = Math.max(...Object.values(typeCounts));
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';

        Object.entries(typeCounts).forEach(([type, count]) => {
            const height = (count / maxCount) * 100;
            const barItem = document.createElement('div');
            barItem.className = 'chart-bar-item';
            barItem.style.height = `${height}%`;
            barItem.title = `${type}: ${count} tasks`;
            
            const label = document.createElement('div');
            label.className = 'chart-bar-label';
            label.textContent = type;
            barItem.appendChild(label);
            
            chartBar.appendChild(barItem);
        });

        chartContainer.appendChild(chartBar);
    }

    generateWeeklyChart() {
        const weeklyData = this.getWeeklyData();
        const chartContainer = document.getElementById('weeklyChart');
        chartContainer.innerHTML = '';

        if (weeklyData.length === 0) {
            chartContainer.innerHTML = '<div style="color: #b0b0b0;">No data available</div>';
            return;
        }

        const maxCount = Math.max(...weeklyData.map(day => day.completed));
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';

        weeklyData.forEach(day => {
            const height = maxCount > 0 ? (day.completed / maxCount) * 100 : 0;
            const barItem = document.createElement('div');
            barItem.className = 'chart-bar-item';
            barItem.style.height = `${height}%`;
            barItem.title = `${day.day}: ${day.completed} completed`;
            
            const label = document.createElement('div');
            label.className = 'chart-bar-label';
            label.textContent = day.day;
            barItem.appendChild(label);
            
            chartBar.appendChild(barItem);
        });

        chartContainer.appendChild(chartBar);
    }

    getWeeklyData() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            const dayTasks = this.todos.filter(todo => todo.date === dateString);
            const completedTasks = dayTasks.filter(todo => todo.completed);
            
            weeklyData.push({
                day: days[date.getDay()],
                total: dayTasks.length,
                completed: completedTasks.length
            });
        }
        
        return weeklyData;
    }

    // Habit Tracking
    showHabits() {
        document.getElementById('habitsSection').style.display = 'block';
        this.renderHabits();
        this.showNotification('Habit tracker opened', 'info');
    }

    hideHabits() {
        document.getElementById('habitsSection').style.display = 'none';
        this.showNotification('Habit tracker closed', 'info');
    }

    toggleHabits(enabled) {
        localStorage.setItem('habitsEnabled', enabled);
        this.showNotification(enabled ? 'Habit tracking enabled' : 'Habit tracking disabled', 'info');
    }

    showAddHabitModal() {
        const title = prompt('Enter habit title:');
        if (!title) return;
        
        const description = prompt('Enter habit description (optional):') || '';
        
        const newHabit = {
            id: Date.now(),
            title: title,
            description: description,
            createdAt: new Date().toISOString(),
            completedDays: [],
            streak: 0
        };
        
        this.habits.push(newHabit);
        this.saveHabits();
        this.renderHabits();
        this.showNotification(`Habit "${title}" added!`, 'success');
    }

    renderHabits() {
        const habitsGrid = document.getElementById('habitsGrid');
        habitsGrid.innerHTML = '';

        if (this.habits.length === 0) {
            habitsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #b0b0b0; padding: 40px;">
                    <i class="fas fa-repeat" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No habits yet</h3>
                    <p>Click "Add Habit" to start tracking your daily habits!</p>
                </div>
            `;
            return;
        }

        this.habits.forEach(habit => {
            const habitCard = document.createElement('div');
            habitCard.className = 'habit-card';
            
            const today = new Date().toISOString().split('T')[0];
            const isCompletedToday = habit.completedDays.includes(today);
            const streak = this.calculateStreak(habit);
            
            habitCard.innerHTML = `
                <div class="habit-header">
                    <div class="habit-title">${habit.title}</div>
                    <div class="habit-streak">${streak} day streak</div>
                </div>
                <div class="habit-description">${habit.description}</div>
                <div class="habit-calendar">
                    ${this.generateHabitCalendar(habit)}
                </div>
                <div class="habit-actions">
                    <button class="habit-check-btn ${isCompletedToday ? 'checked' : ''}" 
                            data-habit-id="${habit.id}">
                        <i class="fas fa-${isCompletedToday ? 'check' : 'plus'}"></i>
                        ${isCompletedToday ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button class="habit-delete-btn" data-habit-id="${habit.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            habitsGrid.appendChild(habitCard);
        });

        // Add event listeners
        habitsGrid.querySelectorAll('.habit-check-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const habitId = parseInt(e.currentTarget.getAttribute('data-habit-id'));
                this.toggleHabitCompletion(habitId);
            });
        });

        habitsGrid.querySelectorAll('.habit-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const habitId = parseInt(e.currentTarget.getAttribute('data-habit-id'));
                this.deleteHabit(habitId);
            });
        });
    }

    generateHabitCalendar(habit) {
        const today = new Date();
        const calendar = [];
        
        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const isCompleted = habit.completedDays.includes(dateString);
            const isToday = i === 0;
            
            calendar.push(`
                <div class="habit-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}" 
                     title="${dayName} ${dateString}">
                    ${dayName[0]}
                </div>
            `);
        }
        
        return calendar.join('');
    }

    calculateStreak(habit) {
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i < 365; i++) { // Check up to a year
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            if (habit.completedDays.includes(dateString)) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    toggleHabitCompletion(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDays.includes(today);
        
        if (isCompletedToday) {
            // Remove from completed days
            habit.completedDays = habit.completedDays.filter(day => day !== today);
            this.showNotification(`Habit "${habit.title}" unchecked`, 'info');
        } else {
            // Add to completed days
            habit.completedDays.push(today);
            this.showNotification(`Habit "${habit.title}" completed!`, 'success');
        }
        
        this.saveHabits();
        this.renderHabits();
    }

    deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.saveHabits();
            this.renderHabits();
            this.showNotification('Habit deleted', 'info');
        }
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    // Clock Timer and Alarm
    initClock() {
        this.updateCurrentTime();
        setInterval(() => {
            this.updateCurrentTime();
            this.checkAlarms();
        }, 1000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const currentTimeEl = document.getElementById('currentTime');
        const currentDateEl = document.getElementById('currentDate');
        
        if (currentTimeEl) currentTimeEl.textContent = timeString;
        if (currentDateEl) currentDateEl.textContent = dateString;
    }

    showClock() {
        document.getElementById('clockSection').style.display = 'block';
        this.renderAlarms();
        this.showNotification('Clock & Timer opened', 'info');
    }

    hideClock() {
        document.getElementById('clockSection').style.display = 'none';
        this.showNotification('Clock & Timer closed', 'info');
    }

    // Timer Functions
    startTimer() {
        if (this.timerInterval) return;

        const hours = parseInt(document.getElementById('timerHours').value) || 0;
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

        this.timerTime = hours * 3600 + minutes * 60 + seconds;
        
        if (this.timerTime <= 0) {
            this.showNotification('Please set a valid timer duration', 'error');
            return;
        }

        this.timerInterval = setInterval(() => {
            this.timerTime--;
            this.updateTimerDisplay();
            
            if (this.timerTime <= 0) {
                this.timerFinished();
            }
        }, 1000);

        this.updateTimerButtons('running');
        this.showNotification('Timer started', 'success');
    }

    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.updateTimerButtons('paused');
            this.showNotification('Timer paused', 'info');
        }
    }

    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.timerTime = 0;
        this.updateTimerDisplay();
        this.updateTimerButtons('stopped');
        this.showNotification('Timer reset', 'info');
    }

    timerFinished() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.updateTimerButtons('stopped');
        this.showNotification('Timer finished!', 'success');
        this.showBrowserNotification('Timer Finished', 'Your timer has completed!');
        
        // Play notification sound if available
        this.playNotificationSound();
    }

    updateTimerDisplay() {
        const hours = Math.floor(this.timerTime / 3600);
        const minutes = Math.floor((this.timerTime % 3600) / 60);
        const seconds = this.timerTime % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = timeString;
    }

    updateTimerButtons(state) {
        const startBtn = document.getElementById('timerStart');
        const pauseBtn = document.getElementById('timerPause');
        const resetBtn = document.getElementById('timerReset');

        if (state === 'running') {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
        } else if (state === 'paused') {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
        }
    }

    // Stopwatch Functions
    startStopwatch() {
        if (this.stopwatchInterval) return;

        this.stopwatchInterval = setInterval(() => {
            this.stopwatchTime++;
            this.updateStopwatchDisplay();
        }, 100);

        this.updateStopwatchButtons('running');
        this.showNotification('Stopwatch started', 'success');
    }

    pauseStopwatch() {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
            this.updateStopwatchButtons('paused');
            this.showNotification('Stopwatch paused', 'info');
        }
    }

    resetStopwatch() {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
        }
        
        this.stopwatchTime = 0;
        this.lapTimes = [];
        this.updateStopwatchDisplay();
        this.updateStopwatchButtons('stopped');
        this.renderLapTimes();
        this.showNotification('Stopwatch reset', 'info');
    }

    addLapTime() {
        if (this.stopwatchTime > 0) {
            const lapTime = this.stopwatchTime;
            this.lapTimes.push({
                lap: this.lapTimes.length + 1,
                time: lapTime
            });
            this.renderLapTimes();
            this.showNotification(`Lap ${this.lapTimes.length} recorded`, 'info');
        }
    }

    updateStopwatchDisplay() {
        const totalSeconds = Math.floor(this.stopwatchTime / 10);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = this.stopwatchTime % 10;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds}`;
        document.getElementById('stopwatchDisplay').textContent = timeString;
    }

    updateStopwatchButtons(state) {
        const startBtn = document.getElementById('stopwatchStart');
        const pauseBtn = document.getElementById('stopwatchPause');
        const resetBtn = document.getElementById('stopwatchReset');
        const lapBtn = document.getElementById('stopwatchLap');

        if (state === 'running') {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            lapBtn.disabled = false;
        } else if (state === 'paused') {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            lapBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
            lapBtn.disabled = true;
        }
    }

    renderLapTimes() {
        const lapTimesContainer = document.getElementById('lapTimes');
        lapTimesContainer.innerHTML = '';

        if (this.lapTimes.length === 0) {
            lapTimesContainer.innerHTML = '<div style="text-align: center; color: #b0b0b0; padding: 20px;">No lap times recorded</div>';
            return;
        }

        this.lapTimes.forEach(lap => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-time';
            
            const totalSeconds = Math.floor(lap.time / 10);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const centiseconds = lap.time % 10;
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds}`;
            
            lapElement.innerHTML = `
                <span>Lap ${lap.lap}</span>
                <span>${timeString}</span>
            `;
            
            lapTimesContainer.appendChild(lapElement);
        });
    }

    // Alarm Functions
    showAddAlarmModal() {
        const time = prompt('Enter alarm time (HH:MM):');
        if (!time || !time.match(/^\d{2}:\d{2}$/)) {
            this.showNotification('Invalid time format. Use HH:MM', 'error');
            return;
        }

        const label = prompt('Enter alarm label (optional):') || 'Alarm';
        
        const newAlarm = {
            id: Date.now(),
            time: time,
            label: label,
            enabled: true,
            createdAt: new Date().toISOString()
        };
        
        this.alarms.push(newAlarm);
        this.saveAlarms();
        this.renderAlarms();
        this.showNotification(`Alarm "${label}" added for ${time}`, 'success');
    }

    renderAlarms() {
        const alarmsList = document.getElementById('alarmsList');
        alarmsList.innerHTML = '';

        if (this.alarms.length === 0) {
            alarmsList.innerHTML = `
                <div style="text-align: center; color: #b0b0b0; padding: 20px;">
                    <i class="fas fa-bell" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>No alarms set</p>
                </div>
            `;
            return;
        }

        this.alarms.forEach(alarm => {
            const alarmElement = document.createElement('div');
            alarmElement.className = `alarm-item ${alarm.enabled ? 'active' : ''}`;
            
            alarmElement.innerHTML = `
                <div class="alarm-info">
                    <div class="alarm-time">${alarm.time}</div>
                    <div class="alarm-label">${alarm.label}</div>
                </div>
                <div class="alarm-actions">
                    <button class="alarm-toggle ${alarm.enabled ? '' : 'disabled'}" 
                            data-alarm-id="${alarm.id}">
                        ${alarm.enabled ? 'ON' : 'OFF'}
                    </button>
                    <button class="alarm-delete" data-alarm-id="${alarm.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            alarmsList.appendChild(alarmElement);
        });

        // Add event listeners
        alarmsList.querySelectorAll('.alarm-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alarmId = parseInt(e.currentTarget.getAttribute('data-alarm-id'));
                this.toggleAlarm(alarmId);
            });
        });

        alarmsList.querySelectorAll('.alarm-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alarmId = parseInt(e.currentTarget.getAttribute('data-alarm-id'));
                this.deleteAlarm(alarmId);
            });
        });
    }

    toggleAlarm(alarmId) {
        const alarm = this.alarms.find(a => a.id === alarmId);
        if (!alarm) return;

        alarm.enabled = !alarm.enabled;
        this.saveAlarms();
        this.renderAlarms();
        this.showNotification(`Alarm ${alarm.enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    deleteAlarm(alarmId) {
        if (confirm('Are you sure you want to delete this alarm?')) {
            this.alarms = this.alarms.filter(a => a.id !== alarmId);
            this.saveAlarms();
            this.renderAlarms();
            this.showNotification('Alarm deleted', 'info');
        }
    }

    checkAlarms() {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        this.alarms.forEach(alarm => {
            if (alarm.enabled && alarm.time === currentTime) {
                this.triggerAlarm(alarm);
            }
        });
    }

    triggerAlarm(alarm) {
        this.showNotification(`ALARM: ${alarm.label}`, 'success');
        this.showBrowserNotification('Alarm', alarm.label);
        this.playNotificationSound();
        
        // Disable alarm after triggering
        alarm.enabled = false;
        this.saveAlarms();
        this.renderAlarms();
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }

    saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }

    getRecurringTasks() {
        const recurring = [];
        const today = new Date();
        const dayOfWeek = today.getDay();
        const dayOfMonth = today.getDate();

        // Daily recurring tasks
        if (dayOfWeek === 1) recurring.push({ text: 'Plan weekly goals', type: 'work', recurring: 'weekly' });
        if (dayOfWeek === 5) recurring.push({ text: 'Review weekly progress', type: 'work', recurring: 'weekly' });
        if (dayOfWeek === 0) recurring.push({ text: 'Plan next week', type: 'personal', recurring: 'weekly' });

        // Monthly recurring tasks
        if (dayOfMonth === 1) recurring.push({ text: 'Monthly budget review', type: 'personal', recurring: 'monthly' });
        if (dayOfMonth === 15) recurring.push({ text: 'Mid-month check-in', type: 'work', recurring: 'monthly' });

        // Health reminders
        recurring.push({ text: 'Drink water', type: 'health', recurring: 'daily' });
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
            recurring.push({ text: 'Exercise session', type: 'health', recurring: 'weekly' });
        }

        return recurring.map(task => ({
            ...task,
            id: Date.now() + Math.random(),
            clickable: true
        }));
    }

    getPatternSuggestions() {
        const patterns = [];
        const recentTasks = this.todos.slice(-10);
        const typeCounts = {};

        // Analyze recent task types
        recentTasks.forEach(task => {
            typeCounts[task.type] = (typeCounts[task.type] || 0) + 1;
        });

        // Suggest based on patterns
        if (typeCounts.work > 3) {
            patterns.push({ text: 'Take a break', type: 'health', id: Date.now() + Math.random() });
        }
        if (typeCounts.study > 2) {
            patterns.push({ text: 'Review notes', type: 'study', id: Date.now() + Math.random() });
        }
        if (typeCounts.personal > 2) {
            patterns.push({ text: 'Call family', type: 'personal', id: Date.now() + Math.random() });
        }

        return patterns.map(task => ({
            ...task,
            clickable: true
        }));
    }

    // Generate AI suggestions (called after adding tasks)
    generateAISuggestions() {
        // This function is called after adding tasks to potentially update suggestions
        // The actual suggestions are generated in handleInputChange when user types
    }

    // Check for timer/alarm keywords and create them automatically
    checkAndCreateTimerOrAlarm(text, todoId) {
        const lowerText = text.toLowerCase();
        
        // Timer patterns (duration-based) - Simplified and more flexible
        const timerPatterns = [
            { pattern: /(\d+)\s*min(?:ute|utes?)?\s*timer/i, type: 'minutes' },
            { pattern: /(\d+)\s*hr(?:our|ours?)?\s*timer/i, type: 'hours' },
            { pattern: /timer\s*(\d+)\s*min(?:ute|utes?)?/i, type: 'minutes' },
            { pattern: /timer\s*(\d+)\s*hr(?:our|ours?)?/i, type: 'hours' },
            { pattern: /(\d+):(\d+)\s*timer/i, type: 'time' },
            { pattern: /(\d+)\s*min(?:ute|utes?)?\s*for/i, type: 'minutes' },
            { pattern: /(\d+)\s*hr(?:our|ours?)?\s*for/i, type: 'hours' }
        ];

        // Alarm patterns (time-based) - Simplified
        const alarmPatterns = [
            { pattern: /alarm\s*(\d{1,2}):(\d{2})/i, type: 'time' },
            { pattern: /remind\s*(\d{1,2}):(\d{2})/i, type: 'time' },
            { pattern: /wake\s*(\d{1,2}):(\d{2})/i, type: 'time' },
            { pattern: /at\s*(\d{1,2}):(\d{2})/i, type: 'time' }
        ];

        // Check for timer patterns
        for (const timerPattern of timerPatterns) {
            const match = lowerText.match(timerPattern.pattern);
            if (match) {
                this.createTimerFromTask(match, timerPattern.type, text, todoId);
                return;
            }
        }

        // Check for alarm patterns
        for (const alarmPattern of alarmPatterns) {
            const match = lowerText.match(alarmPattern.pattern);
            if (match) {
                this.createAlarmFromTask(match, text, todoId);
                return;
            }
        }
    }

    // Create timer from task text
    createTimerFromTask(match, type, originalText, todoId) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (type === 'minutes') {
            minutes = parseInt(match[1]);
        } else if (type === 'hours') {
            hours = parseInt(match[1]);
        } else if (type === 'time') {
            if (match[2]) {
                hours = parseInt(match[1]);
                minutes = parseInt(match[2]);
            } else {
                minutes = parseInt(match[1]);
            }
        }

        // Set timer values in the UI
        const timerHoursEl = document.getElementById('timerHours');
        const timerMinutesEl = document.getElementById('timerMinutes');
        const timerSecondsEl = document.getElementById('timerSeconds');
        
        if (timerHoursEl) timerHoursEl.value = hours;
        if (timerMinutesEl) timerMinutesEl.value = minutes;
        if (timerSecondsEl) timerSecondsEl.value = seconds;

        // Create a timer entry for this task
        const timerEntry = {
            id: Date.now(),
            todoId: todoId,
            duration: hours * 3600 + minutes * 60 + seconds,
            originalText: originalText,
            createdAt: new Date().toISOString()
        };

        // Store timer info
        if (!this.taskTimers) {
            this.taskTimers = JSON.parse(localStorage.getItem('taskTimers')) || [];
        }
        this.taskTimers.push(timerEntry);
        localStorage.setItem('taskTimers', JSON.stringify(this.taskTimers));

        this.showNotification(`Timer set for ${hours}h ${minutes}m: ${originalText}`, 'success');
        
        // Auto-start timer if it's a reasonable duration (less than 4 hours)
        if (hours < 4) {
            setTimeout(() => {
                this.startTimer();
            }, 1000);
        }
    }

    // Create alarm from task text
    createAlarmFromTask(match, originalText, todoId) {
        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2]);
        const ampm = match[0].toLowerCase().includes('pm') ? 'pm' : 
                    match[0].toLowerCase().includes('am') ? 'am' : null;

        // Convert to 24-hour format if needed
        if (ampm === 'pm' && hours !== 12) {
            hours += 12;
        } else if (ampm === 'am' && hours === 12) {
            hours = 0;
        }

        // Format time as HH:MM
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Create alarm
        const alarm = {
            id: Date.now(),
            time: timeString,
            label: originalText,
            enabled: true,
            createdAt: new Date().toISOString(),
            todoId: todoId
        };
        
        this.alarms.push(alarm);
        this.saveAlarms();
        
        // Update alarms display if clock section is visible
        const clockSection = document.getElementById('clockSection');
        if (clockSection && clockSection.style.display !== 'none') {
            this.renderAlarms();
        }

        this.showNotification(`Alarm set for ${timeString}: ${originalText}`, 'success');
    }


    // Notifications
    setupNotifications() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                this.notificationPermission = permission === 'granted';
            });
        }
    }

    showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 
                    type === 'error' ? 'times-circle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    showBrowserNotification(title, message) {
        if (this.notificationPermission && 'Notification' in window) {
            new Notification(title, {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎤</text></svg>'
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VoiceTodoApp();
    
    // Make test functions available globally
    window.testTimerAlarm = () => window.app.testTimerAlarm();
    window.testAddTask = () => window.app.testAddTask();
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
