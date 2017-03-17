const commando = require('discord.js-commando');
const bot = new commando.Client();

bot.registry.registerGroup('clash_caller', 'Clash Caller');
bot.registry.registerGroup('admin', 'Admin');
bot.registry.registerGroup('clash_of_clans', 'Clash of Clans');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");
bot._commandPrefix = "/";


bot.login('MjkwOTI4NDYwNjIzMzgwNDgw.C6iYeQ.8Oin_Kv2E5bMwfRubQAlusoAmfo');
// bot.login('MjkxMDUwMzA0OTI4MDg4MDc0.C6j1Rw.oj3Meann4Hlvmj6WblKaxr7Xebc'); // tyejae bot
