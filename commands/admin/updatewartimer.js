const commando = require( 'discord.js-commando' );
var XMLHttpRequest = require( 'xhr2' );
var MESSAGES = require( '../../constants/messages.js' );
var CONFIG = require('../../config.js');
var WAR_INFO = require( '../../war_info.js' );
const clashApi = require('clash-of-clans-api');

class UpdateWarTimerCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'updatewartimer',
            group: 'admin',
            memberName: 'updatewartimer',
            description: 'Change war timer (##h##m)',
            examples: ['!updatewartimer [end|start] [##h##m]']
        });
    }

    async run( message, args ) {
        if(message.channel.name != 'dibs') return;

        var options = args.split(' ');

        if (options.length != 2) {
            message.channel.sendMessage(MESSAGES.INVALID_COMMAND);
            return;
        }

        // Timer should be in the format ##h##m
        if (options[1].length != 6) {
            message.channel.sendMessage(MESSAGES.INVALID_COMMAND);
            return;
        }

        var start = options[0].substring(0, 1);
        var minutes = timerToSeconds(options[1]);

        var xhr = new XMLHttpRequest();
        xhr.open( "POST", "http://clashcaller.com/api.php", true );
        xhr.setRequestHeader( "Content-type", 'application/x-www-form-urlencoded' );
        xhr.send( "REQUEST=UPDATE_WAR_TIME&warcode=" + WAR_INFO.CURRENT_WAR_CODE + '&start=' + start + '&minutes=' + minutes);
        xhr.onreadystatechange = function ( returnval ) {
            if ( xhr.readyState == xhr.DONE && xhr.status == 200 ) {
                message.channel.sendMessage(`War time update to ${options[1]}`);
            }
        }

        function timerToSeconds(timer) {
            var hours = timer.substring(0, 2);
            var minutes = timer.substring(3, 5);
            if (isInteger(hours) && isInteger(minutes)) {
                return (parseInt(hours) * 60) + parseInt(minutes);
            } else {
                return 0;
            }
        }

        function isInteger(value) {
            return !isNaN(parseInt(value));
        }
    }
}

module.exports = UpdateWarTimerCommand;