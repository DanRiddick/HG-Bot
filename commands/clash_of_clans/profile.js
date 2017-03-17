const commando = require('discord.js-commando');
const clashApi = require('clash-of-clans-api');
var XMLHttpRequest = require('xhr2');
var CONFIG = require('../../config.js');

class GetProfileCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'clash_of_clans',
            memberName: 'profile',
            description: 'Get profile',
            examples: ['!profile', '!profile [player name]']
        });
    }
    async run(message, args) {
        let client = clashApi({
            token: CONFIG.COC_API_TOKEN
        });

        var playername = message.author.username;
        if (args.length != 0) {
            playername = args;
        }
        
        function getEmoji(key) {
            switch(key) {
                case 'legend_league': return '<:legend_league:291773989368365057>';
                case 'titan_league_i': return '<:titan_league_i:291775735880744960>';
                case 'titan_league_ii': return '<:titan_league_ii:291775749743181824>';
                case 'titan_league_iii': return '<:titan_league_iii:291775766620930050>';
                case 'champion_league_i': return '<:champion_league_i:291774035325616129>';
                case 'champion_league_ii': return '<:champion_league_ii:291774052480319490>';
                case 'champion_league_iii': return '<:champion_league_iii:291774068883980288>';
                case 'master_league_i': return '<:master_league_i:291774146122219520>';
                case 'master_league_ii': return '<:master_league_ii:291774160282189834>';
                case 'master_league_iii': return '<:master_league_iii:291774188396478465>';
                case 'crystal_league_i': return '<:crystal_league_i:291774218721427456>';
                case 'crystal_league_ii': return '<:crystal_league_ii:291774232902500353>';
                case 'crystal_league_iii': return '<:crystal_league_iii:291774245694996496>';
                case 'gold_league_i': return '<:gold_league_i:291774294802038794>';
                case 'gold_league_ii': return '<:gold_league_ii:291774308361961483>';
                case 'gold_league_iii': return '<:gold_league_iii:291774327957749761>';
                case 'silver_league_i': return '<:silver_league_i:291774365824188417>';
                case 'silver_league_ii': return '<:silver_league_ii:291774380818563072>';
                case 'silver_league_iii': return '<:silver_league_iii:291774401911848961>';
                case 'bronze_league_i': return '<:bronze_league_i:291774420022984704>';
                case 'bronze_league_ii': return '<:bronze_league_ii:291774435856351233>';
                case 'bronze_league_iii': return '<:bronze_league_iii:291774453975875594>';
                case 'unranked': return '<:unranked:291774478562754560>'
                default: return '\:star:';
            }
        }


        client.clanByTag(CONFIG.CLAN_TAG).then(function(response) {
            
            var botResponse = '';
            var player = undefined;
            var foundPlayer = false;
            for (var index in response.memberList) {
                if (response.memberList[index].name.startsWith(playername)) {
                    player = response.memberList[index];
                    foundPlayer = true;
                    break;
                }
            }

            if (foundPlayer) {
                message.channel.sendMessage(`**${player.name}**`)
                message.channel.sendMessage(`#${player.clanRank} | ${getEmoji('foo')} | Level ${player.expLevel} | ${player.role}`);
                message.channel.sendMessage(`Troops Donated: ${player.donations} | Troops Received: ${player.donationsReceived} | \:trophy: ${player.trophies}`);
            } else {
                message.channel.sendMessage(`Unable to find player ${playername} in clan.`)
            }
        }, function(err) {
            console.log(err);
        });
    }
}

module.exports = GetProfileCommand;
