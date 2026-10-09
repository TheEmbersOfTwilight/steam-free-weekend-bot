# 🎮 Steam Free Weekend Bot

A Node.js bot that monitors Steam for real free weekend listings and automatically posts alerts to your Steam group chat.

## Features

✨ **Accurate Free Weekend Detection** - Filters out generic Steam specials and only detects actual weekend titles
📢 **Steam Group Chat Alerts** - Posts notifications directly to your Steam group with direct store links
💾 **Smart Tracking** - Uses SQLite database to avoid duplicate notifications
🔄 **Cross-Platform** - Works on Windows, Linux, and macOS
⚡ **Easy Setup** - Interactive setup wizard and simple `.env` configuration
🚀 **Lightweight** - Minimal resource usage, runs 24/7 reliably

## Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Steam Bot Account** - A dedicated Steam account for the bot
- **Group Admin Access** - Bot account needs posting permissions in your Steam group
- **Steam Group ID** - The numeric ID of your target group

## Quick Start

```bash
git clone https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot.git
cd steam-free-weekend-bot
npm install
npm run setup
npm start
```

## Configuration

### Environment Variables

The bot uses a `.env` file for configuration. Run the setup wizard to create one:

```bash
npm run setup
```

Or create it manually based on `.env.example`:

```env
# Required: Steam Bot Credentials
STEAM_BOT_USERNAME=your_bot_username
STEAM_BOT_PASSWORD=your_bot_password
TARGET_STEAM_GROUP_ID=your_group_id

# Optional: 2FA
STEAM_SHARED_SECRET=your_shared_secret
STEAM_IDENTITY_SECRET=your_identity_secret

# Bot Settings
CHECK_INTERVAL_MINUTES=60
DATABASE_PATH=./data/games.db
```

### Getting Your Steam Group ID

1. Open your Steam group in a browser
2. Look at the URL: `https://steamcommunity.com/gid/[GROUP_ID]/`
3. Copy the numeric `GROUP_ID`

## How It Works

1. **Scrapes** Steam's specials page every X minutes (configurable)
2. **Filters** for actual free weekend listings using pattern matching
3. **Stores** discovered games in a local SQLite database
4. **Detects** new games that haven't been announced yet
5. **Posts** free weekend alerts to your Steam group chat
6. **Tracks** notified games to prevent duplicates

## Usage

### Start the Bot (Production)
```bash
npm start
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Interactive Setup
```bash
npm run setup
```

## Project Structure

```
steam-free-weekend-bot/
├── src/
│   ├── index.js                 # Entry point
│   ├── bot/
│   │   └── botManager.js        # Scheduling logic
│   ├── db/
│   │   └── database.js          # SQLite operations
│   ├── notifiers/
│   │   ├── notificationManager.js
│   │   └── steamNotifier.js     # Steam API integration
│   ├── scrapers/
│   │   └── steamScraper.js      # Free weekend detection
│   └── utils/
│       └── logger.js            # Logging
├── scripts/
│   └── setup.js                 # Setup wizard
├── docs/
│   └── index.html               # GitHub Pages site
├── data/
│   └── games.db                 # SQLite database
├── package.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Dependencies

- **axios** - HTTP requests for scraping
- **cheerio** - HTML parsing
- **dotenv** - Environment variable management
- **sqlite3** - Local database
- **steam-user** - Steam client authentication
- **steam-community** - Steam API for group posting

## Troubleshooting

### Bot won't start
- Verify Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check `.env` file exists: `npm run setup`

### Steam login fails
- Verify username and password are correct
- If using 2FA, ensure your Shared Secret is valid
- Check account is not community or trade banned
- Verify the target group ID is correct

### No notifications being sent
- Confirm bot account is in the target group
- Verify bot has posting permissions
- Check that the free weekend item matches our pattern detection
- Look at console logs for error messages

### High CPU/Memory usage
- Increase `CHECK_INTERVAL_MINUTES` (run less frequently)
- Check for infinite loops in error logs

## Development

### Running in Dev Mode
```bash
npm run dev
```

This will auto-reload when you make code changes.

### Key Files to Modify

- **`src/scrapers/steamScraper.js`** - Free weekend detection patterns
- **`src/notifiers/steamNotifier.js`** - Steam API integration
- **`scripts/setup.js`** - Configuration wizard

## Contributing

Contributions are welcome! Please:
- Report bugs via [GitHub Issues](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/issues)
- Suggest features in [Discussions](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/discussions)
- Submit PRs for improvements

## License

MIT License - See [LICENSE](LICENSE) file

## Disclaimer

This bot is not affiliated with Valve Corporation or Steam. Use at your own risk and comply with Steam's Terms of Service. The developers are not responsible for account restrictions or bans from Steam.

---

Made with ❤️ by [TheEmbersOfTwilight](https://github.com/TheEmbersOfTwilight)
