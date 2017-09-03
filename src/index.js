const awsIot = require('aws-iot-device-sdk');
const config = require('../config');
const LightBulb = require('./LightBulb');
const keypress = require('keypress');

const lightbulb = new LightBulb({
    powered: true,
    brightness: 50,
    colour: LightBulb.COLOURS['blue']
});

const deviceName = config.device.name;

const device = awsIot.device({
    keyPath  : config.aws.keyPath,
    certPath : config.aws.certPath,
    caPath   : config.aws.caPath,
    clientId : config.aws.clientId,
    host     : config.aws.host
});

/**
 * Once connected to AWS, subscribe for updates,
 * and push it's state to AWS
 */
device.on('connect', () => {
    device.subscribe(`$aws/things/${ deviceName }/shadow/+`);
    device.subscribe(`$aws/things/${ deviceName }/shadow/+/+`);

    publish();
    init();
});

/**
 * informational handlers
 */
device.on('close', function() {
   console.log('close');
});

device.on('reconnect', function() {
   console.log('reconnect');
});

device.on('offline', function() {
   console.log('offline');
});

device.on('error', function(error) {
   console.log('error', error);
});

/**
 * Device update handler
 */
device.on('message', function(topic, payload) {
    const type = topic.split('/')[5];

    // only update accepted changes
    switch (type) {
        case 'accepted':
            const state = JSON.parse(payload.toString()).state;

            if (state.desired) {
                lightbulb.setState(state.desired);
                publish();
                draw();
            }
            break;

        // TODO implement handlers for other cases

        default:
            break;
    }
});


const init = () => {
    draw();

    process.stdin.on('keypress', (ch, key) => {
        // don't block ctrl+c
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
            process.exit(0);
        }

        if (key) {
            switch (key.name.toUpperCase()) {                    
                case 'B':
                    lightbulb.setColour('blue');
                    publish();
                    break;

                case 'D':
                    lightbulb.decreaseBrightness();
                    publish();
                    break;

                case 'G':
                    lightbulb.setColour('green');
                    publish();
                    break;

                case 'P':
                    lightbulb.togglePower();
                    publish();
                    break;

                case 'R':
                    lightbulb.setColour('red');
                    publish();
                    break;

                case 'U':
                    lightbulb.increaseBrightness();
                    publish();
                    break;
                
                case 'X':
                    process.stdin.pause();
                    process.exit(0);
                    break;
            }

            draw();
        }
    });

    keypress(process.stdin);
    process.stdin.setRawMode(true);    
    process.stdin.resume();
};


/**
 * Push an update to AWS
 */
const publish = () => {
    var state = {
        state: {
            reported: lightbulb.getState()
        }
    }

    device.publish(`$aws/things/${ deviceName }/shadow/update`, 
        JSON.stringify({
            state: {
                reported: lightbulb.getState()
            }
        })
    );
};


/**
 * Draw the output to the console.
 * TODO don't just reprint to the screen, use
 * a library (npm blessed).
 */
const draw = () => {
    let colour = lightbulb.colour.fg;
    const reset = "\x1b[0m";

    if (lightbulb.powered) {
        // colour the background
        colour = lightbulb.colour.bg + '\x1b[37m';
    } else {
        // colour the text
        colour = '\x1b[0m' + lightbulb.colour.fg;
    }

    process.stdout.write('\033c');
    console.log('Virtual Lightbulb');
    console.log('=================\n');
    console.log(`     ${colour}..---..${reset}`);
    console.log(`    ${colour}/       \\${reset}`);
    console.log(`   ${colour}|         |${reset}`);
    console.log(`   ${colour}:         ;${reset}`);
    console.log(`    ${colour}\\  \\~/  /${reset}`);
    console.log(`     ${colour}\`, Y ,\'${reset}`);
    console.log(`      ${colour}|_|_|${reset}`);
    console.log(`      |===|`);
    console.log(`      |===|`);
    console.log(`       \\_/\n`);
    console.log(`Colour:     ${lightbulb.colour.name}`);
    console.log(`Brightness: ${lightbulb.brightness}`);
    console.log(`Powered:    ${lightbulb.powered}`);
    console.log('\n=================\n');
    console.log('[ U ] - Increase brightness');
    console.log('[ D ] - Decrease bightnesss');
    console.log('[ P ] - Toggle on/off');
    console.log('[ R / G / B ] - Set colour');
    console.log('[ X ] - Exit')
}

console.log('Connecting to AWS...');