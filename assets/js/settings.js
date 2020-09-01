function initMap() {
    // ADDTASK MAP
    var addTaskMaps = new google.maps.Map(document.querySelector(".createTaskItemContainer_map"), {
        zoom: 8,
        center: {
            lat: 30.0444,
            lng: 31.2357,
        },
        disableDefaultUI: true,
    });

    // ADD MARKS ON ADD TASKS MAP
    const getDataAndSetMark = (input, autoComplete, map, title) => {
        google.maps.event.addListener(autoComplete, "place_changed", function () {
            var place = autoComplete.getPlace().geometry.location;
            const lat = place.lat();
            const lng = place.lng();

            var center = new google.maps.LatLng(lat, lng);
            map.panTo(center);

            var addMarker = new google.maps.Marker({
                position: {
                    lat,
                    lng,
                },
                map,
                title,
            });

            input.setAttribute("lng", lng);
            input.setAttribute("lat", lat);
        });
    };

    // AUTOCOMPLETE MAP SEARCH INPUT FOR PICKUP INPUT
    var pickupPoint = document.querySelector("#taskPickUpAddressSearchInput");
    var autocompletePickUp = new google.maps.places.Autocomplete(pickupPoint);
    autocompletePickUp.setComponentRestrictions({
        country: ["eg"],
    });

    // AUTOCOMPLETE MAP SEARCH INPUT FOR DELIVERY INPUT
    var dropOffInput = document.querySelector("#taskDeliveryAddress");
    var autocompletedropOffInput = new google.maps.places.Autocomplete(dropOffInput);

    // RESTRICT SEARCH TO EGYPT ONLY
    autocompletedropOffInput.setComponentRestrictions({
        country: ["eg"],
    });

    // RUN
    getDataAndSetMark(pickupPoint, autocompletePickUp, addTaskMaps, "Pick Up point");
    getDataAndSetMark(dropOffInput, autocompletedropOffInput, addTaskMaps, "Pick Up point");
}

navigationButtonsActivation()
addTask();