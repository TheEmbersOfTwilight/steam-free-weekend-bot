# Steam Free Weekend Bot

A Node.js bot that watches Steam for free weekend promos and sends alerts with links to a Steam group chat or Discord webhook.

## Features
- Checks Steam for free weekend and featured offer data
- Stores discovered games in SQLite
- Sends alerts to Steam group chat or Discord
- Runs on Windows and Linux/macOS
- Simple setup process using `.env`
- GitHub Pages documentation site in `/docs`

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file:
   ```bash
   copy .env.example .env
   ```
   or on Linux/macOS:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` with your configuration.
4. Start the bot:
   ```bash
   npm start
   ```

## Setup wizard

```bash
npm run setup
```

## Project structure

```text
steam-free-weekend-bot/
├── src/
│   ├── bot/
│   ├── db/
│   ├── notifiers/
│   ├── scrapers/
│   └── utils/
├── scripts/
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

## GitHub Pages

This repository includes a static documentation page at `docs/index.html`.

To enable GitHub Pages in GitHub:
1. Open the repository settings
2. Go to Pages
3. Set Source to `Deploy from a branch`
4. Choose `main` and `/docs`

## Notes

This project is intended as a starter implementation. For a production Steam group chat integration, you may need to add a real Steam client library and valid account credentials because Steam messaging APIs require authenticated Steam account access.

## License
MIT
