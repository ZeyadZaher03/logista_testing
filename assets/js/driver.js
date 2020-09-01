// check if user and redirect =============
if (!uid) {
  Cookies.remove("logedin");
  auth.signOut();
}
auth.onAuthStateChanged((user) => {
  if (!user) {
    Cookies.remove("logedin");
    Cookies.remove("uid");
    window.location.replace("signup.html");
  }
});

// ========================================
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
// ===============

const addDriverForm = document.querySelector(".addDriver_popup-form")
const popUpMessage = document.querySelector(".popup_message");
const getTeams = () => {
  const creatOptions = (snapshot) => {
    const team = snapshot.val()
    const id = snapshot.key
    const name = team.name
    return `<option value=${id}>${name}</option>`
  }

  db.ref(`users/${uid}/teams`).on("value", (snapshot) => {
    const teamsOption = addDriverForm["driverTeam"]
    teamsOption.innerHTML = ""
    const numOfFences = snapshot.numChildren()
    if (!!numOfFences) {
      teamsOption.innerHTML = `<option value="" disabled selected>Please Select A Team</option>`
    } else {
      teamsOption.innerHTML = `<option value="" disabled selected >you Have no Teams</option>`
    }
    snapshot.forEach(geoFenceSnapshot => {
      teamsOption.innerHTML += creatOptions(geoFenceSnapshot)
    });
  })
}

const popUpMessgeFunction = (message, delay, status) => {
  popUpMessage.innerHTML = message;
  popUpMessage.classList.add(`popup_message--${status == 1 ? "succ" : "err"}`);
  popUpMessage.style.display = "block";
  setTimeout(() => {
    popUpMessage.style.display = "none";
    popUpMessage.innerHTML = "";
  }, delay * 1000);
}



const confirmationPopUp = document.querySelector(".confirmation_contianer_popup")
const confirmationPopUpActiveClass = "confirmation_contianer_popup--active"
const confirmationMessage = confirmationPopUp.querySelector(".confirmation_contianer_popup-message");
const confirmationContianerCancel = confirmationPopUp.querySelector("#confirmation_contianer_cancel")
const confirmationContianerDiscard = confirmationPopUp.querySelector("#confirmation_contianer_dicard")
const addDriverPopup = document.querySelector(".addDriver_popup")
const addDriverPopupContainer = document.querySelector(".addDriver_popup-container")

// Drivers
driverProfileIMageFormView = () => {
  const profileInput = document.querySelector("#driver_proile_picture");
  profileInput.addEventListener("change", () => {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector(".profile_imageContent img").src = e.target.result;
    };
    reader.readAsDataURL(profileInput.files[0]);
  });
}

const closeDriverModuleAnimation = () => {
  anime({
    opacity: ["0", "1"],
    duration: 200,
    easing: 'easeInOutQuad',
    complete() {
      addDriverPopup.style.display = "none"
    }
  })
  anime({
    targets: ".addDriver_popup-container",
    opacity: ["1", "0"],
    duration: 200,
    easing: 'easeInOutQuad',
    complete() {
      addDriverPopupContainer.style.display = "none"
    }
  })
}

