const mongoose = require('mongoose');
const fs = require('fs');
const csv = require("csv-parser");
const results = [];
const carList = [];

mongoose.connect('mongodb://localhost:27017/carDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });


const carSchema = {
    stock_num:{
        type: String,
        require: true,
        match: /^[0-9]+$/,
        minLength: 5,
    }, make:{
        type: String,
        require: true,
    }, model:{
        type: String,
        require: true,
    }, year:{
        type: Number,
        min: 1900,
        max: new Date().getFullYear(),
        require: true,
    }, color:{
        type: String,
        require: true,
    }, url:{
        type: String,
        require: true,
    }, price:{
        type: Number,
        range:{
            min: { type: Number, min: 0},
            max: { type: Number, min: 0},
        },
        require: true,
    }
};

const Car = mongoose.model('Car', carSchema);

fs.createReadStream(__dirname+'/data100.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results[0]);
        // Do the database insertMany here
        results.forEach(function (car) {
            carList.push({
                "stock_num": car["stock_num"],
                "make": car["make"],
                "model": car["model"],
                "year": car["year"],
                "color": car["color"],
                "url": car["url"],
                "price": car["price"]
            })
        })
        Car.insertMany(carList, {}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("all data saved");
                mongoose.connection.close();
            }
        });
    });