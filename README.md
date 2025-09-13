# 🎤 Voice-Controlled Todo List

> A modern, AI-powered todo application with voice control, smart recommendations, date management, and intelligent task categorization.

[![Voice-Controlled](https://img.shields.io/badge/Voice-Controlled-00d4ff?style=for-the-badge&logo=mic&logoColor=white)](https://github.com/Unsaid-afk/voice-controlled-todo-list)
[![HTTPS Ready](https://img.shields.io/badge/HTTPS-Ready-4CAF50?style=for-the-badge&logo=lock&logoColor=white)](https://github.com/Unsaid-afk/voice-controlled-todo-list)
[![Speech Recognition](https://img.shields.io/badge/Speech-Recognition-00d4ff?style=for-the-badge&logo=mic&logoColor=white)](https://www.speechmatics.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/network)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🎯 Voice Commands](#-voice-commands)
- [🔧 Setup & Configuration](#-setup--configuration)
- [🎨 Customization](#-customization)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technologies](#️-technologies)
- [🌐 Browser Support](#-browser-support)
- [🔒 Privacy & Security](#-privacy--security)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [📞 Support](#-support)

## ✨ Features

### 🎤 **Voice Control**
- **Natural Voice Commands**: Intuitive voice interaction with natural language processing
- **Browser Text-to-Speech**: Built-in speech synthesis for voice responses
- **Voice Settings**: Customizable volume and speed controls with real-time preview
- **Smart Recognition**: Advanced pattern matching for various voice command formats

### 🤖 **AI-Powered Intelligence**
- **Netflix-Style Recommendations**: Smart suggestions appear as you type
- **Context-Aware Suggestions**: AI understands what you're typing and suggests relevant tasks
- **Pattern Learning**: Learns from your task history to provide better suggestions
- **Time-Based Intelligence**: Different suggestions for work hours vs evening
- **One-Click Add**: Click any AI suggestion to instantly add it to your list

### 📅 **Date-Wise Task Management**
- **Date Picker**: Select specific dates for your tasks
- **Date Filtering**: View tasks by selected date
- **Today Button**: Quick jump to today's tasks
- **Date Display**: Each task shows its assigned date
- **Smart Defaults**: New tasks default to today's date

### 🏷️ **Smart Task Categorization**
- **AI Auto-Detection**: Automatically categorizes tasks based on keywords
- **Type Categories**: Work, Personal, Study, Health, Shopping, Other
- **Color-Coded Types**: Each category has its own color scheme
- **Type Filtering**: Filter tasks by category
- **Manual Override**: Manually select task type if needed

### 🔔 **Advanced Notifications**
- **Browser Notifications**: Native OS notifications for task reminders
- **Toast Notifications**: In-app toast messages for actions
- **Permission Handling**: Requests notification access when needed
- **Multiple Types**: Success, warning, error, and info notifications

### 🎨 **Premium UI/UX**
- **Dark Theme**: Modern gradient backgrounds with electric blue accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Glass morphism effects and micro-interactions
- **Real-time Feedback**: Visual indicators and toast notifications
- **Modern Task Display**: Shows type, date, and status for each task

### 📱 **Smart Features**
- **Local Storage**: Persistent data across browser sessions
- **Keyboard Shortcuts**: Enhanced productivity with Ctrl+K (focus), Ctrl+M (voice toggle), Ctrl+A (AI suggestions)
- **Advanced Filtering**: Filter by status (All, Active, Completed), date, and type
- **Task Numbering**: Voice-friendly task referencing system
- **Connection Status**: Real-time HTTPS/HTTP detection and status display

## 🚀 Quick Start

### Option 1: GitHub Pages Deployment (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Navigate to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` or `master`
   - Folder: `/ (root)`
3. **Access your app**: `https://yourusername.github.io/voice-controlled-todo-list`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Unsaid-afk/voice-controlled-todo-list.git
cd voice-controlled-todo-list

# Start local server (HTTPS required for voice features)
python -m http.server 8000

# Alternative: Use Node.js http-server
npx http-server -p 8000 -S -C-1
```

**Access**: `http://localhost:8000` (or HTTPS URL if using http-server)

## 🎮 Demo & Usage

### **Quick Demo**
1. **Type "meet"** → See AI work suggestions
2. **Type "buy"** → See shopping suggestions  
3. **Click any suggestion** → Instantly add to your list
4. **Select a date** → Add tasks for specific days
5. **Use voice commands** → "Add task call mom tomorrow"

### **AI Recommendations Demo**
```
Type: "meet" → Suggestions:
- Schedule team meeting (Work)
- Call client about project (Work)
- Plan weekly goals (Work)

Type: "buy" → Suggestions:
- Buy groceries (Shopping)
- Order office supplies (Shopping)
- Purchase gifts (Shopping)
```

## 🎯 Voice Commands

| Command | Action | Example |
|---------|--------|---------|
| `"Add task [description]"` | Create new todo item | "Add task buy groceries" |
| `"Complete task [number]"` | Mark task as completed | "Complete task 1" |
| `"Delete task [number]"` | Remove task from list | "Delete task 2" |
| `"Clear all"` | Remove all todos | "Clear all" |
| `"List tasks"` | Hear all active tasks | "List tasks" |
| `[Natural speech]` | Add task with natural language | "Call mom tomorrow" |

## 🤖 AI Recommendations

### **How It Works**
The AI recommendation system provides smart suggestions as you type, similar to Netflix or Amazon:

1. **Start Typing**: Begin typing a task description
2. **See Suggestions**: AI suggestions appear in a dropdown
3. **Click to Add**: Click any suggestion to instantly add it
4. **Auto-Categorization**: Tasks are automatically categorized

### **Smart Suggestions Examples**

| Type | Keywords | AI Suggestions |
|------|----------|----------------|
| **Work** | "meet", "call", "project" | "Schedule team meeting", "Call client about project" |
| **Shopping** | "buy", "shop", "order" | "Buy groceries", "Order office supplies" |
| **Study** | "study", "learn", "read" | "Review course materials", "Complete assignment" |
| **Health** | "exercise", "gym", "doctor" | "Go for a run", "Gym workout session" |

### **Time-Based Intelligence**
- **Work Hours (9 AM - 5 PM)**: Suggests work-related tasks
- **Evening (6 PM - 10 PM)**: Suggests personal and planning tasks
- **Weekend**: Suggests leisure and family activities

### **Pattern Learning**
The AI learns from your task history:
- **Frequent work tasks** → Suggests breaks
- **Study patterns** → Suggests review sessions
- **Personal tasks** → Suggests family time

## 🔧 Setup & Configuration

### HTTPS Requirement

Voice recognition requires a secure connection. Choose your preferred method:

#### **Option A: GitHub Pages (Automatic HTTPS)**
- Deploy to GitHub Pages for instant HTTPS support
- No additional configuration required

#### **Option B: Local HTTPS Development**
```bash
# Enable Chrome flags for localhost
chrome://flags/#unsafely-treat-insecure-origin-as-secure
# Add: http://localhost:8000
```

#### **Option C: ngrok (Temporary HTTPS)**
```bash
# Install ngrok globally
npm install -g ngrok

# Create secure tunnel
ngrok http 8000
# Use the provided HTTPS URL
```

## 🎨 Customization

### Voice Settings
- **Volume Control**: 0-100% with real-time preview
- **Speed Control**: 0.5x to 2x playback speed adjustment
- **Settings Persistence**: Automatically saved in localStorage

### API Configuration

The application uses Speechmatics API for enhanced speech recognition (optional).

1. **Get API Key**: Sign up at [Speechmatics](https://www.speechmatics.com/)
2. **Configure**: Add the API key to environment variables:
```bash
SPEECHMATICS_API_KEY=your-api-key-here
```

## 🆕 New Features

### **Latest Updates**
- ✅ **Netflix-Style AI Recommendations**: Smart suggestions as you type
- ✅ **Date-Wise Task Management**: Select and filter tasks by date
- ✅ **AI Task Categorization**: Automatic type detection and filtering
- ✅ **Advanced Notifications**: Browser and toast notifications
- ✅ **Enhanced UI**: Modern task display with type and date info
- ✅ **Pattern Learning**: AI learns from your task history

### **How to Use New Features**

1. **AI Recommendations**:
   - Type in the input field
   - Click any suggestion to add instantly
   - Try typing "meet", "buy", "study", "exercise"

2. **Date Management**:
   - Select a date for new tasks
   - Use date filter to view specific days
   - Click "Today" for quick access

3. **Task Types**:
   - AI auto-detects task categories
   - Filter by type (Work, Personal, Study, etc.)
   - Color-coded for easy identification

## 📁 Project Structure

```
voice-controlled-todo-list/
├── index.html          # Main HTML structure with AI recommendations
├── styles.css          # Premium dark theme with new UI components
├── script.js           # Voice control, AI logic & application features
├── package.json        # Project configuration
├── env.example         # Environment variables template
├── README.md           # Documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## 🛠️ Technologies

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Voice API** | Web Speech API (SpeechRecognition & SpeechSynthesis) |
| **AI Features** | Smart recommendation engine, pattern learning, context analysis |
| **Speech Recognition** | Web Speech API + Speechmatics (optional) |
| **Storage** | localStorage for data persistence |
| **Styling** | CSS Grid, Flexbox, CSS Animations, Glass Morphism |
| **Icons** | Font Awesome 6 |
| **Typography** | Inter (Google Fonts) |
| **Notifications** | Browser Notifications API, Custom Toast System |

## 🌐 Browser Support

| Browser | Voice Recognition | Text-to-Speech | Status |
|---------|------------------|----------------|--------|
| Chrome | ✅ | ✅ | Full Support |
| Edge | ✅ | ✅ | Full Support |
| Firefox | ✅ | ✅ | Full Support |
| Safari | ⚠️ | ✅ | Limited Voice Recognition |
| Mobile Chrome | ✅ | ✅ | Full Support |

## 🔒 Privacy & Security

- **Local Data Storage**: All data stored locally in your browser
- **HTTPS Requirement**: Voice features require secure connections
- **API Usage**: Speechmatics API calls for speech recognition only (no data storage)
- **Microphone Access**: Requested only when using voice features
- **No Tracking**: Zero analytics or data collection

## 🚀 Deployment

### Recommended Platforms

| Platform | Features | Setup |
|----------|----------|-------|
| **GitHub Pages** | Free, HTTPS, Easy | Fork & enable Pages |
| **Netlify** | Drag & drop, HTTPS | Upload files |
| **Vercel** | Zero-config, Edge | Connect repository |
| **Firebase** | Google CDN, HTTPS | Firebase CLI |

### Deployment Steps

1. **GitHub Pages**:
   - Fork repository
   - Enable Pages in Settings
   - Deploy automatically

2. **Netlify**:
   - Drag project folder to Netlify
   - Automatic HTTPS enabled
   - Custom domain support

3. **Vercel**:
   - Connect GitHub repository
   - Zero configuration required
   - Automatic deployments

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and formatting
- Add comments for complex logic
- Test voice features thoroughly
- Ensure cross-browser compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Speechmatics](https://www.speechmatics.com/)** for enhanced speech recognition
- **[Font Awesome](https://fontawesome.com/)** for beautiful icons
- **[Google Fonts](https://fonts.google.com/)** for the Inter font family
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** for voice recognition capabilities
- **Netflix & Amazon** for inspiration on recommendation systems
- **Modern Web APIs** for notifications and speech synthesis

## 📞 Support

### Troubleshooting

If you encounter issues:

1. **Check Console**: Open browser developer tools for error messages
2. **HTTPS Verification**: Ensure you're using HTTPS for voice features
3. **Microphone Access**: Allow microphone permissions when prompted
4. **Browser Refresh**: Try refreshing the page
5. **HTTPS Setup**: Refer to [Setup & Configuration](#-setup--configuration) section

### Common Issues

| Issue | Solution |
|-------|----------|
| Voice not working | Check HTTPS connection |
| Microphone denied | Allow permissions in browser |
| Speech recognition not working | Check microphone permissions |
| Tasks not saving | Check localStorage availability |

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/Unsaid-afk/voice-controlled-todo-list/issues)
- **Documentation**: Check this README for setup instructions
- **Browser Support**: Verify your browser supports Web Speech API

---

<div align="center">

**Made with ❤️ for voice-controlled productivity**

[![GitHub stars](https://img.shields.io/github/stars/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/network)
[![GitHub issues](https://img.shields.io/github/issues/Unsaid-afk/voice-controlled-todo-list)](https://github.com/Unsaid-afk/voice-controlled-todo-list/issues)

</div>