const addDriver = () => {
  addDriverForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const driverFirstName = addDriverForm["driverFirstName"];
    const driverLastName = addDriverForm["driverLastName"];

    const driverEmail = addDriverForm["driverEmail"];
    const driverPhoneNumber = addDriverForm["driverPhoneNumber"];
    const driverUsername = addDriverForm["driverUsername"];

    const driverPassword = addDriverForm["driverPassword"];
    const driverRole = addDriverForm["driverRole"].options[addDriverForm["driverRole"].selectedIndex];
    const driverTeam = addDriverForm["driverTeam"].options[addDriverForm["driverTeam"].selectedIndex];
    const driverAddress = addDriverForm["driverAddress"];
    const driverProfileImage = addDriverForm["driver_proile_picture"];
    const transportation_type = addDriverForm["transportation_type"];


    let isExistingUsername = false
    let shortUsername = false
    let notPhoneNumber = false
    let notValidEmail = false
    let shortPassword = false

    let emptyinputs = 0

    const emptyErorrMessages = () => {
      document.querySelectorAll(".driver-add-error").forEach((input) => {
        input.innerHTML = ""
      })
    }

    const validateWhatsCantBeEmpty = () => {
      if (!(driverFirstName.value)) {
        const errorFirstName = driverFirstName.parentElement.querySelector(".driver-add-error")
        errorFirstName.innerHTML = "Please add Driver's First Name"
        emptyinputs = 1
      }
      if (!(driverLastName.value)) {
        const errorLastName = driverLastName.parentElement.querySelector(".driver-add-error")
        errorLastName.innerHTML = "Please add Driver's Last Name"
        emptyinputs++
      }
      if (!(driverTeam.value)) {
        const errorTeam = driverTeam.parentElement.parentElement.querySelector(".driver-add-error")
        errorTeam.innerHTML = "Please Select a team"
        emptyinputs++
      }
      if (!(driverAddress.value)) {
        const errorAddress = driverAddress.parentElement.querySelector(".driver-add-error")
        errorAddress.innerHTML = "Please add Driver Addrss"
        emptyinputs++
      }
      if (!(transportation_type.value)) {
        console.log(transportation_type.value)
        const errorTranportation = transportation_type[0].parentElement.parentElement.querySelector(".driver-add-error")
        errorTranportation.innerHTML = "Please add Trasportation type"
        emptyinputs++
      }
      if (!(driverProfileImage.value)) {
        const errorTranportation = driverProfileImage.parentElement.querySelector(".driver-add-error")
        errorTranportation.innerHTML = "Please add Driver's Image"
        emptyinputs++
      }
    }

    const validateUsername = async () => {
      const usernames = []
      const usernameValue = driverUsername.value
      const errorUserName = driverUsername.parentElement.querySelector(".driver-add-error")

      // username cant be less than 6 character
      if (usernameValue.length < 6) {
        errorUserName.innerHTML = "Please username must be 6 or more characters"
        shortUsername = true
      }

      // username be the same
      await db.ref(`users/${uid}/drivers`).once("value", (driversSnapshot) => {
        driversSnapshot.forEach(driverSnapshot => usernames.push(driverSnapshot.val().driverUsername));
        const sameUsername = usernames.filter((username) => username == usernameValue)
        if (sameUsername.length != 0) isExistingUsername = true
      })
    }

    const validateMobileNumber = () => {
      const phoneNumber = driverPhoneNumber.value
      const phoneRegex = /(01)[0-9]{9}/
      const validator = phoneNumber.match(phoneRegex)
      const errorPhone = driverPhoneNumber.parentElement.querySelector(".driver-add-error")
      if (!validator) {
        errorPhone.innerHTML = "Please add a valid phone number"
        notPhoneNumber = true
      }
    }

    const validatePassword = () => {
      const passwordLength = driverPassword.value.length
      if (passwordLength < 8) {
        const errorPassword = driverPassword.parentElement.querySelector(".driver-add-error")
        errorPassword.innerHTML = "password must be more than 8 characters"
        shortPassword = true
      }
    }

    const validateEmail = () => {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const email = driverEmail.value
      if (!(email.match(emailRegex))) {
        notValidEmail = true
        const errorEmail = driverEmail.parentElement.querySelector(".driver-add-error")
        errorEmail.innerHTML = "Please Write a valid Email address"
      }
    }

    emptyErorrMessages()

    validateEmail()
    validatePassword()
    validateUsername()
    validateMobileNumber()
    validateWhatsCantBeEmpty()

    if (isExistingUsername) {
      const errorUserName = driverUsername.parentElement.querySelector(".driver-add-error")
      errorUserName.innerHTML = "username is already taken"
    }

    if (emptyinputs !== 0 || isExistingUsername || shortUsername || notPhoneNumber || shortPassword || notValidEmail) return

    const storageRef = firebase.storage().ref()
    const file = driverProfileImage.files[0]
    const fileName = `${new Date()}_${file.name}`
    const metaData = {
      contentType: file.type,
    }
    const driverImageUrl = await storageRef
      .child(fileName)
      .put(file, metaData)
      .then(async (snapshot) => await snapshot.ref.getDownloadURL())

    const driverObject = {
      driverFirstName: driverFirstName.value,
      driverLastName: driverLastName.value,
      driverEmail: driverEmail.value,
      driverPhoneNumber: driverPhoneNumber.value,
      driverUsername: driverPhoneNumber.value,
      driverPassword: driverPassword.value,
      driverRole: driverRole.value,
      driverTeam: {
        value: driverTeam.value,
        name: driverTeam.innerHTML,
      },
      driverStatus: 0,
      driverAddress: driverAddress.value,
      driverTransportation: transportation_type.value,
      driverProfileImage: driverImageUrl,
      taskId: 0,
    }
    db.ref(`users/${uid}/drivers`).push(driverObject).then(() => {
      closeDriverModuleAnimation()
    })

  })
}

