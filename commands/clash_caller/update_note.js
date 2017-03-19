const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class UpdateNoteCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'updatenote',
            group: 'clash_caller',
            memberName: 'updatenote',
            description: 'Get note on target'
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        
        var warcode = new ConfigHelper().getConfigValueByKey('warcode');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        if ( args.length < 1 ) {
            message.channel.sendMessage( MESSAGES.INVALID_COMMAND );
        } else {
            if ( !args[0].match( REG_EXP.INTEGER ) ) {
                message.channel.sendMessage( MESSAGES.INVALID_COMMAND );
            } else {
                var botResponse = '\n', options, body, botReq;
                var xhr = new XMLHttpRequest();
                var maxY = 0;
                var posy = parseInt( args.substring( 0, args.indexOf( ' ' ) ) ) - 1;
                var note = args.substring( args.indexOf( ' ' ) );

                xhr.open( "POST", "http://clashcaller.com/api.php", true );
                xhr.setRequestHeader( "Content-type", 'application/x-www-form-urlencoded' );
                xhr.onreadystatechange = function ( returnval ) {
                    // console.log(returnval);
                    if ( xhr.readyState == xhr.DONE && xhr.status == 200 ) {
                        message.channel.sendMessage('Note on ' + ( posy + 1 ) + ' updated.');
                    } else {
                        // This seems to fire even on success
                    }
                };
                xhr.send( "REQUEST=UPDATE_TARGET_NOTE&warcode=" + warcode + '&posy=' + posy + '&value=' + note );
            }
        }
    }
}

module.exports = UpdateNoteCommand;
