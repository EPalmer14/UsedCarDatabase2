let carList = [];

function get_car_object(car, idx) {
    return `<li class="list-group-item border-0" style="padding-left:0;" data-m="${car._id}">
                <div class="row ${idx % 2 === 0 ? 'even_row' : 'odd_row'}" style="padding-left:0;">
                    <div class="col-3 justify-content-start">
                        <p>${car.make}</p>
                    </div>
                    <div class="col-3">
                        <p style="padding-left: 1.3%">${car.model}</p>
                    </div>
                    <div class="col-2">
                        <p style="padding-left: 5.5%">${car.year}</p>
                    </div>
                    <div class="col-2">
                        <p style="padding-left: 6%">${car.price}</p>
                    </div>
                    <div class="col-2 buttonDiv">
                        <a type="button" class="btn btn-outline-primary" id="${car.stock_num}">Show More</a>
                    </div>
                </div>
          </li>`
}

function showList(cars) {
    $('#car_list').empty();
    cars.forEach((car, idx) => {
        carList.push(car);
        $('#car_list').append(get_car_object(car, idx));
    });

    $('.buttonDiv').on('click', function () {
        const car_id = $(this).parents('li').attr('data-m');
        location.href = "/detail.html?car_id=" + car_id;
    });
}

$.get("/get_all_cars")
    .done(function (data) {
        if (data.message === "success") {
            showList(data.data);
        }
    });


function sortPrice() {
    carList.sort((a, b) => {
        return a.price - b.price;
    })
    showList(carList);
}

function sortYear() {
    carList.sort((a, b) => {
        return a.year - b.year;
    })
    showList(carList);
}

function sortModel() {
    carList.sort((a, b) => {
        if(a.model < b.model) { return -1; }
        if(a.model > b.model) { return 1; }
        return 0;
    })
    showList(carList);
}

function sortMake() {
    carList.sort((a, b) => {
        if(a.make < b.make) { return -1; }
        if(a.make > b.make) { return 1; }
        return 0;
    })
    showList(carList);
}

function addNewCar() {
    location.href = "edit.html";
}

function searchCar() {
    $.get("/get_cars_by_filters", {
        search_key: $('#search_box').val(),
        min_year: $('#min_year').val(),
        max_year: $('#max_year').val(),
        min_price: $('#min_price').val(),
        max_price: $('#max_price').val()
    }).done((data) => {
        while(carList.length > 0){
            carList.pop();
        }
        //console.log(carList)

        showList(data.data);
    });
}