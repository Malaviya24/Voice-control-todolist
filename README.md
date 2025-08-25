# 🎤 Voice-Controlled Todo List

> A modern, voice-controlled todo application with premium features, beautiful dark UI, and seamless voice interaction.

[![Voice-Controlled](https://img.shields.io/badge/Voice-Controlled-00d4ff?style=for-the-badge&logo=mic&logoColor=white)](https://github.com/Unsaid-afk/voice-controlled-todo-list)
[![HTTPS Ready](https://img.shields.io/badge/HTTPS-Ready-4CAF50?style=for-the-badge&logo=lock&logoColor=white)](https://github.com/Unsaid-afk/voice-controlled-todo-list)
[![Premium TTS](https://img.shields.io/badge/TTS-ElevenLabs-FF6B6B?style=for-the-badge&logo=speech&logoColor=white)](https://elevenlabs.io/)
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
- **Premium Text-to-Speech**: ElevenLabs API integration for human-like voice responses
- **Voice Settings**: Customizable volume and speed controls with real-time preview
- **Smart Recognition**: Advanced pattern matching for various voice command formats

### 🎨 **Premium UI/UX**
- **Dark Theme**: Modern gradient backgrounds with electric blue accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Glass morphism effects and micro-interactions
- **Real-time Feedback**: Visual indicators and toast notifications

### 📱 **Smart Features**
- **Local Storage**: Persistent data across browser sessions
- **Keyboard Shortcuts**: Enhanced productivity with Ctrl+K (focus) and Ctrl+M (voice toggle)
- **Task Filtering**: Multiple view modes (All, Active, Completed)
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

## 🎯 Voice Commands

| Command | Action | Example |
|---------|--------|---------|
| `"Add task [description]"` | Create new todo item | "Add task buy groceries" |
| `"Complete task [number]"` | Mark task as completed | "Complete task 1" |
| `"Delete task [number]"` | Remove task from list | "Delete task 2" |
| `"Clear all"` | Remove all todos | "Clear all" |
| `"List tasks"` | Hear all active tasks | "List tasks" |
| `[Natural speech]` | Add task with natural language | "Call mom tomorrow" |

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

The application uses ElevenLabs API for premium text-to-speech functionality.

1. **Get API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/)
2. **Configure**: Replace the API key in `script.js`:
```javascript
const API_KEY = 'your-api-key-here';
```

## 📁 Project Structure

```
voice-controlled-todo-list/
├── index.html          # Main HTML structure
├── styles.css          # Premium dark theme styles
├── script.js           # Voice control & application logic
├── package.json        # Project configuration
├── README.md           # Documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## 🛠️ Technologies

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Voice API** | Web Speech API (SpeechRecognition & SpeechSynthesis) |
| **TTS Service** | ElevenLabs Text-to-Speech API |
| **Storage** | localStorage for data persistence |
| **Styling** | CSS Grid, Flexbox, CSS Animations |
| **Icons** | Font Awesome 6 |
| **Typography** | Inter (Google Fonts) |

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
- **API Usage**: ElevenLabs API calls for TTS only (no data storage)
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

- **[ElevenLabs](https://elevenlabs.io/)** for premium text-to-speech API
- **[Font Awesome](https://fontawesome.com/)** for beautiful icons
- **[Google Fonts](https://fonts.google.com/)** for the Inter font family
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** for voice recognition capabilities

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
| TTS not responding | Verify ElevenLabs API key |
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
