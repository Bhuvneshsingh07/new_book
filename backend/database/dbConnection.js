const mongoose = require("mongoose");
var mongoURL = 'mongodb+srv://codingneenja:Zxq%402003@cluster0.9j2qjgn.mongodb.net/BookShook?retryWrites=true&w=majority';

mongoose.connect(mongoURL, {useUnifiedTopology : true ,useNewUrlParser:true })

var connection = mongoose.connection

connection.on('error', ()=>{
    console.log("Mongo DB connection failed");
})

connection.on('connected' , ()=>{
    console.log("Mongo DB connection successful");
})

module.exports = mongoose