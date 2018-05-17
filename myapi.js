
var http = require('http');
var express = require('express');
var app = express();

app.use(express.static(__dirname ));
/*
// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});


// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});
	*/
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
	console.log('App Server listening on ' + PORT);
});

/*
*********************************************************************
	Routes - for GET requests
*********************************************************************
 */
app.get('/lock', function(req, res) {
	lockDoor();
	console.log("Locking door");
	res.send("Successfully locked door.");	
});

app.get('/unlock', function(req, res) {
	unlockDoor();
	console.log("Unlocking door");
	res.send("Unlocked door.");	
});


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// trying this code https://github.com/HackerShackOfficial/Smartphone-Doorlock/blob/master/doorlock.js


//*** SMARTPHONE DOORLOCK ***//

// ************* PARAMETERS *************** //
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

var unlockedState = 1750;
var lockedState = 750;

var motorPin = 3;
var buttonPin = 4;
var ledPin = 17;

// *** Start code ** //

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


button.on('interrupt', function(level) {
	console.log("level: " + level + "locked: " + locked)
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
	led.digitalWrite(1);
	locked = true

	// After 1.5 seconds, the door lock servo turns off to avoid stall current
	setTimeout(function(){motor.servoWrite(0)}, 1500)	
}

function unlockDoor() {
	motor.servoWrite(unlockedState);
	led.digitalWrite(0);
	locked = false

	// After 1.5 seconds, the door lock servo turns off to avoid stall current
	setTimeout(function(){motor.servoWrite(0)}, 1500)
}
















