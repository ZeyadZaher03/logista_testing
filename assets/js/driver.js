// check if user and redirect ====================
const uid = Cookies.get("uid");
if (!uid) {
  Cookies.remove("logedin");
  auth.signOut();
} -
auth.onAuthStateChanged((user) => {
  if (!user) {
    Cookies.remove("logedin");
    Cookies.remove("uid");
    window.location.replace("signup.html");
  }
});
// =======================
const popupAreYouSure = (message, btnCancelName, btnDiscardName, callback) => {
  const popupContainer = document.querySelector(".confirmation_contianer_popup")
  const popupMessage = document.querySelector(".confirmation_contianer_popup-message")
  const popupCancelBtn = document.querySelector("#confirmation_contianer_cancel")
  const popupDiscardBtn = document.querySelector("#confirmation_contianer_dicard")

  popupMessage.innerHTML = message
  popupCancelBtn.innerHTML = btnCancelName
  popupDiscardBtn.innerHTML = btnDiscardName

  popupContainer.classList.add("confirmation_contianer_popup--active")

  popupCancelBtn.addEventListener("click", (e) => {
    e.preventDefault()
    popupContainer.classList.remove("confirmation_contianer_popup--active")
    return popupMessage.innerHTML = ""
  })
  popupDiscardBtn.addEventListener("click", (e) => {
    e.preventDefault()
    popupContainer.classList.remove("confirmation_contianer_popup--active")
    popupMessage.innerHTML = ""
    return callback()
  })

}

// function to close module by esc key or button 
const closeElement = (closeBtn, modal, validate) => {
  const selectedModal = document.querySelector(modal)
  const closeModalBtn = document.querySelector(closeBtn)
  const checkValidity = () => {
    if (validate == true) {
      let numOfEmptyInputs = 0;
      selectedModal.querySelectorAll("input").forEach((input) => {
        if (input.value.trim() == "") {
          return numOfEmptyInputs++
        }
      })
      if (numOfEmptyInputs > 0) {
        popupAreYouSure(
          "Are you sure you want to discard this driver??",
          "Cancel",
          "Discard",
          () => {
            selectedModal.style.display = "none"
          })
      }
    }
  }

  if (selectedModal.style.display != "block") {

    closeModalBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (validate == true) {
        checkValidity()
      } else {
        selectedModal.style.display = "none"
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        if (validate == true) {
          checkValidity()
        } else {
          selectedModal.style.display = "none"
        }
      }
    })

  }

}
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

const addDriverForm = document.querySelector(".addDriver_popup-form")
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
  console.log(transportation_type)
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

  console.log(emptyInputs)

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
      tasks: "[]"

    }
    console.log(driver)
    var reader = new FileReader();
    reader.onload = (e) => {
      driver.driverProfileImage = e.target.result
      db.ref(`users/${uid}/drivers/${driverTeam.value}`)
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
  res.forEach((team) => {
    console.log(team)
    console.log(team.val())
    team.forEach((driverData) => {
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
      deleteDriverBtn.addEventListener("click", (e) => {
        e.preventDefault()
        confirmationPopUp.classList.add(confirmationPopUpActiveClass);
        confirmationMessage.innerHTML = "Are you sure you want to remove this driver ?!!"

        const deleteDriverId = deleteDriverBtn.dataset.driver_id
        const deleteDriverTeam = deleteDriverBtn.dataset.driver_team

        // CANCEL CLICKED
        confirmationContianerCancel.innerHTML = "Cancel"
        confirmationContianerCancel.onclick = () => {
          confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
          return confirmationMessage.innerHTML = ""
        }

        // DISCARD CLICKED
        confirmationContianerDiscard.innerHTML = "Delete"
        confirmationContianerDiscard.onclick = () => {
          confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
          confirmationMessage.innerHTML = ""
          // delete form db
          db.ref(`users/${uid}/drivers/${deleteDriverTeam}/${deleteDriverId}`).remove()
            .then(() => {
              popUpMessgeFunction("Driver Has removed successfully", 5, 1)
            })
            .catch((err) => {
              popUpMessgeFunction("something went wronge please try again", 5, 1)
            })
        }

      })
    })
  })
})


// delete drive




// Front-End styling
toggleHideAndShow(
  ".navigation_hamburgerBtn",
  ".hamburger_menu",
  "hamburger_menu--active"
);

toggleHideAndShow(
  ".hamburger_btn-back_container",
  ".hamburger_menu",
  "hamburger_menu--active"
);

// toggleHideAndShow(".pickup_btn", ".pickup_contanier", "ocordion_body--active");

// toggleHideAndShow(
//   ".dropoff_btn",
//   ".dropoff_container",
//   "ocordion_body--active"
// );

toggleHideAndShow(
  ".notification_btn",
  ".notification_nav_container",
  "nav_popup--active"
);

toggleHideAndShow(
  ".menu_navigation_btn",
  ".menu_navigation_container",
  "nav_popup--active"
);

// toggleHideAndShow(
//   ".map_info-col_collaps--tasks",
//   ".map_tasks",
//   "map_col--collapsed",
//   () =>
//   changeIcon(
//     ".map_info-col_icon--tasks",
//     "fa-chevron-left",
//     "fa-chevron-right"
//   )
// );

// toggleHideAndShow(
//   ".map_info-col_collaps--agents",
//   ".map_agents",
//   "map_col--collapsed",
//   () =>
//   changeIcon(
//     ".map_info-col_icon--agents",
//     "fa-chevron-right",
//     "fa-chevron-left"
//   )
// );

tabSystem(
  ".map_info-col__subhead-tasks",
  ".map_info-col__containar-tabTask",
  "map_info-col__subhead-item--active",
  "map_info-col__containar-tabTask--active",
  "tasktab"
);

tabSystem(
  ".map_info-col__subhead-agents",
  ".map_info-col__containar-tabAgnet",
  "map_info-col__subhead-item--active",
  "map_info-col__containar-tabAgnet--active",
  "agentTab"
);

responsiveJs("900px", () => {
  const colTasks = document.querySelector(".map_tasks");
  const colAgents = document.querySelector(".map_agents");
  const colTasksBtn = document.querySelector(".map_info-col_collaps--tasks");
  const colAgentsBtn = document.querySelector(".map_info-col_collaps--agents");

  colTasks.classList.add("map_col--collapsed");
  colAgents.classList.add("map_col--collapsed");

  changeIcon(
    ".map_info-col_icon--tasks",
    "fa-chevron-left",
    "fa-chevron-right"
  );

  changeIcon(
    ".map_info-col_icon--agents",
    "fa-chevron-right",
    "fa-chevron-left"
  );

  colTasksBtn.addEventListener("click", () => {
    colAgents.classList.add("map_col--collapsed");
  });

  colAgentsBtn.addEventListener("click", () => {
    colTasks.classList.add("map_col--collapsed");
  });
});