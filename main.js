import { Bot } from "@skyware/bot";
import dotenv from 'dotenv';

const startup = async () => {
  dotenv.config();
  const bot = new Bot();
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  console.log('starting up...')

  if (!username || !password) {
    console.error("Please provide a username and password via environment variables.");
    Deno.exit(1);
  }

  console.log(`logging in as ${username}...`)

  await bot.login({
    identifier: username,
    password
  })

  console.log('logged in!')

  bot.on("reply", async (reply) => {
    await reply.like();
    await reply.reply({ text: "Thanks for saying hi 👋🏻" });
  })
}

await startup();
