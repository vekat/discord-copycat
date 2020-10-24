const fs = require('fs')

const Discord = require('discord.js')
const tts = require('google-tts-api')
const spawn = require('child_process').spawn

const config = require('./config')

const client = new Discord.Client()

const state = {
  memberId: 0,
  channelId: 0,
}

client.on('ready', async () => {
  console.log('logged in as', client.user.tag)
})

client.on('message', async (message) => {
  if (!message.guild) return

  const args = message.content.split(/\s+/)

  switch (args.shift()) {
    case '+join': return await handleJoin(args, message)
    case '+stop': return await handleStop(args, message)
    default: return await handleMessage(args, message)
  }
})

async function handleJoin(args, message) {
  const match = /\d+/.exec(args[0])
  const memberId = match ? match[0] : null

  if (!memberId)
    return message.reply('invalid user')

  state.memberId = memberId
  state.channelId = message.channel.id

  return message.reply('copy')
}

async function handleStop(args, message) {
  if (state.memberId) {
    state.memberId = state.channelId = 0
  }

  return message.reply('done')
}

async function handleMessage(args, message) {
  if (message.author.id == state.memberId && message.channel.id == state.channelId) {
    const content = message.content.replace(/<\w*:(\w+):\d+>/g, '$1').replace(/(?:[\w]{2,8}:\/\/)?([-\w@.]{2,256}\.[\w]{2,4})\b(\/[-\w@:%_\+.~#?&/=]*)?/g, '$1$2')
    
    let url
    let success = false
    while (!success) {
      try {
        url = await tts(content, config.lang, config.speed)
        success = true
      } catch (_) {
        success = false
      }
    }

    const child = spawn(config.vlcPath, config.vlcArgs, { stdio: ['pipe', process.stdout, process.stderr] })
    fetch(url)
      .then((res) => res.body)
      .then((stream) => stream.pipe(child.stdin))
      .catch((err) => console.error(err))
  }
}

client.login(config.token)
