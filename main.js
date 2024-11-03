import { Bot, IncomingChatPreference } from "@skyware/bot";
import dotenv from 'dotenv';

const startup = async () => {
  dotenv.config();
  const bot = new Bot({ emitChatEvents: true });
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  console.log('starting up...')

  if (!username || !password) {
    console.error("Please provide a username and password via environment variables.");
    process.exit(1);
  }

  console.log(`logging in as ${username}...`)

  await bot.login({
    identifier: username,
    password
  })
  await bot.setChatPreference(IncomingChatPreference.Following);


  console.log('logged in!')

  // just like responses; we only work over dm for now.
  bot.on("reply", async (reply) => {
    await reply.like();
  })

  // log incoming messages to the console and respond to the message
  bot.on('message', async (message) => {
    const sender = await message.getSender();
    console.log(`Received message from ${sender.handle}: ${message.text}`);

    const conversation = await message.getConversation();
    if (conversation) {
      // conversations may not always work
      await conversation.sendMessage({ text: `Hey ${sender.displayName}! I can't do anything yet. But I'm learning!` });
    }
  })
}

await startup();
