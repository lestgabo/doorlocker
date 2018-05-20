var http = require('http')
var express = require('express')
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

var app = express()

//var path = require('path');

// session support is required to use ExpressOIDC
app.use(session({
	secret: 'this should  be secure',
	resave: true,
	saveUninitialized: false
}));

const oidc = new ExpressOIDC({
	issuer: 'https://dev-840831.oktapreview.com/oauth2/default',
	client_id: '0oaf33db3y3dc16KM0h7',
	client_secret: 'xyyfAUYLLxopiSJ_vilQnsDnVfjnO7HpKsfXQcwX',
	redirect_uri: 'http://192.168.2.102:3000/authorization-code/callback',
	scope: 'openid profile'
});

app.use(express.static(__dirname));
app.use(oidc.router);


/*
app.get('/', (req, res) => {
	if (req.userinfo) {
		res.send(`Hello ${req.userinfo.name}! <a href="logout">Logout</a>`);
	} else {
		res.send('Please <a href="/login">login</a>');
	}	
});
app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
	res.send('Top Secret');
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
*/
oidc.on('error', err => {
	console.log('Unable to configure ExpressOIDC', err);
});

app.use(oidc.ensureAuthenticated());
oidc.on('ready', () => {
	app.listen(3000, () => console.log('Started!'));
});

/*
*********************************************************************
	Routes - for express
*********************************************************************
 */

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
var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
	console.log('App Server listening on ' + PORT);
});
*/

/*
*********************************************************************
	Routes - for AJAX GET requests
*********************************************************************
 */

app.get('/lock', oidc.ensureAuthenticated(), function(req, res) {
	lockDoor();
	console.log("Locking door");
	//res.send("Successfully locked door.");	
});

app.get('/unlock',oidc.ensureAuthenticated(), function(req, res) {
	unlockDoor();
	console.log("Unlocking door");
	//res.send("Unlocked door.");	
});
/*
//app.get('/doorlocker',oidc.ensureAuthenticated({ redirectTo: 'http://localhost:3000'}), function(req, res) {
//app.get('/login',oidc.ensureAuthenticated({ redirectTo: '/'}), function(req, res) {
app.get('/login',oidc.ensureAuthenticated({ redirectTo: '/'}), function(req, res) {
	res.sendFile('doorlocker.html', {root : __dirname}, {title: 'DOORLOCKER'});
});

app.get('/doorlocker', oidc.ensureAuthenticated({ redirectTo: '/'}), function(req, res) {
	res.sendFile('doorlocker.html', {root : __dirname}, {title: 'DOORLOCKER'});
});
*/

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

var lockedState = 1750;
var unlockedState = 750;

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
	motor.servoWrite(unlockedState);
	led.digitalWrite(0);
	locked = true

	// After 0.5 seconds, the door lock servo turns off to avoid stall current
	setTimeout(function(){motor.servoWrite(0)}, 500)	
}

function unlockDoor() {
	motor.servoWrite(lockedState);
	led.digitalWrite(1);
	locked = false

	// After 0.5 seconds, the door lock servo turns off to avoid stall current
	setTimeout(function(){motor.servoWrite(0)}, 500)
}







