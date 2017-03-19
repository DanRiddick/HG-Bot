const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class GetCallsForCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'getcallsfor',
            group: 'clash_caller',
            memberName: 'getcalls for',
            description: 'Get calls for player'
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        
        var playerCalls = [];
        var botResponse = '\n', options, body, botReq;
        var xhr = new XMLHttpRequest();
        var maxY = 0;

        xhr.open( "POST", "http://clashcaller.com/api.php", true );
        xhr.setRequestHeader( "Content-type", 'application/x-www-form-urlencoded' );
        xhr.send( "REQUEST=GET_FULL_UPDATE&warcode=" + warcode );
        xhr.onreadystatechange = function ( returnval ) {
            if ( xhr.readyState == xhr.DONE && xhr.status == 200 ) {
                var calls = JSON.parse( xhr.responseText ).calls;
                for (let index in calls) {
                    if (calls[index].playername === args) {
                        playerCalls.push(parseInt(calls[index].posy) + 1);
                    }
                }

                if (playerCalls.length == 0) {
                    message.channel.sendMessage(MESSAGES.NO_CALLS);
                } else {
                    botResponse += '** Calls for ' + args + ':**';
                    for (let cIndex in playerCalls) {
                        botResponse += '\n#' + playerCalls[cIndex];
                    }
                    message.channel.sendMessage(botResponse);
                }
                
            }
        }
    }
}

module.exports = GetCallsForCommand;
