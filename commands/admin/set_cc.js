const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class SetClashCallerCodeCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'setcc',
            group: 'admin',
            memberName: 'setcc',
            description: 'Set code'
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        let leadershipRole = message.guild.roles.find('name', 'Leadership');
        if (message.member.roles.has(leadershipRole.id)) {
            var configHelper = new ConfigHelper();
            configHelper.setConfigValueByKey('CURRENT_WAR_CODE', args);
            message.channel.sendMessage('CC code changed to ' + args);
        } else {
            message.channel.sendMessage("You do not have permission to use the `setcc` command.");
        }
    }
}

module.exports = SetClashCallerCodeCommand;
