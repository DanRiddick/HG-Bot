const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class GetMyCallsCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'getmycalls',
            group: 'clash_caller',
            memberName: 'getmycalls',
            description: 'Get your calls'
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        var myCalls = [];
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
                    if (calls[index].playername === message.author.username) {
                        myCalls.push(parseInt(calls[index].posy) + 1);
                    }
                }

                if (myCalls.length == 0) {
                    message.channel.sendMessage(MESSAGES.NO_CALLS);
                } else {
                    botResponse += '** Calls for ' + message.author.username + ':**';
                    for (let cIndex in myCalls) {
                        botResponse += '\n#' + myCalls[cIndex];
                    }
                    message.channel.sendMessage(botResponse);
                }
                
            }
        }
    }
}

module.exports = GetMyCallsCommand;
