let car = {
    "url": "img",
    "stock_num": "Stock Number",
    "make": "Make",
    "model": "Model",
    "year": "Year",
    "color": "Color",
    "price": "Price"
}

function load_car(car){
    $('#i_url').attr('src', car.url);
    $('#i_stock_num').text(car.stock_num);
    $('#i_make').text(car.make);
    $('#i_model').text(car.model);
    $('#i_year').text(car.year);
    $('#i_color').text(car.color);
    $('#i_price').text(car.price);
}

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let car_id = urlParams.get('car_id');
    if (car_id) {
        $.get('/get_car_by_id?car_id=' + car_id)
            .done(function (data) {
                if (data["message"] === "success") {
                    car = data["data"];
                    console.log(car);
                    load_car(car);
                }
            });
    }
});

function onEdit() {
    location.href = "/edit.html?car_id=" + car._id;
}

function onDelete() {
    $.post('/delete_car_by_id', {_id: car._id}).done(
        (data)=>{
            if(data.message === "success"){
                location.href = "/index.html"
            }else{
                console.log("error");
            }
        }

    )
}
