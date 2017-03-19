var fs = require('fs')
class ConfigHelper {
    constructor() {}

    getConfigValueByKey(key) {
        var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
        return config[key];
    }

    setConfigValueByKey(key, value) {
        fs.readFile('config.json', 'utf8', function readFileCallback(err, data) {
            if (err){
                console.log(err);
            } else {
                let config = JSON.parse(data);
                config[key] = value;
                let json = JSON.stringify(config);
                fs.writeFile('config.json', json, 'utf8', function(){});
            }
        });
    }

    getConfig() {
        var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
        return config;
    }
}

module.exports = ConfigHelper;