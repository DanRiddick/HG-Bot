const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');

class DiceRollCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cc',
            group: 'clash_caller',
            memberName: 'cc',
            description: 'Gets the ClashCaller link.',
        });
    }

    async run(message, args) {
        if(message.channel.name != 'dibs') return;
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        message.reply(`http://clashcaller.com/war/${warcode}`);
    }
}

module.exports = DiceRollCommand;
