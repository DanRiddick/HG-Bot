const commando = require( 'discord.js-commando' );
var XMLHttpRequest = require( 'xhr2' );
var MESSAGES = require( '../../constants/messages.js' );
var CONFIG = require('../../config.js');
var WAR_INFO = require( '../../war_info.js' );
const clashApi = require('clash-of-clans-api');

class SetClashCallerCodeCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'startwar',
            group: 'admin',
            memberName: 'startwar',
            description: 'Start new clan war',
            examples: ['startwar ## [enemy clan id]']
        });
    }

    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        let leadershipRole = message.guild.roles.find('name', 'Leadership');
        if (message.member.roles.has(leadershipRole.id)) {
            var options = args.split(' ');

            if (options.length != 2) {
                message.channel.sendMessage(MESSAGES.INVALID_COMMAND)
                return;
            }

            var size = options[0];
            var enemyclanid = options[1];
            
            let client = clashApi({
                token: CONFIG.COC_API_TOKEN
            });

            client.clanByTag(enemyclanid).then(function(response) {
                var xhr = new XMLHttpRequest();
                xhr.open( "POST", "http://clashcaller.com/api.php", true );
                xhr.setRequestHeader( "Content-type", 'application/x-www-form-urlencoded' );
                xhr.send( "REQUEST=CREATE_WAR&cname=" + CONFIG.CLAN_NAME + '&ename=' + response.name 
                    + '&size=' + size + '&timer=' + CONFIG.CALL_TIMER + '&searchable=' + CONFIG.ARCHIVE + '&clanid=' + CONFIG.CLAN_TAG );
                xhr.onreadystatechange = function ( returnval ) {
                    if ( xhr.readyState == xhr.DONE && xhr.status == 200 ) {
                        var ccId = xhr.responseText.substring(4);
                        WAR_INFO.CURRENT_WAR_CODE = ccId;
                        message.channel.sendMessage('**War started against ' + response.name + '!** Show up what Higher Ground is all about!');
                        message.channel.sendMessage("http://clashcaller.com/" + xhr.responseText);
                    }
                }
            }, function(err) {
                console.log(err);
            });
        } else {
            message.channel.sendMessage("You do not have permission to use the `startwar` command.");
        }
    }
}

module.exports = SetClashCallerCodeCommand;
