const cityList = document.querySelector(".my-select-options_lite"),
    dropList = document.querySelector(".my-select-drop_lite"),
    buttonDropList = document.querySelector(".my-select-result_lite"),
    warehouseList = document.querySelector("#np_warehouse_lite"),
    label = document.querySelector("#werehouse_label_lite"),
    search = document.querySelector("#my_select_search_field_lite");

dropList.style.display = "none";
warehouseList.style.display = "none";
label.style.display = "block";

const filterCityList = () => {
    const cityName = document.querySelectorAll(".my-select-option_lite");
    search.addEventListener("input", () => {
        cityName.forEach(city => {
            if ( city.innerHTML.slice(0, search.value.length).toLowerCase() !== search.value.toLowerCase() ) {
                city.style.display = "none";
            } else {
                city.style.display = "block";
            }
        })
    })
}

cityList.addEventListener("click", ( event ) => {
    if ( event.target &&
        event.target.classList.contains("my-select-option_lite") ) {
        console.log(event.target.innerHTML);

        getWarehousesCatalog(event.target.getAttribute('data-value'));

        buttonDropList.innerHTML = event.target.innerHTML;
        dropList.style.display = "none";
        dropList.classList.remove("close");
        dropList.classList.add("active");
    }
})

buttonDropList.addEventListener("click", () => {
    if ( dropList.style.display === "none" ) {
        dropList.style.display = "block";
        dropList.classList.remove("active");
        dropList.classList.add("close");
    } else {
        dropList.style.display = "none";
        dropList.classList.remove("close");
        dropList.classList.add("active");
    }

})

const renderCityList = ( city, ref ) => {
    let next = document.createElement("div");
    next.innerHTML = `<div class="my-select-option_lite" data-value=${ ref } style="display: block;">${ city }</div>`;
    cityList.append(next);
}

const renderWarehouseList = ( warehouse ) => {
    let newOption = new Option(warehouse);
    warehouseList.append(newOption);
}

function getCitiesCatalog() {
    let result = {};
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "https://api.novaposhta.ua/v2.0/json/",
        data: JSON.stringify({
            "modelName": "Address",
            "calledMethod": "getCities",
            "apiKey": "4669dc413997b38dfc994ba113745403"
        }),
        success: function ( response ) {
            let l = response.data.length;
            for (let i = 0; i < l; i++) {
                response.data[i].value = response.data[i]["Description"];
                response.data[i].label = response.data[i]["Description"];
            }
            result = response.data;
        }
    });
    for (let i = 0; i < result.length; i++) {
        renderCityList(result[i].Description, result[i].Ref);
    }
    filterCityList();

}

function getWarehousesCatalog( refCity ) {
    let result = {};
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "https://api.novaposhta.ua/v2.0/json/",
        data: JSON.stringify({
            "modelName": "AddressGeneral",
            "calledMethod": "getWarehouses",
            "apiKey": "4669dc413997b38dfc994ba113745403",
            "methodProperties": {
                "CityRef": refCity
            }
        }),
        success: function ( response ) {
            let l = response.data.length;
            for (let i = 0; i < l; i++) {
                response.data[i].value = response.data[i]["Description"];
                response.data[i].label = response.data[i]["Description"];
            }
            result = response.data;
            warehouseList.innerHTML = '';

            if ( result.length > 0 ) {
                warehouseList.style.display = "block";
                label.style.display = "none";
                for (let i = 0; i < result.length; i++) {
                    renderWarehouseList(result[i].Description);
                }
            } else {
                warehouseList.style.display = "none";
                label.innerHTML = "Немає доступних відділень"
                label.style.display = "block";
            }
        }
    });
    return result;
}

getCitiesCatalog();












