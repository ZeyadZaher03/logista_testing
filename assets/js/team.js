const getGeoFences = () => {

    const creatOptions = (snapshot) => {
        const geoFence = snapshot.val()
        const id = snapshot.key
        const name = geoFence.name
        return `<option data-id=${id}>${name}</option>`
    }
    db.ref(`users/${uid}/geoFences`).on("value", (snapshot) => {
        document.querySelector("#geoFence").innerHTML = ""
        const numOfFences = snapshot.numChildren()
        if (!!numOfFences) {
            document.querySelector("#geoFence").innerHTML = `<option value="" disabled selected>Please Select A GeoFence</option>`
        } else {
            document.querySelector("#geoFence").innerHTML = `<option value="" disabled selected >you Have no Geo Fences</option>`
        }
        snapshot.forEach(geoFenceSnapshot => {
            document.querySelector("#geoFence").innerHTML += creatOptions(geoFenceSnapshot)
        });
    })
}

const readTeams = () => {
    const creatDriverItem = (snapshot) => {
        const team = snapshot.val()
        const id = snapshot.key
        const name = team.name
        const geoFenceName = team.geoFence.name

        const teamItem = document.createElement("tr")

        const teamName = document.createElement("td")
        const teamGeoFence = document.createElement("td")
        const teamButtonContainer = document.createElement("td")

        const deleteButton = document.createElement("button")
        const editButton = document.createElement("button")

        deleteButton.innerHTML = "delete"
        editButton.innerHTML = "edit"
        deleteButton.dataset.id = id
        deleteButton.classList.add('deleteTeam')


        teamName.innerHTML = name
        teamGeoFence.innerHTML = geoFenceName

        teamItem.appendChild(teamName)
        teamItem.appendChild(teamGeoFence)
        teamItem.appendChild(teamButtonContainer)

        teamButtonContainer.appendChild(deleteButton)
        teamButtonContainer.appendChild(editButton)

        return teamItem
    }
    db.ref(`users/${uid}/teams`).on("value", (snapshot) => {
        document.querySelector("#teamsContainer").innerHTML = ""
        snapshot.forEach((childSnapshot) => {
            document.querySelector("#teamsContainer").appendChild(creatDriverItem(childSnapshot))
            deleteTeam()
        })
    })
}

const deleteTeam = () => {
    const deleteButtons = document.querySelectorAll(".deleteTeam")
    deleteButtons.forEach((deleteButton) => {
        const id = deleteButton.dataset.id
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault()
            db.ref(`users/${uid}/teams/${id}`).remove()
        })
    })
}

const addingTeam = () => {
    const addTeamForm = document.querySelector("#addTeamForm")
    const submitTeamForm = document.querySelector("#addTeam")

    const nameInput = addTeamForm["name"]
    const hourRateInput = addTeamForm["name"]
    const startTimeInput = addTeamForm["start"]
    const endTimeInput = addTeamForm["end"]
    const geoFenceSelect = addTeamForm["geoFence"]

    const openButton = document.querySelector(".button-addnewThing")
    const closeButton = document.querySelector(".addTeam-close")

    const backgroundShade = document.querySelector("#taskDetailsPopup_bgshade")
    const addTeamContainer = document.querySelector(".addTeamContainer")

    const openTeamAnimation = () => {
        backgroundShade.style.display = "flex"
        anime({
            targets: "#taskDetailsPopup_bgshade",
            opacity: ['0', '1'],
            duration: 300,
            easing: "easeInQuad",
            complete() {
                addTeamContainer.style.display = "flex"
                anime({
                    targets: ".addTeamContainer",
                    top: ['-150px', '0px'],
                    opacity: ['0', '1'],
                    duration: 500,
                    easing: "easeInOutQuad",
                })
            }
        })
    }

    const closeTeamAnimation = () => {
        anime({
            targets: ".addTeamContainer",
            top: ['0px', '-150px'],
            opacity: ['1', '0'],
            duration: 300,
            easing: "easeInOutQuad",
            complete() {
                addTeamContainer.style.display = "none"
                anime({
                    targets: "#taskDetailsPopup_bgshade",
                    opacity: ['1', '0'],
                    duration: 200,
                    easing: "easeInQuad",
                    complete() {
                        backgroundShade.style.display = "none"
                    }
                })
            }
        })
    }

    const closeAddTeam = () => {
        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape") closeTeamAnimation()
        })
        closeButton.addEventListener("click", () => closeTeamAnimation())
    }

    const openAddTeam = () => {
        openButton.addEventListener("click", () => openTeamAnimation())
    }

    const teamObj = () => {
        const name = nameInput.value
        const geoFenceId = geoFenceSelect.options[geoFence.selectedIndex].dataset.id
        const geoFenceName = geoFenceSelect.options[geoFence.selectedIndex].value
        const hourlyRate = hourRateInput.value
        const startTime = startTimeInput.value
        const endTime = endTimeInput.value

        return {
            name,
            hourlyRate,
            startTime,
            endTime,
            geoFence: {
                id: geoFenceId,
                name: geoFenceName
            }
        }
    }

    const addTeamToDb = () => db.ref(`users/${uid}/teams`).push(teamObj())

    const validateTeamData = () => {

    }

    const addTeam = () => {
        addTeamForm.addEventListener("submit", (e) => e.preventDefault())
        submitTeamForm.addEventListener("click", (e) => {
            e.preventDefault()
            addTeamToDb()
            closeTeamAnimation()
        })
    }

    closeAddTeam()
    openAddTeam()
    addTeam()
}

readTeams()
getGeoFences()
navigationButtonsActivation()
addingTeam()