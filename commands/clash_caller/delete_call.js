const commando = require('discord.js-commando');
var MESSAGES = require('../../constants/messages.js');
var REG_EXP = require('../../constants/regular_expressions.js');
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require('xhr2');

class DeleteCallCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'deletecall',
            group: 'clash_caller',
            memberName: 'deletecall',
            description: 'Delete call',
            examples: ['!deletecall #', '!deletecall # for [player name]']
        });
    }
    async run(message, args) {
        if(message.channel.name != 'dibs') return;
        
        var xhr = new XMLHttpRequest();
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        xhr.open("POST", "http://clashcaller.com/api.php", true);
        xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhr.send("REQUEST=GET_FULL_UPDATE&warcode=" + warcode);
        xhr.onreadystatechange = function (returnval) {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                var foundCall = false;

                var options = args.split(' for ');
                var posy = parseInt(options[0]) - 1;
                var playername = message.author.username;
                if (options.length > 1) {
                    playername = options[1];
                }

                if (response.calls.length == 0) {
                    message.channel.sendMessage('No calls for ' + playername + ' on #' + ( posy + 1 ) );
                } else {
                    var call = undefined;
                    for (var cIndex in response.calls) {
                        call = response.calls[cIndex];
                        if (call.posy == posy && call.playername == playername) {
                            foundCall = true;
                            break;
                        }
                    }

                    if (foundCall) {
                        var xhr2 = new XMLHttpRequest();
                        var messageSent = false;
                        xhr2.open("POST", "http://clashcaller.com/api.php", true);
                        xhr2.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
                        xhr2.send("REQUEST=DELETE_CALL&warcode=" + warcode + '&posx=' + call.posx + '&posy=' + call.posy);
                        xhr2.onreadystatechange = function (returnval) {
                            if (xhr.readyState == xhr.DONE && xhr.status == 200 && !messageSent) {
                                message.channel.sendMessage('Deleted call on #' + ( posy + 1 ) + ' for ' + playername);
                                messageSent = true;
                            }
                        }
                    } else {
                        message.channel.sendMessage('No calls for ' + playername + ' on #' + ( posy + 1 ) );
                    }
                    
                }
            }
        };
    }
}

module.exports = DeleteCallCommand;
