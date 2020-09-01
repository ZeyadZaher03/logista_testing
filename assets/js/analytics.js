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

const tasksInput = document.querySelector("#tasks")
const completed_tasksInput = document.querySelector("#completed_tasks")
const awaited_tasksInput = document.querySelector("#awaited_tasks")
const unAssigned_tasks = document.querySelector("#unAssigned_tasks")
const driversInput = document.querySelector("#drivers")
const offline_driversInput = document.querySelector("#offline_drivers")
const busy_driversInput = document.querySelector("#busy_drivers")
const free_driversInput = document.querySelector("#free_drivers")
const geoFencesInput = document.querySelector("#geoFences")
const teamsInput = document.querySelector("#teams")
const teams_driver = document.querySelector("#teams_driver")

// number of tasks - completed / not assigned / assigned 
const getTasks = async () => {
    const tasks = await db.ref(`users/${uid}/tasks`)
    tasks.on("value", async (snapshot) => {
        const completed = []
        const assigned = []
        const unAssigned = []
        snapshot.forEach((task) => {
            const taskStatus = task.val().status
            if (taskStatus === -1) completed.push(task)
            if (taskStatus === 0) assigned.push(task)
            if (taskStatus === 1) unAssigned.push(task)
        })
        const tasksValues = await snapshot.val()
        const tasksNum = await snapshot.numChildren()
        tasksInput.innerHTML = tasksNum
        completed_tasksInput.innerHTML = completed.length
        awaited_tasksInput.innerHTML = assigned.length
        unAssigned_tasks.innerHTML = unAssigned.length
    })
}
getTasks()
// number of driver - idle / busy / free
const getDrivers = async () => {
    const drivers = await db.ref(`users/${uid}/drivers`)
    drivers.on("value", async (snapshot) => {
        // const driversValues = await snapshot
        const driverByTeam = {}
        const driversNum = await snapshot.numChildren()
        const offline = []
        const busy = []
        const free = []
        snapshot.forEach((driver) => {
            const driverStatus = driver.val().driverStatus
            const driverTeamId = driver.val().driverTeam.value
            // driverByTeam[driverTeamId] ? undefined : driverByTeam[driverTeamId] = []
            // driverByTeam[driverTeamId].push(driver)
            if (driverStatus === -1) {
                offline.push(driver)
            }
            if (driverStatus === 0) {
                busy.push(driver)
            }
            if (driverStatus === 1) {
                free.push(driver)
            }
        })

        driversInput.innerHTML = driversNum
        offline_driversInput.innerHTML = offline.length
        busy_driversInput.innerHTML = busy.length
        free_driversInput.innerHTML = free.length
    })
}
getDrivers()
// number of geo fences
const getGeoFences = async () => {
    const geoFences = await db.ref(`users/${uid}/geoFences`)
    geoFences.on("value", async (snapshot) => {
        const geoFencesValues = await snapshot.val()
        const geoFencesNum = await snapshot.numChildren()
        geoFencesInput.innerHTML = geoFencesNum
    })
}
getGeoFences()
// number of number of teams
const getTeams = async () => {
    const teams = await db.ref(`users/${uid}/teams`)
    const teamByDriver = {}
    await teams.on("value", async (snapshot) => {
        const teamsNum = await snapshot.numChildren()
        const teamsValues = await snapshot.val()
        const drivers = await db.ref(`users/${uid}/drivers`)
        await snapshot.forEach((team) => {
            const teamId = team.key
            const name = team.val().name

            const teamObject = {
                name,
                drivers: []
            }
            teamByDriver[teamId] = teamObject
        })
        drivers.once("value", async (snapshot) => {
            await snapshot.forEach((childSnapshot) => {
                const driver = childSnapshot.val()
                const driverTeamId = driver.driverTeam.value
                teamByDriver[driverTeamId].drivers.push(driver)
            })
        })

        teams_driver.innerHTML = ""
        for (const team in teamByDriver) {
            const teamName = teamByDriver[team].name
            console.log(teamName)
            const drivers = teamByDriver[team].drivers
            const createDriverItem = (driver) => {
                const driverName = driver.driverFirstName
                const driverContainer = document.createElement("div")
                const driverNameEle = document.createElement("p")
                driverNameEle.innerHTML = driverName
                driverContainer.appendChild(driverNameEle)
                return driverContainer
            }

            const teamNameEle = document.createElement("h4")

            teamNameEle.innerHTML = teamName
            teams_driver.appendChild(teamNameEle)
            drivers.forEach((driver) => {
                teams_driver.appendChild(createDriverItem(driver))
            })
        }

        teamsInput.innerHTML = teamsNum

    })
}
getTeams()
// each team driver



navigationButtonsActivation()
addTask();