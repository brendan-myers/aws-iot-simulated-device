# AWS IoT Simulated Device
📟 A simple device simulator for use with AWS IoT

[![Build][travis-image]][travis-url]

A simulated lightbulb built using AWS IoT device shadows.


## Setup

```bash
git clone https://github.com/brendan-myers/aws-iot-simulated-device.git
cd aws-iot-simulated-device
npm install
```

`config.js` contains the security configuration details for the simulated device. For information on where to download device certificates and details, see [AWS IoT SDK](https://github.com/aws/aws-iot-device-sdk-js).


## Run

```bash
npm run start
```

Once the device has connected to AWS IoT, use the keyboard to control the state of the device (increase/decrease brightness, change colour, turn on/off).


## Todo

- Tests
- Instantiate the device with the last accepted device shadow state.
- Smarter drawing to terminal.


[travis-image]: https://travis-ci.org/brendan-myers/aws-iot-simulated-device.svg?branch=master
[travis-url]: https://travis-ci.org/brendan-myers/aws-iot-simulated-device