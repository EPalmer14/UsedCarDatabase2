const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorMessage = urlParams.get('error_message');
const car = JSON.parse(urlParams.get('input'));
const car_id = urlParams.get('car_id');
let current_date = new Date().getFullYear();

function fillCar(car) {
    $('#stock_num').val(car.stock_num);
    $('#make').val(car.make);
    $('#model').val(car.model);
    $('#year').val(car.year);
    $('#color').val(car.color);
    $('#url').val(car.url);
    $('#price').val(car.price);
}

$('form').on('submit', function () {
    if (car_id) {
        $('form').append(() => {
            const input = $('<input>')
                .attr('name', '_id')
                .attr('value', car_id)
            return input;
        });
    }
});

// when user input is rejected, load last input
if (errorMessage) {
    //console.log(car);
    fillCar(car);
    let current = "Car validation failed: "
    if(errorMessage.includes('price')){
        current += "Price must be a valid integer 0 or higher, ";
    }
    if(errorMessage.includes('stock_num')){
        current += "Stock number must be an integer at least 5 digits long, "
    }
    if(errorMessage.includes('year')){
        current += "Year must be after 1900 and before " + current_date + ". ";
    }
    $('#error_message').text(current);
}

if (car_id && !errorMessage) {
    $.get('/get_car_by_id?car_id=' + car_id)
        .done((data) => {
            if (data['message'] === 'success') {
                console.log(data.data);
                fillCar(data.data);
            }
        })
}

"?error_message=Car%20validation%20failed:%20price:%20Cast%20to%20Number%20failed%20for%20value%20%22abc%22%20(type%20string)%20at%20path%20%22price%22,%20stock_num:%20Path%20%60stock_num%60%20(%60145%60)%20is%20shorter%20than%20the%20minimum%20allowed%20length%20(5).,%20year:%20Path%20%60year%60%20(1000)%20is%20less%20than%20minimum%20allowed%20value%20([object%20Object]).&input=%7B%22stock_num%22:%22145%22,%22make%22:%22Toyota%22,%22model%22:%22Carolla%22,%22year%22:%221000%22,%22color%22:%22Silver%22,%22url%22:%22https://images.hgmsites.net/lrg/2017-toyota-corolla-im-cvt-automatic-natl-angular-front-exterior-view_100570615_l.jpg%22,%22price%22:%22abc%22%7D"