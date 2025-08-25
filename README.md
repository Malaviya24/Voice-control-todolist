# 🎤 Voice-Controlled Todo List

A modern, voice-controlled todo application with premium features, beautiful dark UI, and seamless voice interaction.

![Voice Todo App](https://img.shields.io/badge/Voice-Controlled-00d4ff?style=for-the-badge&logo=mic&logoColor=white)
![HTTPS Ready](https://img.shields.io/badge/HTTPS-Ready-4CAF50?style=for-the-badge&logo=lock&logoColor=white)
![Premium TTS](https://img.shields.io/badge/TTS-ElevenLabs-FF6B6B?style=for-the-badge&logo=speech&logoColor=white)

## ✨ Features

### 🎤 **Voice Control**
- **Natural Voice Commands**: "Add task buy groceries", "Complete task 1", "Delete task 2"
- **Premium Text-to-Speech**: ElevenLabs API integration for natural voice responses
- **Voice Settings**: Customizable volume and speed controls
- **Smart Recognition**: Handles various voice command patterns

### 🎨 **Premium UI/UX**
- **Dark Theme**: Beautiful gradient backgrounds with electric blue accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Glass morphism effects and micro-interactions
- **Real-time Feedback**: Visual indicators and notifications

### 📱 **Smart Features**
- **Local Storage**: Data persists across sessions
- **Keyboard Shortcuts**: Ctrl+K (focus input), Ctrl+M (voice toggle)
- **Task Filtering**: All, Active, and Completed views
- **Task Numbering**: Easy voice reference with numbered tasks
- **Connection Status**: Real-time HTTPS/HTTP detection

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` or `master`
   - Folder: `/ (root)`
3. **Your app will be live at**: `https://yourusername.github.io/voice-controlled-todo-list`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Unsaid-afk/voice-controlled-todo-list.git
cd voice-controlled-todo-list

# Start local server (HTTPS required for voice features)
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000 -S -C-1
```

**Access**: `http://localhost:8000` (or HTTPS URL if using http-server)

## 🎯 Voice Commands

| Command | Action | Example |
|---------|--------|---------|
| `"Add task [description]"` | Add new todo | "Add task buy milk" |
| `"Complete task [number]"` | Mark as done | "Complete task 1" |
| `"Delete task [number]"` | Remove todo | "Delete task 2" |
| `"Clear all"` | Delete all todos | "Clear all" |
| `"List tasks"` | Hear all active tasks | "List tasks" |
| `[Natural speech]` | Add task directly | "Call mom tomorrow" |

## 🔧 Setup for Voice Features

### HTTPS Requirement
Voice recognition requires HTTPS. Choose one:

**Option A: GitHub Pages (Automatic HTTPS)**
- Deploy to GitHub Pages for instant HTTPS

**Option B: Local HTTPS**
```bash
# Enable Chrome flags for localhost
chrome://flags/#unsafely-treat-insecure-origin-as-secure
# Add: http://localhost:8000
```

**Option C: ngrok (Temporary HTTPS)**
```bash
npx ngrok http 8000
# Use the HTTPS URL provided
```

## 🎨 Customization

### Voice Settings
- **Volume Control**: 0-100% with real-time preview
- **Speed Control**: 0.5x to 2x playback speed
- **Settings Persistence**: Saved in localStorage

### API Configuration
The app uses ElevenLabs API for premium text-to-speech. To use your own API key:

1. Get an API key from [ElevenLabs](https://elevenlabs.io/)
2. Replace the API key in `script.js`:
```javascript
const API_KEY = 'your-api-key-here';
```

## 📁 Project Structure

```
voice-controlled-todo-list/
├── index.html          # Main HTML structure
├── styles.css          # Premium dark theme styles
├── script.js           # Voice control & app logic
├── package.json        # Project configuration
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Voice API**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **TTS API**: ElevenLabs Text-to-Speech
- **Storage**: localStorage for data persistence
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## 🎯 Browser Support

| Browser | Voice Recognition | Text-to-Speech | Status |
|---------|------------------|----------------|--------|
| Chrome | ✅ | ✅ | Full Support |
| Edge | ✅ | ✅ | Full Support |
| Firefox | ✅ | ✅ | Full Support |
| Safari | ⚠️ | ✅ | Limited Voice Recognition |
| Mobile Chrome | ✅ | ✅ | Full Support |

## 🔒 Privacy & Security

- **No Data Collection**: All data stored locally in your browser
- **HTTPS Required**: Voice features only work on secure connections
- **API Calls**: ElevenLabs API calls for TTS only (no data storage)
- **Microphone Access**: Only when actively using voice features

## 🚀 Deployment Options

### 1. GitHub Pages (Recommended)
- Free hosting with automatic HTTPS
- Easy setup and maintenance
- Perfect for voice applications

### 2. Netlify
- Drag and drop deployment
- Automatic HTTPS
- Custom domain support

### 3. Vercel
- Zero-config deployment
- Automatic HTTPS
- Edge network optimization

### 4. Firebase Hosting
- Google's hosting platform
- Automatic HTTPS
- Global CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ElevenLabs** for premium text-to-speech API
- **Font Awesome** for beautiful icons
- **Google Fonts** for the Inter font family
- **Web Speech API** for voice recognition capabilities

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure you're using HTTPS for voice features
3. Allow microphone access when prompted
4. Try refreshing the page

For voice recognition issues, see the [HTTPS Setup](#setup-for-voice-features) section.

---

**Made with ❤️ for voice-controlled productivity**

[![GitHub stars](https://img.shields.io/github/stars/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Unsaid-afk/voice-controlled-todo-list?style=social)](https://github.com/Unsaid-afk/voice-controlled-todo-list/network)
[![GitHub issues](https://img.shields.io/github/issues/Unsaid-afk/voice-controlled-todo-list)](https://github.com/Unsaid-afk/voice-controlled-todo-list/issues)
