const durationAndDistance = []

function initMap(option) {
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    // ADDTASK MAP
    var addTaskMaps = new google.maps.Map(document.querySelector(".createTaskItemContainer_map"), {
        zoom: 8,
        center: {
            lat: 30.0444,
            lng: 31.2357,
        },
        disableDefaultUI: true,
    });

    const addbulkTasks = new google.maps.Map(document.querySelector(".bulk-task-item-map"), {
        zoom: 8,
        center: {
            lat: 30.0444,
            lng: 31.2357,
        },
        disableDefaultUI: true,
    });

    // ADD MARKS ON ADD TASKS MAP
    const getDataAndSetMark = (input, autoComplete, map, title) => {
        google.maps.event.addListener(autoComplete, "place_changed", () => {
            var place = autoComplete.getPlace().geometry.location;
            const lat = place.lat();
            const lng = place.lng();

            const center = new google.maps.LatLng(lat, lng);
            map.panTo(center);

            const addMarker = new google.maps.Marker({
                position: {
                    lat,
                    lng,
                },
                map,
                title,
            });

            if (input.name === "taskPickUpAddress") {
                input.setAttribute("lng", lng);
                input.setAttribute("lat", lat);

                addTaskMapArr[0] = {
                    place: input.value,
                    lng: lng,
                    lat: lat,
                };
                addTaskMapArrMarkers[0] = addMarker;
            }

            if (input.name === "taskDeliveryAddress") {
                input.setAttribute("lng", lng);
                input.setAttribute("lat", lat);

                addTaskMapArr[1] = {
                    place: input.value,
                    lng: lng,
                    lat: lat,
                };
                addTaskMapArrMarkers[1] = addMarker;
            }

            directionsRendererTwo.setMap(addTaskMaps);

            function calculateAndDisplayRoute(directionsService, directionsRenderer) {
                directionsService.route({
                        origin: addTaskMapArr[0],
                        destination: addTaskMapArr[1],
                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (response, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(response);
                        } else {
                            window.alert("Directions request failed due to " + status);
                        }
                    }
                );
            }

            if (addTaskMapArr.length === 2) {
                addTaskMapArrMarkers.forEach((marker) => marker.setMap(null));
                calculateAndDisplayRoute(directionsService, directionsRendererTwo);
                distanceMatrixService.getDistanceMatrix({
                        origins: [addTaskMapArr[0].place],
                        destinations: [addTaskMapArr[1].place],
                        travelMode: "DRIVING",
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        drivingOptions: {
                            departureTime: new Date(Date.now()), // for the time N milliseconds from now.
                            trafficModel: "pessimistic",
                        },
                        avoidTolls: false,
                    },
                    (res, status) => {
                        document.querySelector("#taskDurationInSec").value =
                            res.rows[0].elements[0].duration_in_traffic.value;
                        document.querySelector("#taskDistance").value =
                            res.rows[0].elements[0].distance.value;
                    }
                );
            }
        });
    };

    // AUTOCOMPLETE MAP SEARCH INPUT
    var dropOffInput = document.querySelector("#taskDeliveryAddress");
    var autocompletedropOffInput = new google.maps.places.Autocomplete(dropOffInput);

    var pickupPoint = document.querySelector("#taskPickUpAddressSearchInput");
    var autocompletePickUp = new google.maps.places.Autocomplete(pickupPoint);

    // RESTRICT SEARCH TO EGYPT ONLY
    autocompletedropOffInput.setComponentRestrictions({
        country: ["eg"],
    });
    autocompletePickUp.setComponentRestrictions({
        country: ["eg"],
    });

    // RUN
    getDataAndSetMark(pickupPoint, autocompletePickUp, addTaskMaps, "Pick Up point");
    getDataAndSetMark(dropOffInput, autocompletedropOffInput, addTaskMaps, "Pick Up point");

    if (option) {
        if (option.getLatLng = true) {
            const pickupLng = parseFloat(option.pickupLng)
            const pickupLat = parseFloat(option.pickupLat)
            const deliverLng = parseFloat(option.deliverLng)
            const deliverLat = parseFloat(option.deliverLat)
            const options = {
                origins: [{
                    lat: pickupLng,
                    lng: pickupLat
                }],
                destinations: [{
                    lat: deliverLng,
                    lng: deliverLat
                }],
                travelMode: "DRIVING",
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: "pessimistic",
                },
                avoidTolls: false,
            }

            distanceMatrixService.getDistanceMatrix(options,
                (res, status) => {
                    const distance = res.rows[0].elements[0].distance.value;
                    const duration = res.rows[0].elements[0].duration_in_traffic.value;
                    option.callback.estTime = duration
                    option.callback.distance = distance
                    db.ref(`users/${uid}/tasks`).push(option.callback)
                }
            );
        }
    }
}

const readExcelFile = () => {
    const getJSON = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetNames = workbook.SheetNames;
        const worksheet = workbook.Sheets[sheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);
        myFileInput.value = null;
        return json
    }

    const validateData = (FileArray) => {
        FileArray.forEach((excelRow) => {
            const taskType = excelRow.taskType

            const pickupName = excelRow.pickupName
            const pickupEmail = excelRow.pickupEmail
            const pickupPhone = excelRow.pickupPhone


            const pickupBefore = moment(excelRow.pickupBefore, "DD/MM/YYYY hh:mm").format("X")
            const pickupOrderId = excelRow.pickupOrderId
            const pickupAddress = excelRow.pickupAddress
            const pickupLat = excelRow.pickupLat
            const pickupLng = excelRow.pickupLng
            const pickupDescription = excelRow.pickupDescription

            const deliverName = excelRow.deliverAddress
            const deliverEmail = excelRow.deliverEmail
            const deliverPhone = excelRow.deliverPhone

            const deliverBefore = moment(excelRow.deliverBefore, "DD/MM/YYYY hh:mm").format("X")
            const deliverOrderId = excelRow.deliverOrderId
            const deliverAddress = excelRow.deliverAddress
            const deliverLat = excelRow.deliverLat
            const deliverLng = excelRow.deliverLng
            const deliverDescription = excelRow.deliverDescription

            const driver = excelRow.driverUsername
            const callback = () => {
                const task = {
                    type: taskType,
                    estTime: "",
                    distance: "",
                    status: -1,
                    pickup: {
                        name: pickupName,
                        email: pickupEmail,
                        phone: pickupPhone,
                        orderId: pickupOrderId,
                        date: pickupBefore,
                        description: pickupDescription ? pickupDescription : "",
                        address: {
                            name: pickupAddress,
                            lat: pickupLat,
                            lng: pickupLng,
                        },
                    },
                    deliver: {
                        name: deliverName,
                        email: deliverEmail,
                        phone: deliverPhone,
                        orderId: deliverOrderId,
                        date: deliverBefore,
                        description: deliverDescription ? deliverDescription : "",
                        address: {
                            name: deliverAddress,
                            lat: deliverLat,
                            lng: deliverLng,
                        },
                    }
                }
                return task
            }
            initMap({
                getLatLng: true,
                pickupLng,
                pickupLat,
                deliverLat,
                deliverLng,
                callback: callback()
            })



        })
        alert("done")
    }

    const myFileInput = document.querySelector("#myFile")
    myFileInput.addEventListener("input", (e) => {
        const files = myFileInput.files
        if (files.lenght === 0) return
        const file = files[0]
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (e) => {
            validateData(getJSON(e))
        }
    })
}

readExcelFile()
addTask();
navigationButtonsActivation()