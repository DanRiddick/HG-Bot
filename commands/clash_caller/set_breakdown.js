const commando = require('discord.js-commando');
var MESSAGES = require('../../constants/messages.js');
var REG_EXP = require('../../constants/regular_expressions.js');
var XMLHttpRequest = require('xhr2');
var ConfigHelper = require('../../config_helper.js');

class SetBreakdownCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setbreakdown',
            group: 'clash_caller',
            memberName: 'setbreakdown',
            description: 'Set townhall breakdown on clashcaller.',
            examples: ['setbreakdown [#/#/#/#/.../#]']
        });
    }
    async run(message, args) {
        if(message.channel.name != 'dibs') return;
        
        var xhr = new XMLHttpRequest();
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        xhr.open("POST", "http://clashcaller.com/api.php", true);
        xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhr.send(`REQUEST=GET_FULL_UPDATE&warcode=${warcode}`);
        xhr.onreadystatechange = function (returnval) {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);

                // Parse the args
                var breakdowns = args.split('/');

                // Validate the stars
                if (breakdowns.length != response.general.size) {
                    message.channel.sendMessage('Breakdown is not equal to war size.');
                    return;
                }

                for (let i = 0; i < breakdowns.length; i++) {
                    let bd = breakdowns[i];
                    let xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", "http://clashcaller.com/api.php", true);
                    xhr2.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
                    xhr2.send(`REQUEST=UPDATE_TARGET_NAME&warcode=${warcode}&posy=${i}&value=TH${bd}`);
                    xhr2.onreadystatechange = function (returnval) {
                        if (xhr2.readyState == xhr2.DONE && xhr2.status == 200) {
                            console.log(`Updated #${i + 1}'s name to TH${bd}`);
                        }
                    }
                }
                message.channel.sendMessage('Townhall breakdown is set.');
            }
        }
    }
}


module.exports = SetBreakdownCommand;
