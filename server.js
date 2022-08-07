const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csv = require('csv-parser')
const fs = require('fs');
const app = express();
const carList = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
}

const Car = mongoose.model('Car', carSchema);


app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/get_all_cars", function (req, res) {
    Car.find(function (err, data) {
        if (err) {
            res.send({
                "message": "internal database error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

app.get('/get_car_by_id', function (req, res) {
    //console.log(req.query.car_id);
    Car.find({"_id": req.query.car_id}, function (err, data) {
        if (err || data.length === 0) {
            res.send({
                "message": "internal database error",
                "data": {}
            });
        } else {
            res.send({
                "message": "success",
                "data": data[0]
            })
        }
    });
});

app.post('/delete_car_by_id', (req, res) => {
    Car.deleteOne(
        {"_id": req.body._id},
        {},
        (err) => {
            if (err) {
                res.send({
                    "message": "database deletion error"
                })
            } else {
                res.send({
                    "message": "success"
                })
            }
        }
    )
});

app.post('/new_car', (req, res) => {
    const car = {
        stock_num: req.body.stock_num,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        url: req.body.url,
        price: req.body.price
    }
    console.log(req.body._id);
    console.log(req.body.stock_num);
    console.log(req.body.make);
    console.log(req.body.model);
    if (req.body._id) {
        //update existing movie
        Car.updateOne({_id: req.body._id},
            {$set: car},
            {runValidators: true},
            (err, info) => {
                if (err) {
                    res.redirect("/edit.html?error_message=" + err["message"]
                        + "&input=" + JSON.stringify(car) + "&carid=" + req.body._id);
                } else {
                    res.redirect("/detail.html?car_id=" + req.body._id);
                }
            });
    } else {
        //create new movie
        const newCar = new Car(car);
        newCar.save((err, new_car) => {
            if (err) {
                console.log(err);
                // res.send("Database error");
                res.redirect("/edit.html?error_message=" + err["message"]
                    + "&input=" + JSON.stringify(car));
            } else {
                console.log(new_car._id)
                res.redirect("/detail.html?car_id=" + new_car._id);
            }
        })
    }
});

app.get("/get_cars_by_filters", (req, res) => {
    let sk = req.query.search_key;
    let minprice = req.query.min_price;
    let maxprice = req.query.max_price;
    let minyear = req.query.min_year;
    let maxyear = req.query.max_year;
    if (minprice === "") {
        minprice = 0;
    }
    if (maxprice === "") {
        maxprice = 100000;
    }
    if (minyear === "") {
        minyear = 1000;
    }
    if (maxyear === "") {
        maxyear = 2022;
    }
    parseInt(minyear);
    parseInt(maxyear);
    parseInt(minprice);
    parseInt(maxprice);
    console.log(sk);
    console.log(minyear);
    console.log(maxyear);
    console.log(minprice);
    console.log(maxprice);
    Car.find({
            $and: [
                {
                    $and: [
                        {year: {$gte: minyear}},
                        {year: {$lte: maxyear}},
                    ]
                },
                {
                    $and: [
                        {price: {$gte: minprice}},
                        {price: {$lte: maxprice}},
                    ]
                },
                {
                    $or: [
                        {make: {$regex: sk}},
                        {model: {$regex: sk}},
                    ]
                }
                ]
        },
        (err, data) => {
            if (err) {
                console.log("search error");
                res.send({
                    "message": "error",
                    "data": []
                })
            } else {
                //console.log(data);
                res.send({
                    "message": "success",
                    "data": data
                })
            }
        });
});