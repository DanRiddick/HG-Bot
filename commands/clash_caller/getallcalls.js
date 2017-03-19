const commando = require('discord.js-commando');
var XMLHttpRequest = require('xhr2');
var ConfigHelper = require('../../config_helper.js');
var MESSAGES = require( '../../constants/messages.js' );

class GetAllCallsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'getallcalls',
            group: 'clash_caller',
            memberName: 'getallcalls',
            description: 'Get all calls',
        });
    }
    async run(message, args) {
        if(message.channel.name != 'dibs') return;
        var warcode = new ConfigHelper().getConfigValueByKey('CURRENT_WAR_CODE');
        if (warcode == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        var respstring = [], respnum = [], starnum = [];
        var botResponse = '\n', options, body, botReq;
        var xhr = new XMLHttpRequest();
        var maxY = 0;

        xhr.open("POST", "http://clashcaller.com/api.php", true);
        xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhr.send(`REQUEST=GET_FULL_UPDATE&warcode=${warcode}`);
        xhr.onreadystatechange = function (returnval) {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                var respJSON = JSON.parse(xhr.responseText);
                console.log(respJSON);
                for (var rKey in respJSON) {
                    if (rKey == "calls") {
                        var callsJSON = JSON.parse(JSON.stringify(respJSON[rKey]));
                        for (var cKey in callsJSON) {
                            var singleCallJSON = JSON.parse(JSON.stringify(callsJSON[cKey]));
                            for (var sKey in singleCallJSON) {
                                if (sKey == 'posy') {
                                    respnum[respnum.length] = singleCallJSON[sKey];
                                    if (maxY < singleCallJSON[sKey]) {
                                        maxY = singleCallJSON[sKey] - 0;
                                        console.log(maxY);
                                    }
                                }
                                if (sKey == 'playername') {
                                    respstring[respstring.length] = singleCallJSON[sKey];
                                    console.log(respstring[respstring.length - 1]);
                                }
                                if (sKey == 'stars') {
                                    starnum[starnum.length] = singleCallJSON[sKey];
                                    console.log(starnum[starnum.length - 1]);
                                }
                            }
                        }
                    }

                }


                var i, j, postNum = true, postNL = false, numJustPosted = 0;
                for (i = 0; i < (maxY - 0) + 1; i++) {
                    for (j = respstring.length - 1; j >= 0; j--) {
                        if (respstring[j].length > 0 && postNum == true && i == respnum[j]) {
                            botResponse += '#' + ((i - 0) + 1) + ': ';
                            postNum = false;
                        }
                        if (i == respnum[j]) {
                            if (starnum[j] == 5) {
                                botResponse += respstring[j] + ' (\:star:\:star:\:star:), ';
                            } else if(starnum[j] == 4) {
                                botResponse += respstring[j] + ' (\:star:\:star:), ';
                            } else if(starnum[j] == 3) {
                                botResponse += respstring[j] + ' (\:star:), ';
                            } else if(starnum[j] == 2) {
                                botResponse += respstring[j] + ' (0...), ';
                            } else {
                                botResponse += respstring[j] + ', ';
                            }
                            
                            postNL = true;
                        }
                    }

                    if (postNL == true) {
                        botResponse = botResponse.substr(0, botResponse.length - 2);
                        botResponse += '\n';
                        postNL = false;
                    }
                    postNum = true;
                }
                message.reply(botResponse);
            }
        }
    }
}

module.exports = GetAllCallsCommand;
