var express = require('express'),
	path = require('path');
	http = require('http');

module.exports = function(app) {

	app.get('/GetCoCArticles/:query', function(req, response) {
		var query = req.params["query"].split("_");

		var wikiaAPI = "http://clashofclans.wikia.com/api/v1/Search/List/?query='"+query[0]+"'%'"+query[1]+"'%'"+query[2]+"'&limit=10&namespaces=0%2C14";
		
		var responseWiki = "";

		var req = http.get(wikiaAPI, (res) => {
		  res.setEncoding('utf8');
		  res.on('data', (jsonData) => {
		    // console.log(`${jsonData}`);
		    responseWiki = responseWiki + `${jsonData}`;
		    
		  });
		  res.on('end', () => {
		    // console.log(' >>>>>> end of data.')
		    response.json(responseWiki);
		    // console.log(' >>>>>>', responseWiki);
		    })
		});

		req.on('error', (e) => {
		  console.log(`problem with request: ${e.message}`);
		});

	});

	app.put('/GetURLInfo/', function(req, response) {
		// console.log("Made it here");
		console.log("article",req.body.myURL,"called.");

		var responseHTML = "";

		var req = http.get(req.body.myURL, (res) => {
		  res.setEncoding('utf8');
		  res.on('data', (jsonData) => {
		    responseHTML = responseHTML + `${jsonData}`;
		  });
		  res.on('end', () => {
		    response.send(responseHTML);
		    })
		});

		// $.ajax({ url: req.body.myURL, success: function(data) { console.log(data); } });
	});
}