/*
	
*/
var csv = require("fast-csv");
var Converter = require('csvtojson').core.Converter; 
var fs = require('fs'); 

exports.parseBillingCSV = function (req, res) {
    //GRAB ACCOUNT NUBER AND APPEND 
    //Take month/year into account
    var accountNum = '092841396837'; // export the AWS from 
    var now = new Date();
    var month = now.getMonth()+1;
    if(month<10)month="0"+month;
    var year = now.getFullYear();
    console.log("Month: "+month);
    //temp fix
    month = "05";
    console.log("Year: "+year);    //fix 
    var csvFile = "data/"+ accountNum +"-aws-billing-detailed-line-items-with-resources-and-tags-"+year+"-"+month+".csv"
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
            console.log("out.csv written to root directory...");
            // res.sendFile("/home/ksimon/git/AWSDelegator/outputData.json");

        });
        var stream = fs.createReadStream(csvFile);

    });


};