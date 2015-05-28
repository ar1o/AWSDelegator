/*
	
*/
var csv = require("fast-csv");
var Converter = require('csvtojson').core.Converter; 
var fs = require('fs'); 

exports.getBilling = function (req, res) {
    //GRAB ACCOUNT NUBER AND APPEND 
    //Take month/year into account
    //fix 
    var csvFile = "data/092841396837-aws-billing-detailed-line-items-with-resources-and-tags-2015-05.csv"
        //transform to a new .csv file
    var stream = fs.createWriteStream("out.csv", {
        encoding: "utf8"
    })
    var formatStream = csv
        .createWriteStream({
            headers: true
        })
        .transform(function(obj) {
            return {
                name: obj.ProductName,
                cost: obj.Cost,
                id: obj.ResourceId,
                startTime: obj.UsageStartDate
            };
        });
    csv
        .fromPath(csvFile, {
            headers: true
        })
        .pipe(formatStream)
        .pipe(stream);

    //convert to .json
    stream.on("finish", function() {
        console.log("DONE!");
        var csvConverter = new Converter({
            constructResult: false,
            toArrayString: true
        });
        // var readStream = fs.createReadStream("out.csv");
        var readStream = fs.createReadStream("out.csv");
        var writeStream = fs.createWriteStream("outputData.json", {
            flags: 'w'
        });

        readStream.pipe(csvConverter).pipe(writeStream);

        writeStream.on('close', function() {
            console.log("end");
            // res.sendFile("/home/ksimon/git/AWSDelegator/outputData.json");

        });
        var stream = fs.createReadStream(csvFile);

    });


};