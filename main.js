import { Bot, IncomingChatPreference } from "@skyware/bot";
import dotenv from 'dotenv';

/**
 * rolls a dice and returns the result
 * 
 * @param {number} sides: The number of sides on the dice 
 */
const rollDice = (sides = 6) => {
  return Math.floor(Math.random() * sides) + 1;
}

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

    let responseText;

    if (message.text.toLowerCase().includes('roll')) {
      const sides = parseInt(message.text.split(' ')[1]) || 6;
      const result = rollDice(sides);
      responseText = `You rolled a ${result}!`
    } else {
      responseText = `I'm sorry, I don't understand what you mean. You can ask me to roll a dice by saying "roll" followed by the number of sides.`
    }

    const conversation = await message.getConversation();
    if (conversation) {
      // conversations may not always work
      await conversation.sendMessage({ text: responseText });
    }
  })
}

await startup();
