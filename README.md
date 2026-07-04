# 🎥 YouTube Verification Bot

A modern Discord bot that automatically verifies YouTube subscription screenshots using the **Groq Vision API** and **Discord Components V2**. Built for speed, accuracy, and a seamless verification experience.

---

## 📖 Project Information

| Information | Value |
|-------------|-------|
| **Project Name** | YouTube Verification Bot |
| **Development Team** | Moon Development (MoonXDevs) |
| **Author** | Zack (zackheey) |
| **Language** | JavaScript (Node.js) |
| **Database** | SQLite |

---

## ✨ Features

- 🤖 Automatic verification from image attachments
- 👁️ AI-powered image analysis using **Groq Vision API**
- 🚫 OCR-free verification system
- 🗄️ SQLite-backed verification history
- 📦 Discord Components V2 interface
- 📋 Staff logging system
- ⏱️ Cooldown protection
- 🛡️ Duplicate screenshot detection
- ⚡ Fast and lightweight architecture
- 📝 Structured logging powered by **pino**

---

## 📂 Project Structure

```text
src/
├── commands/
├── events/
├── handlers/
├── database/
├── utils/
└── index.js
```

---

## 🚀 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/Yt-Verify-Bot.git
cd Yt-Verify-Bot
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

```bash
cp .env.example .env
```

Edit the `.env` file and add your credentials.

### 4️⃣ Start the bot

```bash
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file using the provided template.

Example:

```env
BOT_TOKEN=
GROQ_API_KEY=
VERIFY_CHANNEL_ID=
LOG_CHANNEL_ID=
VERIFIED_ROLE_ID=
STAFF_ROLE_ID=
YOUTUBE_CHANNEL_NAME=
YOUTUBE_CHANNEL_HANDLE=
MIN_CONFIDENCE=90
DELETE_SUCCESS_SCREENSHOT=true
DELETE_FAILED_SCREENSHOT=false
COOLDOWN_MINUTES=5
```

Refer to **.env.example** for the complete list.

---

## 📦 Technologies Used

- Node.js
- Discord.js
- Groq Vision API
- SQLite
- Components V2
- Pino Logger

---

## 📜 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

---

## 📝 Notes

- The bot supports **dry-run mode** when no Discord token is configured.
- A valid **Groq API Key** is required for image verification.
- Designed with a modular architecture for easy maintenance and expansion.

---

<div align="center">

### Built with ❤️ by Moon Development

*Modern • Fast • Reliable*

</div>
