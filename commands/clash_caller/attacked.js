const commando = require('discord.js-commando');
var MESSAGES = require('../../constants/messages.js');
var REG_EXP = require('../../constants/regular_expressions.js');
var XMLHttpRequest = require('xhr2');
var ConfigHelper = require('../../config_helper.js');

class AttackedCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'attacked',
            group: 'clash_caller',
            memberName: 'attacked',
            description: 'Log attack',
            examples: ['attacked # for # stars', 'attacked # for # stars by [player name]']
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
                var options = args.split(' by ');
                var playername = options.length == 2 ? options[1] : message.author.username;
                options = options[0].split(' for ');
                var posy = parseInt(options[0]) - 1;
                var stars = parseInt(options[1].substring(0, 1));
                console.log(playername + ' attacked #' + posy + ' for ' + stars + ' stars');

                // Validate the stars
                if (stars < 0 || stars > 3) {
                    message.channel.sendMessage('Invalid stars, dunno what game you\'re playing!');
                    return;
                }

                var calls = response.calls;
                var foundCall = false;
                var isAdmin = false; // TODO: Need to eventually set up admin rights
                var call = undefined;
                if (calls.length == 0) {
                    if (isAdmin) {
                        // TODO: Allow admin to call target then update the stars
                    } else {
                        message.channel.sendMessage(playername + ' has no calls on #' + ( posy + 1 ) );
                        return;
                    }
                } else {
                    for (var cIndex in calls) {
                        call = calls[cIndex];
                        if (call.playername == playername && call.posy == posy) {
                            foundCall = true;
                            break;
                        }
                    }
                }
                if (foundCall) {
                    var botResponse = '';
                    if (stars == 3) {
                        // TODO: Create random awesome message
                        var congrats = [
                            '***OH BABY A TRIPLE!!!!***\n',
                            '***Pour one out for that base!***\n',
                            '***Three cheers for ' + playername + '!***\n',
                            '***And boom goes the dynamite!!***\n',
                            '***Victory is yours!***\n',
                            '***Nicely done ' + playername + '! Now we expect it every time!***\n',
                            '***Nailed it ' + playername + '!***\n',
                            '***We are all witnesses...!***\n',
                            '***I knew we kept you around for something... Well done!***\n',
                            '***TOTAL DEVISTATION!***\n',
                            '\:muscle:\:muscle:\:muscle:***!***\n',
                            '***Today we are blessed with greatness!***\n',
                            '***You came, you saw, you conquered!***\n',
                            '***Sometimes it\'s better to be lucky than good, am I right?!***\n',
                            '\:star:\:star:\:star:***!***\n',
                            '***That replay deserves an Oscar!***\n',
                            '***Flex those muscles!***\n',
                            '***Shake those stars!***\n',
                            '***Brb getting your trophy engraved!***\n',
                            '***Someone wore their big boy pants today!***\n'
                        ]
                        var random = Math.floor(Math.random() * congrats.length);
                        botResponse += congrats[random]
                    }
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", "http://clashcaller.com/api.php", true);
                    xhr2.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
                    xhr2.send("REQUEST=UPDATE_STARS&warcode=" + warcode + '&posx=' + call.posx + '&posy=' + call.posy + '&value=' + (stars + 2));
                    xhr2.onreadystatechange = function (returnval) {
                        if (xhr2.readyState == xhr2.DONE && xhr2.status == 200) {
                            botResponse += 'Logged ' + stars + ' stars on #' + (posy + 1) + ' by ' + playername;
                            message.channel.sendMessage(botResponse);
                        }
                    }
                } else {
                    if (isAdmin) {
                        // TODO: Allow admin to call target then update the stars
                    } else {
                        message.channel.sendMessage(playername + ' has no calls on #' + ( posy + 1 ) );
                        return;
                    }
                }
            }
        }
    }
}


module.exports = AttackedCommand;
