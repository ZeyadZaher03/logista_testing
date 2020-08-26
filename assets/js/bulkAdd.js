const durationAndDistance = []

function initMap(option) {
    const distanceMatrixService = new google.maps.DistanceMatrixService();

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
            const pickupBefore = excelRow.pickupBefore
            const pickupOrderId = excelRow.pickupOrderId
            const pickupAddress = excelRow.pickupAddress
            const pickupLat = excelRow.pickupLat
            const pickupLng = excelRow.pickupLng
            const pickupDescription = ""

            const deliverName = excelRow.deliverAddress
            const deliverEmail = excelRow.deliverEmail
            const deliverPhone = excelRow.deliverPhone
            const deliverBefore = excelRow.deliverBefore
            const deliverOrderId = excelRow.deliverOrderId
            const deliverAddress = excelRow.deliverAddress
            const deliverLat = excelRow.deliverLat
            const deliverLng = excelRow.deliverLng
            const deliverDescription = ""

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