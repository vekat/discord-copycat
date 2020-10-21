const fs = require('fs')

const Discord = require('discord.js')
const tts = require('google-tts-api')

const config = require('./config')

const client = new Discord.Client();

const state = {
  connection: null,
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
    case '+stop': return await handleStop()
    default: return await handleMessage(message)
  }
})

async function handleJoin(args, message) {
  const match = /\d+/.exec(args[0])
  const memberId = match ? match[0] : null

  if (!memberId)
    return message.reply('invalid user')

  if (!message.member.voice.channel)
    return message.reply('join a vc')

  try {
    state.connection = await message.member.voice.channel.join()
    state.memberId = memberId
    state.channelId = message.channel.id
  } catch (err) {
    return message.reply('error, check my permissions')
  }

  return message.reply('copy')
}

async function handleStop() {
  if (state.connection) {
    state.memberId = state.channelId = 0
    await state.connection.disconnect()
    state.connection = null
  }
}

async function handleMessage(message) {
  if (state.connection && message.author.id == state.memberId && message.channel.id == state.channelId) {
    const content = message.cleanContent.replace(/<:(\w+):\d+>/g, '$1')
    const url = await tts(content, config.lang, config.speed)
    state.connection.play(url)
  }
}

client.login(config.token)
