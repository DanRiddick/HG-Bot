const commando = require( 'discord.js-commando' );
var MESSAGES = require( '../../constants/messages.js' );
var REG_EXP = require( '../../constants/regular_expressions.js' );
var ConfigHelper = require('../../config_helper.js');
var XMLHttpRequest = require( 'xhr2' );

class AssPicCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'asspic',
            group: 'clash_caller',
            memberName: 'asspic',
            description: 'Shows Mitch\'s ass in all it\'s glory',
        });
    }

    async run(message, args) {
        var asspics = [
            'http://i.imgur.com/xBra65Y.jpg'
        ]

        var random = Math.floor(Math.random() * asspics.length);

        message.channel.sendMessage(asspics[random]);
    }
}

module.exports = AssPicCommand;