const openAddDriverModule = () => {
  const addDriverBtn = document.querySelector("#addDriverBtn")
  const addDriverPopupContainer = document.querySelector(".addDriver_popup-container")
  const addDriverPopup = document.querySelector(".addDriver_popup")

  addDriverBtn.addEventListener("click", (e) => {
    e.preventDefault()
    addDriverPopupContainer.style.display = "flex"
    addDriverPopup.style.display = "block"
    anime({
      targets: ".addDriver_popup-container",
      opacity: ["0", "1"],
      duration: 200,
      easing: 'easeInOutQuad'
    })
    anime({
      targets: ".addDriver_popup",
      translateY: ["-20%", "0"],
      opacity: ["0", "1"],
      duration: 500,
      easing: 'easeInOutQuad'
    })
  })

}

const closeAddDriverModule = () => {
  const closeDriverBtn = document.querySelector("#closeAddDriverModal")
  closeByButton(closeDriverBtn, closeDriverModuleAnimation)
  closeByEscape(closeDriverModuleAnimation)
}

const readDrivers = () => {
  db.ref(`users/${uid}/drivers`).on("value", (res) => {
    document.querySelector(".driver_container-content_container").innerHTML = ""
    res.forEach((driverData) => {
      const driver = driverData.val()
      const driverId = driverData.key
      const driverFirstName = driver.driverFirstName
      const driverLastName = driver.driverLastName
      const driverPhoneNumber = driver.driverPhoneNumber
      const driverTeam = driver.driverTeam.name
      const driverTeamValue = driver.driverTeam.value

      function getStatus() {
        if (driver.status == -1) return "inactive"
        else if (driver.status = 0) return "Free"
        else if (driver.status = 1) return "busy"
      }

      const driverItem = `<div class="driver_container-content-item">
            <p>${driverFirstName} ${driverLastName}</p>
            <p>${driverPhoneNumber}</p>
            <p>${driverTeam}</p>
            <p>${getStatus()}</p>
            <button data-driver_team=${driverTeamValue} data-driver_id=${driverId} id="editDriver">Edit</button>
            <button data-driver_team=${driverTeamValue} data-driver_id=${driverId} id="removeDriver" class="delete-driver-driverlist">Remove</button>
          </div>`

      document.querySelector(".driver_container-content_container").innerHTML += driverItem
      deleteDriver()

    })
  })
  const deleteDriver = () => {
    const deleteDriverBtns = document.querySelectorAll(".delete-driver-driverlist")
    deleteDriverBtns.forEach((deleteDriverBtn) => {
      deleteDriverBtn.addEventListener("click", () => {
        const deleteDriverId = deleteDriverBtn.dataset.driver_id
        popupAreYouSure(
          "Are you sure you want to Delete this driver??",
          "Cancel",
          "Delete",
          () => {
            db.ref(`users/${uid}/drivers/${deleteDriverId}`)
              .remove()
              .then(() => popUpMessgeFunction("Driver Has removed successfully", 5, 1))
              .catch(() => popUpMessgeFunction("something went wronge please try again", 5, 1))
          })
      })

    })

  }
}

driverProfileIMageFormView()
getTeams()
closeAddDriverModule()
openAddDriverModule()
readDrivers()
addDriver()

// Front-End styling
navigationButtonsActivation()
addTask();
responsiveJs("900px", () => {
  const colTasks = document.querySelector(".map_tasks");
  const colAgents = document.querySelector(".map_agents");
  const colTasksBtn = document.querySelector(".map_info-col_collaps--tasks");
  const colAgentsBtn = document.querySelector(".map_info-col_collaps--agents");

  colTasks.classList.add("map_col--collapsed");
  colAgents.classList.add("map_col--collapsed");

  changeIcon(".map_info-col_icon--tasks", "fa-chevron-left", "fa-chevron-right");
  changeIcon(".map_info-col_icon--agents", "fa-chevron-right", "fa-chevron-left");

  colTasksBtn.addEventListener("click", () => colAgents.classList.add("map_col--collapsed"));
  colAgentsBtn.addEventListener("click", () => colTasks.classList.add("map_col--collapsed"));
});