const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var WAR_INFO = require( '../../war_info.js' );
var XMLHttpRequest = require( 'xhr2' );

class SetClashCallerCodeCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'setcc',
            group: 'admin',
            memberName: 'setcc',
            description: 'Set code',
            guildOnly: 'dibs'
        });
    }
    async run( message, args ) {
        WAR_INFO.CURRENT_WAR_CODE = args;
        message.channel.sendMessage('CC code changed to ' + args);
    }
}

module.exports = SetClashCallerCodeCommand;
