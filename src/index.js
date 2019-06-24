const express = require('express');
const scraper = require('./scraper');
const app = express();

app.get('/', (req, res) => {
	scraper.searchMonitors().then((monitors) => {
		res.json(monitors);
	});
});

app.get('/monitor/:id', (req, res) => {
	scraper.getMonitor(req.params.id).then((monitor) => {
		res.json(monitor);
	});
});

app.listen(8080, () => {
	console.log('We Outchea');
});
