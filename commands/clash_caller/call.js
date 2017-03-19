const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class CallCommand extends commando.Command {
    constructor( client ) {
        super(client, {
            name: 'call',
            group: 'clash_caller',
            memberName: 'call',
            description: 'Call target',
            examples: ['call #', 'call # for [player name]']
        });
    }
    async run( message, args ) {
        if(message.channel.name != 'dibs') return;
        
        var options = args.split(' for ');
        var playername = message.author.username;
        if (options.length > 1) {
            playername = options[1];
        }
        var posy = parseInt(options[0]) - 1;

        function isActive(general, call) {
            var check_time = new Date(general.checktime);
            var war_start = new Date(general.starttime);
            var call_start = new Date(general.calltime);
            var call_timer = parseInt(general.timerlength);
            var timer_show = true;
            var call_end = undefined;
            var diff = undefined;
            var active_call = true;
            var timer_text = '';
            var attacked = false;
            var stars = 0;
            if(call_timer > 0){
                call_end = new Date(call.calltime) + (call_timer * 60 * 60);
            } else if (call_timer < 0){
                if(call_start < war_start) call_start = war_start;
                diff = war_start;
                diff.setTime(diff.getTime() + (24*60*60*1000)); // Add a day
                diff -= $check_time;
                diff /= abs(call_timer);
                call_end = call_start + diff;
            } else {
                timer_show = false;
                active_call = true;
                timer_text = 'called';
            }
            if(timer_show){
                if(call_start < war_start){
                    call_end = war_start + (parseInt(general.timerlength) * 60 * 60);
                }
                if(call_end < check_time){
                    timer_text = 'expired';
                    active_call = false;
                }else{
                    diff = call_end - check_time;
                    timer_text = new Date(diff);
                }
                if(war_start > check_time){
                    timer_text = 'called';
                }
                if(general.timerlength == '0'){
                    timer_text = 'called';
                }
            }
            if(parseInt(call.stars) > 1){
                active_call = false;
                attacked = true;
                stars = parseInt(call.stars) - 2;
                switch(parseInt(call.stars)){
                    case 2:
                        timer_text = '0 stars';
                    break;
                    case 3:
                        timer_text = '*';
                    break;
                    case 4:
                        timer_text = '**';
                    break;
                    case 5:
                        timer_text = '***';
                    break;
                }
            }

            return active_call;
        }

        var xhr = new XMLHttpRequest();
        var config = new ConfigHelper().getConfig();
        if (config.CURRENT_WAR_CODE == null) {
            message.channel.sendMessage(MESSAGES.NO_WAR);
            return;
        }
        xhr.open("POST", "http://clashcaller.com/api.php", true);
        xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
        xhr.send("REQUEST=GET_FULL_UPDATE&warcode=" + config.CURRENT_WAR_CODE);
        xhr.onreadystatechange = function (returnval) {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (posy < 0 || posy > response.general.size) {
                    message.channel.sendMessage('Target is out of bounds.');
                    return;
                }

                if (!config.STACKED_CALLS) {
                    var calls = response.calls;
                    var foundCall = false;
                    var call = undefined;
                    for (var cIndex in calls) {
                        call = calls[cIndex];
                        if (isActive(response.general, call) && call.playername == playername && call.posy == posy) {
                            foundCall = true;
                        }
                    }
                    if (foundCall) {
                        message.channel.sendMessage('#' + (posy + 1) + ' already called by ' + playername);
                        return;
                    }
                } 

                // Call target
                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", "http://clashcaller.com/api.php", true);
                xhr2.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
                xhr2.send("REQUEST=APPEND_CALL&warcode=" + config.CURRENT_WAR_CODE + '&posy=' + posy + '&value=' + playername);
                xhr2.onreadystatechange = function (returnval) {
                    if (xhr2.readyState == xhr2.DONE && xhr2.status == 200) {
                        message.channel.sendMessage('Called #' + (posy + 1) + ' for ' + playername);
                    }
                }
            }
        }
    }
}

module.exports = CallCommand;
