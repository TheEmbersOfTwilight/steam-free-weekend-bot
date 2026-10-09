# 🎮 Steam Free Weekend Bot

A Node.js bot that monitors Steam for free weekend games and automatically sends alerts to your Steam group chat.

## Features

✨ **Automatic Monitoring** - Continuously checks Steam for new free weekend games
📢 **Steam Group Alerts** - Sends notifications directly to your Steam group chat
💾 **Database Tracking** - Keeps track of notified games to avoid duplicates
🔄 **Cross-Platform** - Works on Windows, Linux, and macOS
⚡ **Easy Setup** - Interactive setup wizard for quick configuration
🚀 **Lightweight** - Minimal resource usage, can run 24/7 on any system

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Steam Account** - A bot account with permissions to post in your Steam group
- **Steam Bot Credentials** - Username, password, and optionally 2FA secrets

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot.git
cd steam-free-weekend-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Setup Wizard

```bash
npm run setup
```

The setup wizard will guide you through:
- Entering your Steam bot account credentials
- Specifying your target Steam group ID
- Setting the check frequency
- Configuring 2FA if needed

### 4. Start the Bot

```bash
npm start
```

## Configuration

### Environment Variables

The bot uses a `.env` file for configuration. You can create one manually or use the setup wizard.

```env
# Required: Steam Bot Account Credentials
STEAM_BOT_USERNAME=your_bot_username
STEAM_BOT_PASSWORD=your_bot_password
TARGET_STEAM_GROUP_ID=your_group_id

# Optional: Steam 2FA (Two-Factor Authentication)
STEAM_SHARED_SECRET=your_shared_secret
STEAM_IDENTITY_SECRET=your_identity_secret

# Bot Settings
CHECK_INTERVAL_MINUTES=60
DATABASE_PATH=./data/games.db
```

### Getting Your Steam Group ID

1. Open your Steam group in a web browser
2. Look at the URL: `https://steamcommunity.com/gid/[GROUP_ID]/`
3. Copy the number in place of `[GROUP_ID]`

## How It Works

1. **Scraping** - The bot periodically scrapes Steam's store pages for free weekend games
2. **Storage** - Found games are stored in a local SQLite database
3. **Detection** - The bot identifies which games are new and haven't been announced yet
4. **Notification** - New free weekend games are posted to your Steam group chat
5. **Tracking** - Games are marked as notified to prevent duplicate alerts

## Usage

### Start the Bot (Production)
```bash
npm start
```

### Development Mode (Auto-reload on file changes)
```bash
npm run dev
```

### Interactive Setup
```bash
npm run setup
```

## Steam Bot Account Setup

### Creating a Steam Bot Account

1. Create a new Steam account dedicated to this bot
2. Add it to your Steam group with posting permissions
3. Get the account username and password

### Setting Up 2FA (Two-Factor Authentication)

If your Steam account has 2FA enabled:

1. Generate authentication codes using the Steam mobile app or a TOTP application
2. Look for your "Shared Secret" and "Identity Secret" in your authenticator backup codes
3. Add these to your `.env` file during setup

> ⚠️ **Important**: The bot will attempt to automatically generate 2FA codes from your shared secret. Store these securely and never share them.

## Database

The bot uses SQLite for tracking:
- **games** - List of discovered free weekend games
- **notifications** - History of sent notifications

Database file location: `./data/games.db` (configurable via `DATABASE_PATH`)

## Troubleshooting

### Bot won't start
- Check Node.js is installed: `node --version`
- Verify all dependencies: `npm install`
- Check `.env` file exists: `cp .env.example .env`

### Steam login fails
- Verify your username and password are correct
- If using 2FA, ensure your Shared Secret is valid
- Check that your account isn't trade or community banned
- Verify your group ID is correct

### No notifications being sent
- Confirm the bot account is a member of the target group
- Verify the bot account has posting permissions in the group
- Check logs for error messages
- Increase `CHECK_INTERVAL_MINUTES` if scraping is timing out

### High CPU/Memory usage
- Increase `CHECK_INTERVAL_MINUTES` to reduce check frequency
- Check for errors in logs that might cause infinite loops

### Steam login timeout
- Increase timeout value in `steamNotifier.js` if you have slow internet
- Ensure your firewall isn't blocking Steam connections

## Development

### Project Structure

```
steam-free-weekend-bot/
├── src/
│   ├── index.js              # Entry point
│   ├── bot/
│   │   └── botManager.js     # Scheduling logic
│   ├── db/
│   │   └── database.js       # Database operations
│   ├── notifiers/
│   │   ├── notificationManager.js
│   │   └── steamNotifier.js  # Steam API integration
│   ├── scrapers/
│   │   └── steamScraper.js   # Steam page scraping
│   └── utils/
│       └── logger.js         # Logging utility
├── scripts/
│   └── setup.js              # Setup wizard
├── docs/
│   └── index.html            # GitHub Pages documentation
├── data/                     # Database storage (git-ignored)
├── package.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

### Dependencies

- **axios** - HTTP requests for Steam store scraping
- **cheerio** - HTML parsing for game detection
- **dotenv** - Environment variable management
- **sqlite3** - Local database for tracking games
- **steam-user** - Steam client library for authentication
- **steam-community** - Steam community API for group posting

### Running in Development

```bash
npm run dev
```

This will auto-reload the bot when you make code changes.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest features
- Submit pull requests

For details, see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

For issues and questions:
- 📋 [GitHub Issues](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/issues)
- 💬 [GitHub Discussions](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/discussions)

## Disclaimer

This bot is not affiliated with Valve Corporation or Steam. Use at your own risk and ensure you comply with Steam's Terms of Service. The developers are not responsible for account bans or other consequences from Steam.

---

Made with ❤️ by [TheEmbersOfTwilight](https://github.com/TheEmbersOfTwilight)
