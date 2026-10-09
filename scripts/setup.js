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
  console.log('\n🤖 Steam Free Weekend Bot - Setup\n');
  console.log('This wizard will configure the bot for Steam group chat notifications.\n');

  const username = await ask('Steam bot account username: ');
  const password = await ask('Steam bot account password: ');
  const groupId = await ask('Target Steam group ID: ');
  const shared = await ask('Steam Shared Secret (for 2FA, leave blank if not needed): ');
  const identity = await ask('Steam Identity Secret (for 2FA, leave blank if not needed): ');
  const interval = await ask('Check interval in minutes (default 60): ');

  const envEntries = [
    `STEAM_BOT_USERNAME=${username}`,
    `STEAM_BOT_PASSWORD=${password}`,
    `TARGET_STEAM_GROUP_ID=${groupId}`,
    `STEAM_SHARED_SECRET=${shared || ''}`,
    `STEAM_IDENTITY_SECRET=${identity || ''}`,
    `CHECK_INTERVAL_MINUTES=${interval || 60}`,
    `DATABASE_PATH=./data/games.db`
  ];

  const envPath = path.resolve(process.cwd(), '.env');
  fs.writeFileSync(envPath, `${envEntries.join('\n')}\n`, 'utf8');

  console.log(`\n✅ Configuration saved to ${envPath}`);
  console.log('\n📝 Next steps:');
  console.log('1. npm install');
  console.log('2. npm start\n');
  rl.close();
}

main().catch((error) => {
  console.error('Setup failed', error);
  rl.close();
  process.exit(1);
});
