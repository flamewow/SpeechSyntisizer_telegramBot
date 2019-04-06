const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const handlers = require('./handlers')
const bot = new TelegramBot(config.telegramBotToken, { polling: true })

bot.on('error', (error) => {
  console.error(error)
})

bot.on('message', async (message) => {
  const messageText = message.text

  if (messageText === '/help') {
    return bot.sendMessage(message.chat.id, `Hi, human!\n Send me some text.`)
  } else {
    return handlers.handleText(bot, message)
  }
})
