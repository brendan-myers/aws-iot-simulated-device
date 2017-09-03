const COLOURS = {
    'blue': {
        name: 'blue',
        fg: '\x1b[34m',
        bg: '\x1b[44m'
    },
    'green': {
        name: 'green',
        fg: '\x1b[32m',
        bg: '\x1b[42m'
    },
    'red': {
        name: 'red',
        fg: '\x1b[31m',
        bg: '\x1b[41m'
    }
};

const DEFAULT_BRIGHTNESS = 0;
const DEFAULT_COLOUR = COLOURS['r'];
const DEFAULT_POWERED = false;
const MIN_BRIGHTNESS = 0;
const MAX_BRIGHTNESS = 100;

class LightBulb {
    constructor(state) {
        if (state.brightness < MIN_BRIGHTNESS || state.brightness > MAX_BRIGHTNESS) {
            state.brightness = DEFAULT_BRIGHTNESS;
        }

        this.brightness = parseInt(state.brightness);
        this.colour     = state.colour     || DEFAULT_COLOUR;
        this.powered    = state.powered    || DEFAULT_POWERED; 
    }

    increaseBrightness() {
        if (this.brightness < MAX_BRIGHTNESS) {
            this.brightness++;
        }
    }

    decreaseBrightness() {
        if (this.brightness > MIN_BRIGHTNESS) {
            this.brightness--;
        }
    }

    setBrightness(brightness) {
        if (MIN_BRIGHTNESS <= brightness && brightness <= MAX_BRIGHTNESS) {
            this.brightness = parseInt(brightness);
        }
    }

    setColour(colour) {
        if (typeof colour === 'string' && COLOURS[colour]) {
            this.colour = COLOURS[colour];
        }
    }

    togglePower() {
        this.powered = !this.powered;
    }

    setPowered(powered) {
        this.powered = !!powered;
    }
    
    getState() {
        return {
            brightness: this.brightness,
            colour:     this.colour.name,
            powered:    this.powered
        };
    }

    setState(state) {
        if (state.brightness) {
            this.brightness = parseInt(state.brightness);
        }

        if (state.colour) {
            this.colour = COLOURS[state.colour];
        }

        if(state.powered) {
            this.powered = state.powered == 'true' ? true : false;
        }
    }
}

module.exports = LightBulb;
module.exports.COLOURS = COLOURS;