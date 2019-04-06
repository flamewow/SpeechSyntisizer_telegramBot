const say = require('say')
const ffmpeg = require('fluent-ffmpeg')
const LanguageDetect = require('languagedetect')

const handleText = async (bot, message) => {
  const chatId = message.chat.id
  const messageText = message.text

  const lngDetector = new LanguageDetect()
  const mostProbableLanguage = lngDetector.detect(messageText)[0][0]

  let voice
  switch (mostProbableLanguage) {
    case 'english':
      voice = 'Alex'
      break
    case 'russian':
    default:
      voice = 'Milena'
  }

  say.export(messageText, voice, 1, 'output.wav',
    (err) => {
      if (err) {
        bot.sendMessage(chatId, `speech synthesiser error`)
      }
      ffmpeg('./output.wav')
        .toFormat('mp3')
        .on('error', (err) => {
          console.error(err) // debug info
          bot.sendMessage(chatId, `speech synthesiser error`)
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.targetSize + ' KB converted') // debug info
        })
        .save('./output.mp3')
        .on('end', () => {
          bot.sendAudio(chatId, `./output.mp3`)
        })
    })
}

module.exports = {
  handleText
}
