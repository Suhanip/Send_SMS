#!/usr/bin/env node
var sys = require("util");
const api = require('./api.json');
const axios = require('axios');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'YOUR NEXMO API KEY',
  apiSecret: 'YOUR NEXMO APT SECRET KEY',
},
 {
    debug: true
  });
const from = 'SENDER'
const to = 'RECIEVER NUMBER'

const getWeather = async location => {
	const city = location || 'Bangalore';
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
		api.key
	}`;

	try {
		const response = await axios.get(url);

		if (response.status === 200) {
			try {
				if (response.data.name) {
					return response.data;
				} else {
					const queryError = new Error(`The location ${city} was not found`);
					printError(queryError);
				}
			} catch (error) {
				printError(error);
			}
		} else {
			const statusCodeError = new Error(
				`There was an error getting the message for ${city}(StatusCode ${
					response.status
				})`
			);
			printError(statusCodeError);
		}
	} catch (error) {
		printError(error);
	}
};
if (require.main == module) {
	const argument = process.argv.slice(3).join(' ');

	getWeather(argument).then(val => {
		printWeather(val);
	});
}
function printWeather(weather) {
	let text = `Current Temperature in ${weather.name} is ${
		weather.main.temp
	} degree Celcius And Wholesale Market Price of today for Onion(Rs./Quintal) = 2500 And Expected Price till 31-03-2020:Range: [2400 - 2600]`;
	console.log(text);
	nexmo.message.sendSms(from, to, text);


}







