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

getTeams()


closeElement("#closeAddDriverModal", ".addDriver_popup-container", true)

var profileInput = document.querySelector("#driver_proile_picture");
const popUpMessage = document.querySelector(".popup_message");
profileInput.addEventListener("change", () => {
  var reader = new FileReader();
  reader.onload = function (e) {
    document.querySelector(".profile_imageContent img").src = e.target.result;
  };
  reader.readAsDataURL(profileInput.files[0]);
});

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


addDriverForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const driverFirstName = addDriverForm["driverFirstName"];
  const driverLastName = addDriverForm["driverLastName"];
  const driverEmail = addDriverForm["driverEmail"];
  const driverPhoneNumber = addDriverForm["driverPhoneNumber"];
  const driverUsername = addDriverForm["driverUsername"];
  const driverPassword = addDriverForm["driverPassword"];
  const driverRole = addDriverForm["driverRole"].options[addDriverForm["driverRole"].selectedIndex];
  const driverTags = [];
  const driverTeam = addDriverForm["driverTeam"].options[addDriverForm["driverTeam"].selectedIndex];
  const driverAddress = addDriverForm["driverAddress"];
  const driverProfileImage = addDriverForm["driver_proile_picture"];
  const transportation_type = addDriverForm["transportation_type"];

  const validate = [
    driverFirstName,
    driverLastName,
    driverEmail,
    driverPhoneNumber,
    driverUsername,
    driverPassword,
    driverRole,
    driverTeam,
    driverAddress,
  ]

  let emptyInputs = 0;
  if (driverProfileImage.value == "") {
    transportation_type.forEach((type) => {
      type.parentNode.querySelector("label").classList.add("reg-input_err");
      document.querySelector("#loginErrMessageTwo").innerHTML = "Please add driver picture";
      document.querySelector("#loginErrMessageTwo").classList.add("addTaskErrMessage--active")
      setTimeout(() => {
        document.querySelector("#loginErrMessageTwo").classList.remove("addTaskErrMessage--active")
        document.querySelector("#loginErrMessageTwo").innerHTML = "";
      }, 5000);
    })
    return (emptyInputs += 1);
  }
  if (transportation_type.value = "") {
    transportation_type.forEach((type) => {
      type.parentNode.querySelector("label").classList.add("reg-input_err");
    })
  }

  validate.forEach((input) => {
    if (input.value.trim() == "") {
      input.classList.add("reg-input_err");
      return (emptyInputs += 1);
    }
  });


  if (emptyInputs == 0) {
    const driver = {
      driverFirstName: driverFirstName.value,
      driverLastName: driverLastName.value,
      driverEmail: driverEmail.value,
      driverPhoneNumber: driverPhoneNumber.value,
      driverUsername: driverPhoneNumber.value,
      driverPassword: driverPassword.value,
      driverRole: driverRole.value,
      driverTags: "[]",
      driverTeam: {
        value: driverTeam.value,
        name: driverTeam.innerHTML,
      },
      driverStatus: 0,
      driverAddress: driverAddress.value,
      driverTransportation: transportation_type.value,
      driverProfileImage: "",
      taskId: 0,

    }

    var reader = new FileReader();
    reader.onload = (e) => {
      driver.driverProfileImage = e.target.result
      db.ref(`users/${uid}/drivers`)
        .push(driver)
        .then(() => {
          anime({
            targets: ".addDriver_popup",
            translateY: ["0", "-100%"],
            duration: 400,
            easing: 'easeInOutQuad',
            complete: () => {
              document.querySelector(".addDriver_popup").style.display = "none"
              document.querySelector(".addDriver_popup-container").style.display = "none"
            }
          })
          addDriverForm.reset()
          popUpMessgeFunction("Driver Has been addes successufully", 5, 1)
          document.querySelector(".profile_imageContent img").src = "assets/images/profile_image.jpg";
        })
        .catch(() => {
          popUpMessgeFunction("Driver Hasnt been adde try again", 5, 0)
          document.querySelector(".profile_imageContent img").src = "assets/images/profile_image.jpg";
        })
    };
    reader.readAsDataURL(profileInput.files[0]);

  } else {
    document.querySelector("#addTaskErrorMessage").innerHTML = "Please add driver picture";
    document.querySelector("#addTaskErrorMessage").classList.add("addTaskErrMessage--active")
    setTimeout(() => {
      document.querySelector("#addTaskErrorMessage").classList.remove("addTaskErrMessage--active")
      document.querySelector("#addTaskErrorMessage").innerHTML = "";
    }, 5000);
  }
})

const addDriverBtn = document.querySelector("#addDriverBtn")
const addDriverPopupContainer = document.querySelector(".addDriver_popup-container")
const addDriverPopup = document.querySelector(".addDriver_popup")
addDriverBtn.addEventListener("click", (e) => {
  e.preventDefault()
  addDriverPopupContainer.style.display = "flex"
  addDriverPopup.style.display = "block"
  anime({
    targets: ".addDriver_popup",
    translateY: ["-100%", "0"],
    duration: 800,
    easing: 'easeInOutQuad'
  })
})

// read driver
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
      if (driver.status == -1) {
        return "inactive"
      } else if (driver.status = 0) {
        return "Free"
      } else if (driver.status = 1) {
        return "busy"
      }
    }
    const driverStatus = getStatus();
    const driverItem = `<div class="driver_container-content-item">
          <p>${driverFirstName} ${driverLastName}</p>
          <p>${driverPhoneNumber}</p>
          <p>${driverTeam}</p>
          <p>${driverStatus}</p>
          <button data-driver_team=${driverTeamValue} data-driver_id=${driverId} id="editDriver">Edit</button>
          <button data-driver_team=${driverTeamValue} data-driver_id=${driverId} id="removeDriver">Remove</button>
        </div>`

    document.querySelector(".driver_container-content_container").innerHTML += driverItem
    const deleteDriverBtn = document.querySelector("#removeDriver")
    const deleteDriverId = deleteDriverBtn.dataset.driver_id
    const deleteDriverTeam = deleteDriverBtn.dataset.driver_team

    deleteDriverBtn.addEventListener("click", (e) => {
      e.preventDefault()
      popupAreYouSure(
        "Are you sure you want to Delete this driver??",
        "Cancel",
        "Delete",
        () => {
          db.ref(`users/${uid}/drivers/${deleteDriverTeam}/${deleteDriverId}`)
            .remove()
            .then(() => popUpMessgeFunction("Driver Has removed successfully", 5, 1))
            .catch(() => popUpMessgeFunction("something went wronge please try again", 5, 1))
        })
    })
  })
})


// delete drive




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