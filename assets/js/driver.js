var profileInput = document.querySelector("#driver_proile_picture");
const uid = Cookies.get("uid");
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
      driverTags: [],
      driverTeam: {
        value: driverTeam.value,
        name: driverTeam.innerHTML,
      },
      driverStatus: 0,
      driverAddress: driverAddress.value,
      driverTransportation: transportation_type.value,
      driverProfileImage: "",
      taskId: 0

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