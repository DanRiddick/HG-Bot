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
        if(message.channel.name != 'general') return;
        var asspics = [
            'http://i.imgur.com/xBra65Y.jpg',
            'http://i.imgur.com/bSylp29.jpg',
            'http://i.imgur.com/HHrP9GZ.jpg',
            'http://i.imgur.com/ppEuj5F.jpg',
            'http://i.imgur.com/jB9inTw.jpg',
            'http://i.imgur.com/z9HLyA6.jpg',
            'http://i.imgur.com/kAWZcGp.jpg',
            'http://i.imgur.com/17lS9I9.jpg',
            'http://i.imgur.com/2nnGixF.jpg'

        ]

        var random = Math.floor(Math.random() * asspics.length);

        message.channel.sendMessage(asspics[random]);
    }
}

module.exports = AssPicCommand;
