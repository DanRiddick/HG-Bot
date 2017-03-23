const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class StatsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'clash_caller',
            memberName: 'stats',
            description: 'Gets stats.',
        });
    }

    async run(message, args) {
        if(message.channel.name != 'dibs') return;
        var xhr = new XMLHttpRequest();
        var playername = message.author.username;
        if (args) {
            playername = args;
        }
        xhr.open( "GET", `http://trolluprising.com/services/getStats?playername=${playername}`, true );
        xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhr.send();
        xhr.onreadystatechange = function (returnval) {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                // console.log(xhr.responseText);
                var respJSON = JSON.parse(xhr.responseText);
                var stats = respJSON.stats;
                message.channel.sendMessage
                (
                    `**${stats.playername} Stats**\n` +
                    `\`\`\`javascript\n` + 
                    `Attacks: ${stats.totalAttacks} | Stars: ${stats.totalStars} | ` +
                    `Stars/Attack: ${(Math.round(stats.totalStars/stats.totalAttacks * 10) / 10).toFixed(1)}` +
                    `\nMissed Attacks: ${stats.expiredCalls}` +
                    `\n\`\`\``
                );
                for (let stat in stats.details) {
                    message.channel.sendMessage
                    (
                        `${stat}\n` +
                        `\`\`\`javascript\n` +
                        `Attacks: ${stats.details[stat].numAttacks} | Stars: ${stats.details[stat].totalStars} | ` +
                        `Stars/Attack: ${(Math.round(stats.details[stat].totalStars/stats.details[stat].numAttacks * 10) / 10).toFixed(1)}` +
                        `\nThree Star Rate: ${(Math.round(stats.details[stat].triples/stats.details[stat].numAttacks * 100)).toFixed(0) }%` +
                        `\nTwo Star Rate: ${(Math.round(stats.details[stat].doubles/stats.details[stat].numAttacks * 100)).toFixed(0) }%` +
                        `\nOne Star Rate: ${(Math.round(stats.details[stat].singles/stats.details[stat].numAttacks * 100)).toFixed(0) }%` +
                        `\nFail Rate: ${(Math.round(stats.details[stat].blanks/stats.details[stat].numAttacks * 100)).toFixed(0) }%` +
                        `\n\`\`\``
                    );
                }
            } else if (xhr.readyState == xhr.DONE && xhr.status == 400) {
                message.channel.sendMessage('Invalid player.');
            }
        }
    }
}

module.exports = StatsCommand;
