const commando = require( 'discord.js-commando' );
var XMLHttpRequest = require( 'xhr2' );
var ConfigHelper = require('../../config_helper.js');
var MESSAGES = require( '../../constants/messages.js' );
var fs = require('fs');


class EndWarCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'endwar',
            group: 'admin',
            memberName: 'endwar',
            description: 'End the current clan war',
            examples: ['endwar']
        });
    }

    
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        let leadershipRole = message.guild.roles.find('name', 'Leadership');
        if (message.member.roles.has(leadershipRole.id)) {
            var config = new ConfigHelper().getConfig();
            if (config.CURRENT_WAR_CODE == null) {
                message.channel.sendMessage(MESSAGES.NO_WAR);
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://clashcaller.com/api.php", true);
            xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
            xhr.send(`REQUEST=GET_FULL_UPDATE&warcode=${config.CURRENT_WAR_CODE}`);
            xhr.onreadystatechange = function (returnval) {
                if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                    var respJSON = JSON.parse(xhr.responseText);
                    fs.readFile('war_history.json', 'utf8', function readFileCallback(err, data) {
                        if (err){
                            console.log(err);
                        } else {
                            let warHistory = JSON.parse(data);
                            warHistory.warHistory.push(respJSON);
                            let json = JSON.stringify(warHistory);
                            fs.writeFile('war_history.json', json, 'utf8', function(){});
                            new ConfigHelper().setConfigValueByKey('CURRENT_WAR_CODE', null);
                            message.channel.sendMessage('War ended.');
                        }
                    });
                }
            }
        } else {
            message.channel.sendMessage("You do not have permission to use the `endwar` command.");
        }
    }

}

module.exports = EndWarCommand;
