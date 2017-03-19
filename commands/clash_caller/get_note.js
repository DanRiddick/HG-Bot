const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class GetNoteCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'getnote',
            group: 'clash_caller',
            memberName: 'getnote',
            description: 'Get note on target'
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        if ( args.length < 1 ) {
            message.channel.sendMessage( MESSAGES.INVALID_COMMAND );
        } else {
            args = args.split(' ');
            if ( !args[0].match( REG_EXP.INTEGER ) ) {
                message.channel.sendMessage( MESSAGES.INVALID_COMMAND );
            } else {
                var botResponse = '\n', options, body, botReq;
                var xhr = new XMLHttpRequest();
                var maxY = 0;

                xhr.open( "POST", "http://clashcaller.com/api.php", true );
                xhr.setRequestHeader( "Content-type", 'application/x-www-form-urlencoded' );
                xhr.send( "REQUEST=GET_FULL_UPDATE&warcode=" + warcode );
                xhr.onreadystatechange = function ( returnval ) {
                    if ( xhr.readyState == xhr.DONE && xhr.status == 200 ) {
                        var response = JSON.parse( xhr.responseText );
                        var targets = response.targets;
                        var index = parseInt( args[0] ) - 1;
                        if ( index > 0 && index < response.general.size.length ) {
                            if ( targets[index].note != null ) {
                                message.channel.sendMessage( '**Note for target #' + ( index + 1 ) + ':**\n' + targets[index].note);
                            } else {
                                message.channel.sendMessage( 'No note for target #' + ( index + 1 ) );
                            }

                        } else {
                            message.channel.sendMessage( MESSAGES.INVALID_INDEX );
                        }
                        
                    }
                }
            }
        }
    }
}

module.exports = GetNoteCommand;
