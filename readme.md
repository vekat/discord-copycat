# copycat

a discord bot that says out loud whatever one types

## instructions

1. create a bot in discord applications and invite it to your server
2. copy the `config.js.example` file as `config.js` and replace the token value with your bot's token
3. run the command `npm i` inside the bot's folder to install dependencies
4. start the bot with the command `node index.js` and have fun

## bot commands

- `+join @username`: copycat joins whatever voice channel you're in and starts copying the given user's messages in the same text channel you used this command
- `+stop`: copycat disconnects from the voice chat and stops copying the user

make sure copycat has permissions to connect to your voice channel and read messages in the text channel you wanna watch
