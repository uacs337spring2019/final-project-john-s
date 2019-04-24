/**
Author: John Stockey
Course: CSc 337
Section: 1

Web service that stores and retrieves lines from a file, coffee.txt.
Such lines indicate an individual's coffee combination along with a
name for their combo.
**/
"use strict";

(function() {
    // Express. npm install express
    const express = require("express");
    const app = express();
    // Body Parser. npm install body-parser
    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();
    // File System. npm install fs
    const fs = require("fs");
    // Comment file's name.
    const FILE_NAME = "coffee.txt";

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
                   "Origin, X-Requested-With, Content-Type, Accept");
    	next();
    });

    app.use(express.static('public'));

    app.get('/', function (req, res) {
    	res.header("Access-Control-Allow-Origin", "*");

    	// Build JSON.
    	let json = {};
        let infoList = [];
        let file = fs.readFileSync(FILE_NAME, 'utf8');
        let lines = file.split("\r\n");

        // Loop through the lines in FILE_NAME.
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== "") {
                let info = {};
                let lineInfo = lines[i].split(":::");

                info["name"] = lineInfo[0];
                info["color"] = lineInfo[1];
                info["sugar"] = lineInfo[2];
                info["cream"] = lineInfo[3];
                infoList.push(info);
            }
        }

        // Add messages to json and return strigified.
        json["combos"] = infoList;
        res.send(JSON.stringify(json));
    });

    app.post('/', jsonParser, function (req, res) {
    	res.header("Access-Control-Allow-Origin", "*");

    	// Attempt to add to FILE_NAME.
    	let name = req.body.name;
        let color = req.body.color;
        let sugar = req.body.sugar;
        let cream = req.body.cream;
        let newLine = "\r\n" + name + ":::" + color + ":::" + sugar + ":::" + cream;

        fs.appendFile(FILE_NAME, newLine, function (err) {
            if (err) {
                console.log(err);
                res.status(400);
                res.send("There was an error in adding your coffee combination");
            }
            console.log('Saved!');
            res.send("Your coffee combination was added!");
        })
    });

    app.listen(process.env.PORT);
})();
