var http = require('http')
var express = require('express')
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

// dotenv, module to load environment variables
require('dotenv').config()

var app = express()

// session support is required to use ExpressOIDC
app.use(session({
	secret: 'this should  be secure',
	resave: true,
	saveUninitialized: false
}));

const oidc = new ExpressOIDC({
	issuer: 'https://dev-840831.oktapreview.com/oauth2/default',
	client_id: process.env.CLIENT_ID_ENV,
	client_secret: process.env.CLIENT_SECRET_ENV,
	redirect_uri: 'http://192.168.2.165:3000/authorization-code/callback',
	scope: 'openid profile'
});

app.use(express.static(__dirname));
app.use(oidc.router);

oidc.on('error', err => {
	console.log('Unable to configure ExpressOIDC', err);
});

app.use(oidc.ensureAuthenticated());
oidc.on('ready', () => {
	app.listen(3000, () => console.log('Started!'));
});


/*
*********************************************************************
	Routes - for GET requests
*********************************************************************
 */

app.get('/lock', oidc.ensureAuthenticated(), function(req, res) {
	lockDoor();
	console.log("From web => Locking door");
	setTimeout(function(){logout()}, 30000);
});

app.get('/unlock',oidc.ensureAuthenticated(), function(req, res) {
	unlockDoor();
	console.log("From web => Unlocking door");
	setTimeout(function(){logout()}, 30000);	
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
/*
*********************************************************************
	Door lock code
*********************************************************************
*/
// trying this code https://github.com/HackerShackOfficial/Smartphone-Doorlock/blob/master/doorlock.js
//
// Parameters: unlockedState and lockedState
// These parameters are in microseconds.
// The servo pulse determines the degree 
// at which the horn is positioned. In our
// case, we get about 100 degrees of rotation
// from 1ms-2.2ms pulse width. You will need
// to play with these settings to get it to
// work properly with your door lock
//
// Parameters: motorPin
// The GPIO pin the signal wire on your servo
// is connected to
//
// Parameters: buttonPin
// The GPIO pin the signal wire on your button
// is connected to. It is okay to have no button connected
//
// Parameters: ledPin
// The GPIO pin the signal wire on your led
// is connected to. It is okay to have no ledconnected
//
// not gonna use Blynk
//
// **************************************** //

// using servo - lofty ambition MG996R DIGI Hi TORQUE from alibaba
// with the servo upside down - using the two sides paddle I locked the servo going 
// counter-clockwise - currently sitting at 135 deg (4th quadrant) and 315 deg (4th quadrant)

var lockedState = 850;
var unlockedState = 1900;

var motorPin = 3;
var buttonPin = 4;
var ledPin = 17;

var locked = true

// Setup servo
var Gpio = require('pigpio').Gpio,
	motor = new Gpio(motorPin, {mode: Gpio.OUTPUT}),
	button = new Gpio(buttonPin, {
        	mode: Gpio.INPUT, 
		pullUpDown: Gpio.PUD_DOWN, 
		edge: Gpio.FALLING_EDGE
	}),
	led = new Gpio(ledPin, {mode: Gpio.OUTPUT});

// want the door to be locked right after starting
setTimeout(function(){lockDoor()}, 5000)


button.on('interrupt', function (level) {
	console.log("level: " + level + " locked: " + locked)
	if (level == 0) {
		if (locked) {
			unlockDoor()
		} else {
			lockDoor()
		}
	}
});

function lockDoor() {
	motor.servoWrite(lockedState);
	led.digitalWrite(0);
	locked = true;

	console.log("DOOR LOCKED");
	// After 1.5 seconds, the door lock servo turns off to avoid stall current
	setTimeout(function(){motor.servoWrite(0)}, 1500)	
}

function unlockDoor() {
	motor.servoWrite(unlockedState);
	led.digitalWrite(1);
	locked = false;
	console.log("DOOR UNLOCKED");	
	setTimeout(function(){lockDoor()}, 15000)
}







