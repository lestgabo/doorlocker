# doorlocker

Making a door locker with login using Raspberry Pi 3, High motor servo, and 3-D printed cover.

- Get the parts (DONE)
- Setup the Raspberry Pi (DONE)
  - Git (DONE)
  - Node.js (DONE)
  - headless mode (no mouse, keyboard, connect through Remote Desktop Connection) (DONE)
    - headless tutorial from here http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/
- Test if servo works (DONE)
- Create web app (DONE)
  - create webserver inside Pi (DONE)
    - creating web server from the tutorial from http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/ (DONE)
    - a great quote from part 2 of the link above http://www.robert-drummond.com/2015/06/01/rest-api-on-a-pi-part-2-control-your-gpio-io-ports-over-the-internet/ "In Part 1 of this series, we built a simple REST API in JavaScript on our Raspberry Pi.
One of the most useful reasons for providing your Raspberry Pi with a REST API is to expose its input and output ports via the Internet for remote monitoring and control. This will allow you to control your RPi’s inputs and outputs from the browser on any smartphone or PC wherever you are in the world." (DONE)
  - connect the Raspberri Pi with the servo (DONE)
- Test functionality (DONE)
- add button and LED (DONE)
- Add login authentication on web app (DONE)
	- using okta from npm install for login authentication (DONE)
	- REMEMBER TO CHANGE client_id and client secret when in production (DONE)

- Installed PM2 to auto start myapi.js (DONE) 


- Post Mortem
	- keep it simple stupid (KISS)
	- hands are still shaky when soldering
	- used okta login because of recommendation from brother
	- solved issues quickly when actually thought about issue logically
		- e.g. okta get request has oidc.ensureAuthenticated() to make sure that user is authorized. So I had a new page /doorlocker with oidc.ensureAuthenticated() and the login button links there. BUT it just sent me into an infinite redirect loop because when using oidc.ensureAuthenticated() if not logged in then it redirects to /login. Scrapped the whole new page and just linked the button to /login which comes with the okta package.

- After feedback / actual use for a week
	- increased time for auto-lock
	- realized theres the issue of jQuery mobile firing multiple times
		- this is/was the reason for the door unlocking by itself after unlocking from my phone
		- looking for a fix online, another easy fix is to just logout the Okta athentication after a minute. we'll see which one
