 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourceSchema = new Schema({
	ID: String;
	volume: String;
	sDate: date;
	cost: number;
})

var volumeSchema = new Schema({
	VID: String;
	sDate: date;
	cost: number;
})