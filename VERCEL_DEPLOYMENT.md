# 🚀 Vercel Deployment Guide

This guide will help you deploy your Voice-Controlled Todo List to Vercel with proper environment variable configuration.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [GitHub Account](https://github.com)
- [ElevenLabs API Key](https://elevenlabs.io/)

## 🎯 Step-by-Step Deployment

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Using Vercel Dashboard (Recommended)**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**:
   - Select `voice-controlled-todo-list`
   - Click "Import"

4. **Configure project settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `./` (leave empty)
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add the following:
     ```
     Name: ELEVENLABS_API_KEY
     Value: your_actual_api_key_here
     Environment: Production, Preview, Development
     ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

#### **Option B: Using Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add ELEVENLABS_API_KEY
   ```

### **Step 3: Configure Environment Variables**

#### **In Vercel Dashboard**:

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add the following variables**:

| Name | Value | Environment |
|------|-------|-------------|
| `ELEVENLABS_API_KEY` | `your_actual_api_key` | Production, Preview, Development |

#### **Using Vercel CLI**:

```bash
# Add environment variable
vercel env add ELEVENLABS_API_KEY

# List environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

### **Step 4: Get Your ElevenLabs API Key**

1. **Go to [ElevenLabs](https://elevenlabs.io/)**
2. **Sign up/Login**
3. **Navigate to Profile → API Key**
4. **Copy your API key**
5. **Add it to Vercel environment variables**

## 🔧 Configuration Files

### **vercel.json**
```json
{
  "version": 2,
  "name": "voice-controlled-todo-list",
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### **Environment Variables**
```bash
# .env.local (for local development)
ELEVENLABS_API_KEY=your_api_key_here
```

## 🌐 Custom Domain (Optional)

1. **Go to your Vercel project**
2. **Navigate to "Domains"**
3. **Add your custom domain**
4. **Configure DNS settings**

## 🔄 Automatic Deployments

- **Every push to `main` branch** triggers automatic deployment
- **Preview deployments** for pull requests
- **Production deployments** for merged PRs

## 🛠️ Troubleshooting

### **Common Issues**:

1. **Environment Variables Not Working**:
   - Check if variables are set for all environments
   - Redeploy after adding variables

2. **Build Errors**:
   - Check Vercel build logs
   - Ensure all files are committed

3. **Voice Features Not Working**:
   - Verify HTTPS is enabled (automatic on Vercel)
   - Check browser console for errors

### **Debug Commands**:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy
vercel --prod
```

## 📱 Post-Deployment

### **Test Your Deployment**:

1. **Visit your Vercel URL**
2. **Test voice features**:
   - Click microphone button
   - Say "Add task test"
   - Verify TTS response

3. **Check HTTPS**:
   - URL should start with `https://`
   - Voice features should work

### **Monitor Usage**:

1. **Vercel Analytics** (if enabled)
2. **ElevenLabs Dashboard** for API usage
3. **Browser console** for errors

## 🔒 Security Best Practices

1. **Never commit API keys** to repository
2. **Use environment variables** for sensitive data
3. **Enable Vercel security headers**
4. **Monitor API usage** regularly

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **ElevenLabs Support**: [elevenlabs.io/support](https://elevenlabs.io/support)
- **GitHub Issues**: [github.com/Unsaid-afk/voice-controlled-todo-list/issues](https://github.com/Unsaid-afk/voice-controlled-todo-list/issues)

---

**Your app will be live at**: `https://your-project-name.vercel.app`
