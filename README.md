<div align="center">

# 🎮 Steam Free Weekend Bot

<img src="https://img.shields.io/badge/Node.js-v18+-DD4814?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js">
<img src="https://img.shields.io/badge/License-MIT-E95420?style=for-the-badge" alt="MIT License">
<img src="https://img.shields.io/badge/Platform-Cross--Platform-77216F?style=for-the-badge" alt="Cross-Platform">

**A powerful Node.js bot that monitors Steam for free weekend listings and automatically posts alerts to your Steam group chat.**

[🚀 Quick Start](#quick-start) • [📖 Documentation](#configuration) • [🤝 Contributing](#contributing) • [⚖️ License](#license)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Accurate Detection** | Filters out generic Steam specials and detects only actual free weekend titles |
| 📢 **Instant Alerts** | Posts notifications directly to your Steam group with direct store links |
| 💾 **Smart Tracking** | Uses SQLite database to avoid duplicate notifications |
| 🔄 **Cross-Platform** | Works seamlessly on Windows, Linux, and macOS |
| ⚡ **Easy Setup** | Interactive setup wizard and simple `.env` configuration |
| 🚀 **Lightweight** | Minimal resource usage, runs 24/7 reliably |

---

## 📋 Prerequisites

Before getting started, ensure you have:

| Requirement | Details |
|-------------|---------|
| **Node.js** | v18 or higher ([Download](https://nodejs.org/)) |
| **npm** | Comes with Node.js |
| **Steam Account** | A dedicated Steam account for the bot |
| **Group Admin Access** | Bot account needs posting permissions in your Steam group |
| **Steam Group ID** | The numeric ID of your target group |

---

## 🚀 Quick Start

Get up and running in just a few commands:

```bash
# Clone the repository
git clone https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot.git
cd steam-free-weekend-bot

# Install dependencies
npm install

# Run the interactive setup wizard
npm run setup

# Start the bot
npm start
```

---

## ⚙️ Configuration

### Environment Variables

The bot uses a `.env` file for configuration. The easiest way to set this up is by running our interactive setup wizard:

```bash
npm run setup
```

Or manually create a `.env` file based on `.env.example`:

```env
# Required: Steam Bot Credentials
STEAM_BOT_USERNAME=your_bot_username
STEAM_BOT_PASSWORD=your_bot_password
TARGET_STEAM_GROUP_ID=your_group_id

# Optional: Two-Factor Authentication
STEAM_SHARED_SECRET=your_shared_secret
STEAM_IDENTITY_SECRET=your_identity_secret

# Bot Settings
CHECK_INTERVAL_MINUTES=60
DATABASE_PATH=./data/games.db
```

### Getting Your Steam Group ID

1. Open your Steam group in a browser
2. Look at the URL: `https://steamcommunity.com/gid/[GROUP_ID]/`
3. Copy the numeric `GROUP_ID` and paste it into your `.env` file

---

## 🔧 How It Works

The bot operates on a simple, effective cycle:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SCRAPE: Fetches Steam specials page every X minutes      │
│ 2. FILTER: Identifies actual free weekend listings          │
│ 3. STORE: Saves discovered games to SQLite database         │
│ 4. DETECT: Finds new games that haven't been announced      │
│ 5. POST: Sends alerts to your Steam group chat              │
│ 6. TRACK: Marks games as notified to prevent duplicates     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Usage

### Start the Bot (Production)

```bash
npm start
```

Runs the bot in production mode with stable performance and minimal logging.

### Development Mode (Auto-reload)

```bash
npm run dev
```

Automatically reloads when you make code changes—perfect for development!

### Interactive Setup

```bash
npm run setup
```

Launches a guided configuration wizard to create your `.env` file.

---

## 📂 Project Structure

```
steam-free-weekend-bot/
│
├── 📁 src/
│   ├── index.js                      # Application entry point
│   ├── 📁 bot/
│   │   └── botManager.js             # Scheduling and bot lifecycle
│   ├── 📁 db/
│   │   └── database.js               # SQLite database operations
│   ├── 📁 notifiers/
│   │   ├── notificationManager.js    # Notification orchestration
│   │   └── steamNotifier.js          # Steam API integration
│   ├── 📁 scrapers/
│   │   └── steamScraper.js           # Free weekend detection logic
│   └── 📁 utils/
│       └── logger.js                 # Logging utilities
│
├── 📁 scripts/
│   └── setup.js                      # Interactive setup wizard
│
├── 📁 docs/
│   └── index.html                    # GitHub Pages documentation
│
├── 📁 data/
│   └── games.db                      # SQLite database (auto-created)
│
├── package.json                      # Project metadata and dependencies
├── .env.example                      # Example configuration file
├── .gitignore                        # Git ignore rules
├── LICENSE                           # MIT License
└── README.md                         # This file
```

---

## 📚 Dependencies

The bot leverages these well-maintained packages:

| Package | Purpose |
|---------|---------|
| **axios** | HTTP requests for web scraping |
| **cheerio** | HTML parsing and DOM manipulation |
| **dotenv** | Environment variable management |
| **sqlite3** | Local database for tracking games |
| **steam-user** | Steam client authentication |
| **steam-community** | Steam community API for group posting |

---

## 🐛 Troubleshooting

### ❌ Bot Won't Start

```bash
# Check Node.js installation
node --version

# Reinstall dependencies
npm install

# Create/verify .env file
npm run setup
```

### ❌ Steam Login Fails

- ✓ Verify username and password are correct
- ✓ If using 2FA, ensure your Shared Secret is valid
- ✓ Check the account is not community or trade banned
- ✓ Verify the target group ID is correct

### ❌ No Notifications Being Sent

- ✓ Confirm bot account is in the target group
- ✓ Verify bot has posting permissions in the group
- ✓ Check that free weekend items match our pattern detection
- ✓ Review console logs for error messages with `npm run dev`

### ❌ High CPU/Memory Usage

- ✓ Increase `CHECK_INTERVAL_MINUTES` in your `.env` (run less frequently)
- ✓ Check error logs for infinite loops or resource leaks
- ✓ Monitor database file size (`data/games.db`)

---

## 💻 Development

### Running in Dev Mode

```bash
npm run dev
```

This mode provides hot-reload capabilities and verbose logging for easier debugging.

### Key Files to Modify

| File | Purpose |
|------|---------|
| `src/scrapers/steamScraper.js` | Modify free weekend detection patterns |
| `src/notifiers/steamNotifier.js` | Customize Steam API integration |
| `scripts/setup.js` | Enhance configuration wizard |

---

## 🤝 Contributing

We love contributions! Here's how you can help:

- 🐛 **Report Bugs** - Use [GitHub Issues](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/issues) to report any problems
- 💡 **Suggest Features** - Share your ideas in [Discussions](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/discussions)
- 🔧 **Submit PRs** - We welcome pull requests for bug fixes and improvements

---

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This bot is **not affiliated with Valve Corporation or Steam**. Use at your own risk and comply with Steam's Terms of Service. The developers are not responsible for account restrictions or bans resulting from bot usage.

---

<div align="center">

### Made with ❤️ by [TheEmbersOfTwilight](https://github.com/TheEmbersOfTwilight)

<img src="https://img.shields.io/badge/Status-Active-00A651?style=flat-square" alt="Active">
<img src="https://img.shields.io/badge/Support-Discord%2FIssues-77216F?style=flat-square" alt="Support">

</div>
