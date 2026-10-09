import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function main() {
  console.log('Steam Free Weekend Bot setup\n');

  const useDiscord = await ask('Enable Discord notifications? (y/N): ');
  const useSteam = await ask('Enable Steam group notifications? (y/N): ');
  const interval = await ask('Check interval in minutes (default 60): ');

  const envEntries = [
    `CHECK_INTERVAL_MINUTES=${interval || 60}`,
    'DATABASE_PATH=./data/games.db'
  ];

  if (useDiscord.toLowerCase() === 'y') {
    const webhook = await ask('Discord webhook URL: ');
    envEntries.push(`DISCORD_WEBHOOK_URL=${webhook}`);
  }

  if (useSteam.toLowerCase() === 'y') {
    const name = await ask('Steam bot account username: ');
    const password = await ask('Steam bot password: ');
    const groupId = await ask('Steam group ID: ');
    envEntries.push(`STEAM_BOT_ACCOUNT_NAME=${name}`);
    envEntries.push(`STEAM_BOT_PASSWORD=${password}`);
    envEntries.push(`TARGET_STEAM_GROUP_ID=${groupId}`);
  }

  const envPath = path.resolve(process.cwd(), '.env');
  fs.writeFileSync(envPath, `${envEntries.join('\n')}\n`, 'utf8');

  console.log(`\nConfiguration saved to ${envPath}`);
  console.log('You can now run: npm start');
  rl.close();
}

main().catch((error) => {
  console.error('Setup failed', error);
  rl.close();
  process.exit(1);
});
