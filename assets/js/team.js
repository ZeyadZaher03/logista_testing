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
            document.querySelector("#geoFence").innerHTML = `<option value="" disabled selected>Please Select A driver</option>`
        } else {
            document.querySelector("#geoFence").innerHTML = `<option value="" disabled selected >you Have no Geo Fences</option>`
        }
        snapshot.forEach(geoFenceSnapshot => {
            document.querySelector("#geoFence").innerHTML += creatOptions(geoFenceSnapshot)
        });
    })
}

const addTeam = () => {
    const addTeam = document.querySelector("#addTeamForm")
    const addTeamButton = document.querySelector("#addTeam")
    addTeam.addEventListener("submit", (e) => e.preventDefault())
    addTeamButton.addEventListener("click", (e) => {
        e.preventDefault()
        const name = document.querySelector("#name").value
        const geoFence = document.querySelector("#geoFence")
        const team = {
            name: name,
            geoFence: {
                id: geoFence.options[geoFence.selectedIndex].dataset.id,
                name: geoFence.options[geoFence.selectedIndex].value,
            }
        }
        db.ref(`users/${uid}/drivers`).push(team)
    })
}

const readTeams = () => {
    const creatDriverItem = (snapshot) => {
        const team = snapshot.val()
        const id = snapshot.key
        const name = team.name
        const geoFenceName = team.geoFence.name

        const teamItem = document.createElement("div")
        const teamName = document.createElement("p")
        const teamGeoFence = document.createElement("p")
        const teamButton = document.createElement("button")
        teamButton.classList.add("deleteTeam")

        teamName.innerHTML = name
        teamGeoFence.innerHTML = geoFenceName
        teamButton.innerHTML = "DELETE"
        teamButton.dataset.id = id

        teamItem.appendChild(teamName)
        teamItem.appendChild(teamGeoFence)
        teamItem.appendChild(teamButton)

        return teamItem
    }
    db.ref(`users/${uid}/drivers`).on("value", (snapshot) => {
        document.querySelector("#addTeam").innerHTML = ""
        snapshot.forEach((childSnapshot) => {
            document.querySelector("#addTeam").appendChild(creatDriverItem(childSnapshot))
            deleteTeam()
        })
    })
}

const deleteTeam = () => {
    const deleteButtons = document.querySelectorAll(".deleteTeam")
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault()
            console.log(deleteButton.dataset.id)
            db.ref(`users/${uid}/drivers/${deleteButton.dataset.id}`).remove()
        })
    })
}

getGeoFences()
readTeams()
addTeam()