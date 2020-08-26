const dbPolyies = []
const numOfPolygonsMade = []
const addFenceForm = document.querySelector(".geofence-form")
const addGeoFenceButton = document.querySelector(".add-geofence")
const drawFenceButton = document.querySelector(".draw")

const initMap = (mapOptions) => {
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

const deleteGeoFence = () => {
    const deleteButtons = document.querySelectorAll(".deleteGeoFence")
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
            const shouldDelete = confirm("Are you Sure You want to delete this geoFence")
            if (shouldDelete) {
                db.ref(`users/${uid}/geoFences/${deleteButton.dataset.id}`).remove()
            }
        })
    })
}

const getGeoFences = () => {
    db.ref(`users/${uid}/geoFences`).on("value", (snapshot) => {
        dbPolyies.splice(0, dbPolyies.length)
        const geoFencesContainer = document.querySelector(".fences-container-items")
        geoFencesContainer.innerHTML = ""

        snapshot.forEach((childSnapshot) => {
            const geoFence = childSnapshot.val()
            const id = childSnapshot.key
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
            const geoFenceDeleteButton = document.createElement("button")

            geoFenceItem.classList.add("geofence-item")

            geoFenceName.innerHTML = name
            geoFenceName.classList.add("geofence-item-name")

            geoFenceDeleteButton.innerHTML = "Delete"
            geoFenceDeleteButton.classList.add("deleteGeoFence")
            geoFenceDeleteButton.dataset.id = id

            geoFenceItem.appendChild(geoFenceName)
            geoFenceItem.appendChild(geoFenceDeleteButton)
            geoFencesContainer.append(geoFenceItem)
        })
        initMap()
        deleteGeoFence()
    })
}

const addFence = () => {
    const fenceColor = document.querySelector("#color")
    const fenceName = document.querySelector("#name")
    const addFence = () => {
        if (numOfPolygonsMade.length == 0) {
            alert("plase add fence")
        } else if (fenceName.value.trim() == "") {
            alert("plase add fence name")
        } else {
            db.ref(`users/${uid}/geoFences`).push({
                color: fenceColor.value,
                name: fenceName.value,
                cords: numOfPolygonsMade[0]
            })
            numOfPolygonsMade.splice(0, numOfPolygonsMade.length)
            addFenceForm.reset()
        }
    }
    addFenceForm.addEventListener("submit", (e) => {
        e.preventDefault()
        addFence()
    })

    addGeoFenceButton.addEventListener("click", (e) => {
        e.preventDefault()
        addFence()
    })
}

drawFenceButton.addEventListener("click", (e) => {
    e.preventDefault()
    initMap({
        mode: "addFence"
    })
})

getGeoFences()
addFence()
hamburgerMenu()