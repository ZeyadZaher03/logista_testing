const dbPolyies = []
const numOfPolygonsMade = []

const deleteF = () => {
    const deleteButtons = document.querySelectorAll(".deleteFe")
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
            console.log(deleteButton.dataset.id)
            db.ref(`users/${uid}/geoFences/${deleteButton.dataset.id}`).remove()
        })
    })
}

const getGeoFences = db.ref(`users/${uid}/geoFences`).on("value", (snapshot) => {
    dbPolyies.splice(0, dbPolyies.length)
    const parent = document.querySelector("#fences")
    parent.innerHTML = ""
    snapshot.forEach((childSnapshot) => {
        const geoFence = childSnapshot.val()
        const name = geoFence.name
        const cords = geoFence.cords
        const color = geoFence.color
        dbPolyies.push({
            name,
            cords,
            color,
        })

        const geoFenceItem = document.createElement("div")
        const geoFenceName = document.createElement("p")
        const geoFenceDelete = document.createElement("button")

        geoFenceName.innerHTML = name
        geoFenceDelete.innerHTML = "delete"
        geoFenceDelete.classList.add("deleteFe")
        geoFenceDelete.dataset.id = childSnapshot.key

        geoFenceItem.appendChild(geoFenceName)
        geoFenceItem.appendChild(geoFenceDelete)
        parent.append(geoFenceItem)
    })
    initMap()
    deleteF()
})

function initMap(mapOptions) {
    // DASHBOARD MAP
    var geoLocation = new google.maps.Map(document.querySelector(".geoLocation"), {
        zoom: 8,
        center: {
            lat: 30.0444,
            lng: 31.2357,
        },
        disableDefaultUI: true,
    });
    const creatPolygon = () => {
        dbPolyies.forEach((polygonData) => {
            const cords = polygonData.cords
            const color = polygonData.color
            const polygon = new google.maps.Polygon({
                paths: cords,
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 4,
                fillColor: color,
                fillOpacity: .2
            });
            polygon.setMap(geoLocation);
        })
    }
    creatPolygon()

    // Services
    const directionsRendererTwo = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    if (mapOptions) {
        if (mapOptions.mode = "addFence") {
            if (numOfPolygonsMade.length == 0) {
                const drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.POLYGON,
                    drawingControl: true,
                    markerOptions: {
                        draggable: true
                    },
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT,
                        drawingModes: [
                            google.maps.drawing.OverlayType.POLYGON,
                        ]
                    },
                    circleOptions: {
                        fillColor: "#ffff00",
                        fillOpacity: 1,
                        strokeWeight: 5,
                        clickable: false,
                        editable: true,
                        zIndex: 1
                    },
                    enableEditing: true
                });

                drawingManager.setMap(geoLocation)
                google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
                    const polygonPoints = []

                    for (var i = 0; i < polygon.getPath().getLength(); i++) {
                        const lat = polygon.getPath().getAt(i).lat()
                        const lng = polygon.getPath().getAt(i).lng()
                        polygonPoints.push({
                            lat,
                            lng
                        })
                    }
                    numOfPolygonsMade.push(polygonPoints)
                });
            }
        }
    }
}

const add = document.querySelector(".add")
const addFence = document.querySelector(".draw")
addFence.addEventListener("click", (e) => {
    e.preventDefault()
    initMap({
        mode: "addFence"
    })
})
add.addEventListener("click", (e) => {
    e.preventDefault()
    if (numOfPolygonsMade.length == 0) return
    db.ref(`users/${uid}/geoFences`).push({
        color: document.querySelector("#color").value,
        name: document.querySelector("#name").value,
        cords: numOfPolygonsMade[0]
    })
})