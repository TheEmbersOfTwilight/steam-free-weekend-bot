<div align="center" style="background: #111111; color: #F5F5F5; padding: 32px; border: 1px solid #3D3D3D; border-radius: 16px;">

# 🎮 Steam Free Weekend Bot

<img src="https://img.shields.io/badge/Node.js-v18+-E95420?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js">
<img src="https://img.shields.io/badge/License-MIT-77216F?style=for-the-badge" alt="MIT License">
<img src="https://img.shields.io/badge/Platform-Cross--Platform-5E2750?style=for-the-badge" alt="Cross-Platform">

<strong>A Node.js bot that monitors Steam for real free weekend listings and automatically posts alerts to your Steam group chat.</strong>

[🚀 Quick Start](#-quick-start) • [📖 Configuration](#-configuration) • [🤝 Contributing](#-contributing) • [⚖️ License](#-license)

</div>

---

<div style="background: #1B1B1B; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## ✨ Features

<table>
  <tr>
    <td valign="top" width="50%" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>🎯 Accurate Detection</strong><br>
      Filters out generic Steam specials and detects only real free weekend titles.
    </td>
    <td width="20"></td>
    <td valign="top" width="50%" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>📢 Instant Alerts</strong><br>
      Posts direct notifications to your Steam group with store links and game details.
    </td>
  </tr>
  <tr><td height="12"></td></tr>
  <tr>
    <td valign="top" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>💾 Smart Tracking</strong><br>
      Uses SQLite to keep history and avoid duplicate notifications.
    </td>
    <td width="20"></td>
    <td valign="top" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>🔄 Cross-Platform</strong><br>
      Works seamlessly on Windows, Linux, and macOS.
    </td>
  </tr>
  <tr><td height="12"></td></tr>
  <tr>
    <td valign="top" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>⚡ Easy Setup</strong><br>
      Guided setup wizard and simple environment configuration.
    </td>
    <td width="20"></td>
    <td valign="top" bgcolor="#1D1D1D" style="padding: 16px; border: 1px solid #3A3A3A; border-radius: 10px;">
      <strong>🚀 Lightweight</strong><br>
      Minimal resource usage and reliable 24/7 operation.
    </td>
  </tr>
</table>

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 📋 Prerequisites

| Requirement | Details |
|-------------|---------|
| **Node.js** | v18 or higher ([Download](https://nodejs.org/)) |
| **npm** | Included with Node.js |
| **Steam Bot Account** | A dedicated Steam account for the bot |
| **Group Admin Access** | Required to post in the target group |
| **Steam Group ID** | Numeric ID of the community group |

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 🚀 Quick Start

```bash
git clone https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot.git
cd steam-free-weekend-bot
npm install
npm run setup
npm start
```

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## ⚙️ Configuration

### Environment Variables

Run the setup wizard:

```bash
npm run setup
```

Or create a `.env` file manually:

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

1. Open your Steam group in a browser.
2. Check the URL: `https://steamcommunity.com/gid/[GROUP_ID]/`
3. Copy the numeric `GROUP_ID` and add it to your `.env` file.

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 🔧 How It Works

```text
1. Scrape Steam's specials page on a configurable interval
2. Filter for genuine free weekend promotions
3. Store discovered titles in SQLite
4. Detect new games that have not been announced yet
5. Post alerts to the Steam group chat
6. Track prior notifications to avoid duplicates
```

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 📦 Usage

### Production

```bash
npm start
```

### Development

```bash
npm run dev
```

### Setup Wizard

```bash
npm run setup
```

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 📂 Project Structure

```text
steam-free-weekend-bot/
├── src/
│   ├── index.js                   # App entry point
│   ├── bot/
│   │   └── botManager.js          # Scheduling logic
│   ├── db/
│   │   └── database.js            # SQLite operations
│   ├── notifiers/
│   │   ├── notificationManager.js # Notification flow
│   │   └── steamNotifier.js      # Steam API integration
│   ├── scrapers/
│   │   └── steamScraper.js       # Free weekend detection
│   └── utils/
│       └── logger.js             # Logging utilities
├── scripts/
│   └── setup.js                  # Setup wizard
├── docs/
│   └── index.html                # GitHub Pages site
├── data/
│   └── games.db                  # SQLite database
├── package.json
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── .github/
```

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 📚 Dependencies

- **axios** – HTTP requests for scraping
- **cheerio** – HTML parsing and DOM traversal
- **dotenv** – Environment variable management
- **sqlite3** – Local database support
- **steam-user** – Steam authentication
- **steam-community** – Steam group posting API

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 🐛 Troubleshooting

### Bot won't start

```bash
node --version
npm install
npm run setup
```

### Steam login fails

- Verify username and password are correct.
- Ensure your Shared Secret is valid for 2FA.
- Check whether the account is community or trade banned.
- Confirm the target group ID is correct.

### No notifications are sent

- Make sure the bot account is in the target group.
- Check posting permissions.
- Review detection patterns for free weekend titles.
- Inspect console logs for error output.

### High CPU or memory use

- Increase `CHECK_INTERVAL_MINUTES` in `.env`.
- Look for infinite loops or repeated failure states.
- Monitor the SQLite database size over time.

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 💻 Development

### Running in dev mode

```bash
npm run dev
```

### Key files to modify

- `src/scrapers/steamScraper.js` – detection logic
- `src/notifiers/steamNotifier.js` – Steam API integration
- `scripts/setup.js` – setup flow

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## 🤝 Contributing

Contributions are welcome! Please:

- Report bugs via [GitHub Issues](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/issues)
- Suggest features in [Discussions](https://github.com/TheEmbersOfTwilight/steam-free-weekend-bot/discussions)
- Submit pull requests for enhancements and fixes

</div>

---

<div style="background: #181818; color: #F5F5F5; padding: 24px; border: 1px solid #404040; border-radius: 12px;">

## ⚖️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

</div>

---

<div style="background: #111111; color: #F5F5F5; padding: 24px; border: 1px solid #3D3D3D; border-radius: 12px; text-align: center;">

### Made with ❤️ by [TheEmbersOfTwilight](https://github.com/TheEmbersOfTwilight)

</div>
