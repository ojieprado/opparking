
# opparking API v.1.0.0
> Hi there! I'm Ojie, API developer for opparking API. This project is
created for company presentation only. Feel free to evaluate whatever errors encountered.

## Installation
- Clone files to repo
`git clone opparking`
- cd the folder
`cd opparking`
- install the package
`npm i`
- run the app
`node app`
- Make sure you have MongoDB for database. Didn't include .env for security purposes.
- Start the server
`http://localhost:PORT/`
- Go to **#Endpoints**

## Requirements
- node.js
- mongodb

## Endpoints
-  ### Slot Endpoints
`GET /slot` - Get All Slots
`GET /slot/:slotStatus` - Get All Slots by slotStatus
`GET /slot/:slotStatus/:slotSize` - Get All Slots by slotStatus and slotSize
`POST /slot` - Insert new Slot
`PATCH /slot` - Edit Slot Fee by slotSize
-  ### Park Endpoints
`GET /park` - Get All Parks
`GET /park/:plateNo` - Get Parks By plateNo
`POST /park` - Insert Park
`POST /park/signup` - Signup for new Parker
`POST /park/:plateNo/unpark` - Unpark the car
`GET /park/available/:carSize` - Get the availability

## File Tree
- **ooparking**
- **app.js** - entry file
- **package.json**
- **src**
	- **apis**
		- **v1:** api version
			- **index.js**
- **config**
	- **index.js**
- **controllers**
	- park-controller.js
	- slot-controller.js
- **models**
	- car.model.js
	- park.model.js
	- slot.model.js
- **services**
	- parking-service.js
	- slot-service.js
- **utils**
	- async-handler.util.js