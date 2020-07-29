// check if user and redirect ====================
const uid = Cookies.get("uid");
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
// =======================

// consts
const confirmationPopUp = document.querySelector(".confirmation_contianer_popup")
const confirmationPopUpActiveClass = "confirmation_contianer_popup--active"
const confirmationMessage = confirmationPopUp.querySelector(".confirmation_contianer_popup-message");
const confirmationContianerCancel = confirmationPopUp.querySelector("#confirmation_contianer_cancel")
const confirmationContianerDiscard = confirmationPopUp.querySelector("#confirmation_contianer_dicard")
const popUpMessage = document.querySelector(".popup_message");
// LOGOUT ======== 
const logoutBtn = document.querySelector("#logoutBtn");


logoutBtn.addEventListener("click", () => auth.signOut());

popUpMessage.addEventListener("click", () => {
  popUpMessage.style.display = "none";
  Cookies.remove("logedin");
});
// ===============

// initiate the maps ================
function initMap() {
  // DASHBOARD MAP
  var maps = new google.maps.Map(document.querySelector(".map_container"), {
    zoom: 4,
    center: {
      lat: -33,
      lng: 151,
    },
    disableDefaultUI: true,
  });

  // ADDTASK MAP
  var addTaskMaps = new google.maps.Map(
    document.querySelector(".createTaskItemContainer_map"), {
      zoom: 8,
      center: {
        lat: -33,
        lng: 151,
      },
      disableDefaultUI: true,
    }
  );

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
  var autocompletedropOffInput = new google.maps.places.Autocomplete(
    dropOffInput
  );

  // RESTRICT SEARCH TO EGYPT ONLY
  autocompletedropOffInput.setComponentRestrictions({
    country: ["eg"],
  });

  // RUN
  getDataAndSetMark(
    pickupPoint,
    autocompletePickUp,
    addTaskMaps,
    "Pick Up point"
  );
  getDataAndSetMark(
    dropOffInput,
    autocompletedropOffInput,
    addTaskMaps,
    "Pick Up point"
  );

  // SHOWING ROUTES
  // setTimeout(() => {
  //   const pickupPointLng = pickupPoint.getAttribute("lng");
  //   const pickupPointLat = pickupPoint.getAttribute("lat");
  //   const dropOffInputLng = dropOffInput.getAttribute("lng");
  //   const dropOffInputLat = dropOffInput.getAttribute("lat");
  //   var start = new google.maps.LatLng(pickupPointLat, pickupPointLng);
  //   var end = new google.maps.LatLng(dropOffInputLat, dropOffInputLng);

  //   // var request = {
  //   //   origin: start,
  //   //   destination: end,
  //   //   travelMode: google.maps.TravelMode.DRIVING
  //   // };
  //   // directionsService.route(request, function (response, status) {
  //   //   if (status == google.maps.DirectionsStatus.OK) {
  //   //     directionsDisplay.setDirections(response);
  //   //   }
  //   // });
  // }, 5000);
}
// ===============

// =========== ADDING TASK ===========
// CONSTS
const addingTaskForm = document.querySelector(".createTaskItemContainer_form");
const addTaskBtn = document.querySelector(".createTaskBtnItem");
const closeTaskBtn = document.querySelector(".createTaskItemContainer_close");
const closeTaskkey = document.querySelector(".createTaskItemContainer_close");
const createTaskItemContainerPopup = document.querySelector(
  ".createTaskItemContainerPopup"
);
const createTaskItemContainer = document.querySelector(
  ".createTaskItemContainer"
);
const createTaskItemContainer_btn = document.querySelector(
  ".createTaskItemContainer_btn"
);

// FUNCTIONS
const closeAddTaskPopUpAnimation = () => {
  anime({
    targets: ".createTaskItemContainerPopup",
    left: ["0%", "-100%"],
    duration: 500,
    easing: "easeInOutQuad",
    complete: () => {
      createTaskItemContainerPopup.style.display = "none";
      addingTaskForm.reset()
    },
  });
}

const closeAddTaskPopUp = () => {
  const taskForm = document.querySelector(".createTaskItemContainer_form")

  // CHECK IF THERE IS FILLED INPUTS
  let isEmptyInputs = 0;

  taskForm.querySelectorAll("input").forEach((input) => {
    if (input.value.trim() != "") {
      return (isEmptyInputs += 1);
    }
    // IF THERE IS A FILLED INPUT SHOW A CONFIRM ATION MESSAGE
    if (isEmptyInputs > 0) {
      // SHOW
      confirmationPopUp.classList.add(confirmationPopUpActiveClass);
      confirmationMessage.innerHTML = "Are you sure you want to discard this task ?!!"

      // CANCEL CLICKED
      confirmationContianerCancel.innerHTML = "Cancel"
      confirmationContianerCancel.onclick = () => {
        confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
        return confirmationMessage.innerHTML = ""
      }

      // DISCARD CLICKED
      confirmationContianerDiscard.innerHTML = "Discard"
      confirmationContianerDiscard.onclick = () => {
        confirmationPopUp.classList.remove("confirmation_contianer_popup--active");
        confirmationMessage.innerHTML = ""
        closeAddTaskPopUpAnimation()
      }
    } else {
      closeAddTaskPopUpAnimation()
    }
  });
}

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createTaskItemContainerPopup.style.display = "flex";
  anime({
    targets: ".createTaskItemContainerPopup",
    left: ["-100%", "0%"],
    duration: 500,
    easing: "easeInOutQuad",
  });
});

// CLOSE BY BUTTON
closeTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeAddTaskPopUp()
});

// CLOSE POP UP WITH ESC KEY
document.body.addEventListener("keydown", function (e) {
  if (createTaskItemContainerPopup.style.display != "none") {
    if (e.key == "Escape" || e.keyCode == 27) {
      closeAddTaskPopUp()
    }
  }
});

addingTaskForm.querySelectorAll("input").forEach((requiredInput) => {
  requiredInput.addEventListener("change", () => {
    if (requiredInput.value != "") {
      requiredInput.classList.remove("reg-input_err");
    }
  });
});

addingTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskType = addingTaskForm["taskType"];
  const taskTypeOption = taskType.options[taskType.selectedIndex];
  const taskPickUpName = addingTaskForm["taskPickUpName"];
  const taskPickUpNumber = addingTaskForm["taskPickUpNumber"];
  const taskPickUpEmail = addingTaskForm["taskPickUpEmail"];
  const taskPickUpOrderId = addingTaskForm["taskPickUpOrderId"];
  const taskPickUpAddress = addingTaskForm["taskPickUpAddress"];
  const taskPickUpAddressValue = taskPickUpAddress;
  const taskPickUpAddressLng = taskPickUpAddress.getAttribute("lng");
  const taskPickUpAddressLat = taskPickUpAddress.getAttribute("lat");
  const taskPickUpPickUpBefore = addingTaskForm["taskPickUpPickUpBefore"];
  const taskPickUpDescription = addingTaskForm["taskPickUpDescription"];

  const taskDeliveryName = addingTaskForm["taskDeliveryName"];
  const taskDeliveryPhone = addingTaskForm["taskDeliveryNumber"];
  const taskDeliveryEmail = addingTaskForm["taskDeliveryEmail"];
  const taskDeliveryOrderId = addingTaskForm["taskDeliveryOrderId"];
  const taskDeliveryAddress = addingTaskForm["taskDeliveryAddress"];
  const taskDeliveryAddressLng = taskDeliveryAddress.getAttribute("lng");
  const taskDeliveryAddressLat = taskDeliveryAddress.getAttribute("lat");
  const taskDeliveryPickUpBefore = addingTaskForm["taskDeliveryPickUpBefore"];
  const taskDeliveryDescription = addingTaskForm["taskDeliveryDescription"];
  const addTaskDriverId = addingTaskForm["addTaskDriverId"];
  let driverId
  db.ref(`users/${uid}/drivers`).once("value", (drivers) => {
    if (!!drivers) {
      return driverId = drivers.val().filter((driverData) => {
        return driverData.status == 0
      })

    } else {
      driverId = 0
    }
  })
  const addTaskValidate = [
    taskTypeOption,
    taskPickUpName,
    taskPickUpNumber,
    taskPickUpEmail,
    taskPickUpOrderId,
    taskPickUpAddressValue,
    taskPickUpPickUpBefore,
    taskDeliveryName,
    taskDeliveryPhone,
    taskDeliveryEmail,
    taskDeliveryOrderId,
    taskDeliveryAddress,
    taskDeliveryPickUpBefore,
    addTaskDriverId
  ];

  let emptyInputs = 0;
  addTaskValidate.forEach((input) => {
    if (input.value.trim() == "") {
      input.classList.add("reg-input_err");
      document.querySelector("#addTaskErrorMessage").innerHTML = "This Fields cant be blank";
      document.querySelector("#addTaskErrorMessage").classList.add("addTaskErrMessage--active")
      return (emptyInputs += 1);
    }
  });
  if (emptyInputs != 0) {
    return;
  }

  const task = {
    driverId: addTaskDriverId,
    taskUid: '',
    status: 0,
    type: taskTypeOption.value,
    pickup: {
      name: taskPickUpName.value,
      email: taskPickUpEmail.value,
      phone: taskPickUpNumber.value,
      orderId: taskPickUpOrderId.value,
      description: taskPickUpDescription.value,
      pickupBefore: taskPickUpPickUpBefore.value,
      address: {
        name: taskPickUpAddress.value,
        lat: taskPickUpAddressLat,
        lng: taskPickUpAddressLng,
      },
    },
    deliver: {
      name: taskDeliveryName.value,
      email: taskDeliveryEmail.value,
      phone: taskDeliveryPhone.value,
      orderId: taskDeliveryOrderId.value,
      description: taskDeliveryDescription.value,
      deliverBefore: taskDeliveryPickUpBefore.value,
      address: {
        name: taskDeliveryAddress.value,
        lat: taskDeliveryAddressLat,
        lng: taskDeliveryAddressLng,
      },
    },
  };

  db.ref(`users/${uid}/tasks`)
    .push(task)
    .then((cred) => {
      cred.update({
        taskUid: cred.getKey(),
      });
      addingTaskForm.reset();
      anime({
        targets: ".createTaskItemContainerPopup",
        left: ["0%", "-100%"],
        duration: 500,
        easing: "easeInOutQuad",
        complete: () => {
          createTaskItemContainerPopup.style.display = "none";
        },
      });
      popUpMessage.innerHTML = "task added succesfully";
      popUpMessage.classList.add("popup_message--succ");
      popUpMessage.style.display = "block";
      setTimeout(() => {
        popUpMessage.style.display = "none";
      }, 5000);
    })
    .catch((err) => {
      popUpMessage.innerHTML = err.message;
      popUpMessage.classList.add("popup_message--err");
      popUpMessage.style.display = "block";
      setTimeout(() => {
        popUpMessage.style.display = "none";
      }, 5000);
    })
});

// ===================================
const closeDetailsHeader = () => {
  const closeTaskDetailsBtn = document.querySelector("#closetaskDetails")
  closeTaskDetailsBtn.addEventListener("click", () => {
    const taskDetailedPopUp = document.querySelector(".taskDetailsPopup");
    anime({
      targets: ".taskDetailsPopup",
      duration: 300,
      height: ["85%", '0'],
      bottom: ['15%', "-100%"],
      easing: "linear",
      complete: () => {
        taskDetailedPopUp.innerHTML = "";
        taskDetailedPopUp.style.display = "none"
      }
    })
  })
}

// DELETE TASK
const deleteTaskRun = () => {
  confirmationPopUp.classList.add(confirmationPopUpActiveClass)
  confirmationMessage.innerHTML = "Are you sure you want to delete this task??!"
  confirmationContianerCancel.onclick = () => {
    confirmationPopUp.classList.remove(confirmationPopUpActiveClass)
    return confirmationMessage.innerHTML = ""
  }
  confirmationContianerDiscard.innerHTML = "Delete"
  confirmationContianerDiscard.onclick = () => {
    confirmationPopUp.classList.remove(confirmationPopUpActiveClass)
    confirmationMessage.innerHTML = ""

    //SELECT TASK ID
    const deleteTaskBtn = document.querySelector("#deleteTask")
    const deleteId = deleteTaskBtn.dataset.task_id

    const popUpMessgeFunction = (message, delay, status) => {
      popUpMessage.innerHTML = message;
      popUpMessage.classList.add(`popup_message--${status == 1 ? "succ" : "err"}`);
      popUpMessage.style.display = "block";
      setTimeout(() => {
        popUpMessage.style.display = "none";
        popUpMessage.innerHTML = "";
      }, delay * 1000);
    }
    // DELETE FROM DATABASE
    db.ref(`users/${uid}/tasks/${deleteId}`).remove()
      .then(() => {
        popUpMessgeFunction("task has been deleted successfully", 5, 1)
      })
      .catch((err) => {
        popUpMessgeFunction(err.message, 5, 0)

      })
  }

}


// read tasks
db.ref(`users/${uid}/tasks`).on("value", function (tasks) {
  const unAssignedTab = document.querySelector(
    ".map_info-col__containar-tabTask--unassigned"
  );
  const assignedTab = document.querySelector(
    ".map_info-col__containar-tabTask--assigned"
  );
  const completedTab = document.querySelector(
    ".map_info-col__containar-tabTask--completed"
  );

  unAssignedTab.innerHTML = ""
  assignedTab.innerHTML = ""
  completedTab.innerHTML = ""

  tasks.forEach((taskData) => {
    const task = taskData.val();
    const isUnassigned = task.status == 0;
    const isAssigned = task.status == 1;
    const isCompleted = task.status == 2;

    const driverId = task.driverId;

    const pickUpBefore = task.pickup.pickupBefore;
    const pickUpName = task.pickup.name;
    const pickUpAddress = task.pickup.address.name;

    const deliverBefore = task.deliver.deliverBefore;
    const deliverName = task.deliver.name;
    const deliverAddress = task.deliver.address.name;

    // const
    taskItemHTML = `<div class="map_info-col__item map_info-col__item-task">
                      <div class="map_info-col__item--assigning">
                        ${isUnassigned ? "Unassigned" : ""}
                        ${isAssigned ? "Assigned" : ""}
                        ${isCompleted ? "Completed" : ""}
                      </div>
                      <div class="map_info-col__item--image_container">
                        <div class="map_info-col__item--image">
                          <img src="assets/images/profile_image.jpg" alt="${
                            driverId == 0 ? "unassigned" : "zeyad"
                          }" />
                        </div>
                        <p class="map_info-col__item--image_name">${
                          driverId == 0 ? "unassigned" : "zeyad"
                        }</p>
                      </div>
                      <div class="map_info-col__item-task--progress">
                        <div class="map_info-col__item-points map_info-col__item-points--fill map_info-col__item-point-frist">
                          A
                        </div>
                        <div class="map_info-col__item-line"></div>
                        <div class="map_info-col__item-points map_info-col__item-points--border map_info-col__item-point-last">
                          B
                        </div>
                      </div>
                      <div class="map_info-col__item-task--info">
                        <div class="map_info-col__item-task--starting">
                          <div class="map_info-col__item-task--time">${pickUpBefore}</div>
                          <h4 class="map_info-col__item-task--title">${pickUpName}</h4>
                          <p class="map_info-col__item-task--address">
                            ${pickUpAddress}
                          </p>
                          <span class="map_info-col__item-task--status">
                            ${isUnassigned ? "Unassigned" : ""}
                            ${isAssigned ? "Assigned" : ""}
                            ${isCompleted ? "Completed" : ""}
                            </span>
                        </div>
                        <div class="map_info-col__item-task--dropoff">
                          <div class="map_info-col__item-task--time">${deliverBefore}</div>
                          <h4 class="map_info-col__item-task--title">${deliverName}</h4>
                          <p class="map_info-col__item-task--address">
                            ${deliverAddress}
                          </p>
                          <span class="map_info-col__item-task--status">
                            ${isUnassigned ? "Unassigned" : ""}
                            ${isAssigned ? "Assigned" : ""}
                            ${isCompleted ? "Completed" : ""}
                          </span>
                        </div>
                      </div>
                      <div id="taskDetails" data-task_id="${task.taskUid}" class="map_info-col__item-task--more">
                        <i class="map_info-col__item-task--icon_more fas fa-chevron-right "></i>
                      </div>
                      
                    </div>`;

    if (task.status == 0) {
      unAssignedTab.innerHTML = "";
      unAssignedTab.innerHTML += taskItemHTML;
    } else if (task.status == 1) {
      assignedTab.innerHTML = "";
      assignedTab.innerHTML += taskItemHTML;
    } else if (task.status == 2) {
      completedTab.innerHTML = "";
      completedTab.innerHTML += taskItemHTML;
    }
  });

  seeMoreDetails = document.querySelector("#taskDetails");
  if (seeMoreDetails) {
    seeMoreDetails.addEventListener("click", (e) => {
      const taskId = seeMoreDetails.dataset.task_id;
      db.ref(`users/${uid}/tasks/${taskId}`).on("value", (detailedTask) => {
        const taskDetailsValue = detailedTask.val();

        const taskDetailsType = taskDetailsValue.type;
        const taskDetailsDriver = taskDetailsValue.driverId;
        const taskDetailsStatus = taskDetailsValue.status;

        const taskDetailsPickupName = taskDetailsValue.pickup.name;
        const taskDetailsPickupPhone = taskDetailsValue.pickup.phone;
        const taskDetailsPickupDescription = taskDetailsValue.pickup.description;
        const taskDetailsPickupBefore = taskDetailsValue.pickup.pickupBefore;
        const taskDetailsPickupOrderId = taskDetailsValue.pickup.orderId;
        const taskDetailsPickupAddress = taskDetailsValue.pickup.address.name;
        const taskDetailsPickupAddressLng = taskDetailsValue.pickup.address.lng;
        const taskDetailsPickupAddressLat = taskDetailsValue.pickup.address.lat;

        const taskDetailsDriverName = taskDetailsValue.deliver.name;
        const taskDetailsDriverPhone = taskDetailsValue.deliver.phone;
        const taskDetailsDriverDescription = taskDetailsValue.deliver.description;
        const taskDetailsDriverBefore = taskDetailsValue.deliver.deliverBefore;
        const taskDetailsDriverOrderId = taskDetailsValue.deliver.orderId;
        const taskDetailsDriverAddress = taskDetailsValue.deliver.address.name;
        const taskDetailsDriverAddressLng = taskDetailsValue.deliver.address.lng;
        const taskDetailsDriverAddressLat = taskDetailsValue.deliver.address.lat;

        let detaliedDriverName =
          taskDetailsDriver == 0 ? "Unassigned" : undefined;
        const taskDetailsStatusRun = () => {
          if (taskDetailsStatus == 0) {
            return "Unassigned";
          } else if (taskDetailsStatus == 0) {
            return "Assigned";
          } else {
            return "completed";
          }
        };

        const detaliedStatus = taskDetailsStatusRun();

        const detaliedTaskItem = `<div class="taskDetails_header">
        <h3 class="taskDetails_haeder">Task details</h3>
        <i onclick="closeDetailsHeader()" id="closetaskDetails" class="fas fa-times"></i>
      </div>
        <div class="taskDetails_content">
          <p><b>driver</b>: ${detaliedDriverName}</p>
          <p><b>status</b>: ${detaliedStatus}</p>
          <p><b>driverType</b>: ${taskDetailsType}</p>

          <h3>pickup</h3>
          <div class="pickup_details_container">
            <p><b>Name</b>: ${taskDetailsPickupName}</p>
            <p><b>Phone number</b>: ${taskDetailsPickupPhone}</p>
            <p><b>order ID</b>: ${taskDetailsPickupOrderId}</p>
            <p><b>description</b>: ${taskDetailsPickupDescription}</p>
            <p><b>Before</b>: ${taskDetailsPickupBefore}</p>
            <p><b>address</b>: ${taskDetailsPickupAddress}</p>
          </div>

          <h3>deliver</h3>
          <div class="pickup_details_container">
            <p><b>deliver Name</b>: ${taskDetailsDriverName}</p>
            <p><b>deliver Phone number</b>: ${taskDetailsDriverPhone}</p>
            <p><b>deliver order ID</b>: ${taskDetailsDriverOrderId}</p>
            <p><b>deliver description</b>: ${taskDetailsDriverDescription}</p>
            <p><b>deliver Before</b>: ${taskDetailsDriverBefore}</p>
            <p><b>deliver address</b>: ${taskDetailsDriverAddress}</p>
          </div>
          <button data-task_id=${taskId} onclick="deleteTaskRun()"id="deleteTask">Delete</button>
        </div>`;

        const taskDetailedPopUp = document.querySelector(".taskDetailsPopup");
        taskDetailedPopUp.innerHTML = detaliedTaskItem;
        taskDetailedPopUp.style.display = "block"
        anime({
          targets: ".taskDetailsPopup",
          duration: 300,
          height: ['0', "85%"],
          bottom: ["-100%", '15%'],
          easing: "linear",
        })

      });

    });
  }

});

// READ DRIVERS

db.ref(`users/${uid}/drivers`).on("value", function (driversData) {
  const driersContainer = document.querySelector("#colDrivers");
  const driverTabs = document.querySelectorAll(
    ".map_info-col__containar-tabAgnet"
  );
  driverTabs.forEach((tab) => (tab.innerHTML = ""));
  // const
  driversData.forEach((drivers) => {
    let numOfActive = 0;
    let numOfInActive = 0;
    let numOfBusy = 0;

    drivers.forEach((driverData) => {
      const driver = driverData.val();

      const tab = Array.from(driverTabs).filter((driverTab) => {
        console.log(driver.driverStatus)
        if (driver.driverStatus == -1) {
          return driverTab.dataset.agenttab == 2;
        } else if (driver.driverStatus == 0) {
          return driverTab.dataset.agenttab == 0;
        } else {
          return driverTab.dataset.agenttab == 1;
        }
      });
      console.log(tab)
      const driversFristName = driver.driverFirstName;
      const driversLastName = driver.driverLastName;
      const driversNumber = driver.driverPhoneNumber;
      const driversProfilePic = driver.driverProfileImage;

      const driverItem = `<div class="map_info-col__item">
          <div class="map_info-col__item--image">
            <img src="${driversProfilePic}" alt="user name" />
            <div class="agent_activity agent_activity--online"></div>
          </div>
          <div class="map_info-col__item--info">
            <h3 class="map_info-col__item--name">${driversFristName} ${driversLastName}</h3>
            <p class="map_info-col__item--number">
              <span class="map_info-col__item--number_nation">+20</span>
              ${driversNumber}
            </p>
          </div>
          <div class="map_info-col__item--assign">
            <div class="map_info-col__item--tasksNumber">
              <span class="map_info-col__item--tasks_circle">${driver.tasks.length}</span>
              <p class="map_info-col__item--task-p">Task</p>
            </div>
            <div class="map_info-col__item--moreInfoBtn">
              <i class="fas fa-angle-right"></i>
            </div>
          </div>
        </div>`;

      tab[0].innerHTML += driverItem;
      if (driver.driverStatus == -1) {
        return numOfInActive += 1
      } else if (driver.driverStatus == 0) {
        return numOfActive += 1
      } else {
        return numOfBusy += 1
      }
    });
    document.querySelector(".map_info-col__subhead-item[data-agentTab='0']").innerHTML = ` <span class="map_info-col_number--agents">${numOfActive}</span> Free`
    document.querySelector(".map_info-col__subhead-item[data-agentTab='1']").innerHTML = ` <span class="map_info-col_number--agents">${numOfBusy}</span> busy`
    document.querySelector(".map_info-col__subhead-item[data-agentTab='2']").innerHTML = ` <span class="map_info-col_number--agents">${numOfInActive}</span> Inactive`
  });
  // driversArray.forEach((driverData, index) => {
  //   const drivers = driverData
  //   console.log(drivers.val())
  //   console.log(drivers, index)

  // })
});
db.ref(`users/${uid}/drivers`).on("value", function (driversData) {
  driversData.forEach((drivers) => {
    drivers.forEach((driverData) => {
      console.log(document.querySelector("#addTaskDrivers"))
      document.querySelector("#addTaskDrivers").innerHTML += `<option>${driverData.val().driverFirstName} ${driverData.val().driverLastName}</option>`
    })
    // value=${driverData.key}
  })
})
//  ==============================

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

// toggleHideAndShow(
//   ".createTaskBtn",
//   ".createTaskContainer",
//   "nav_popup--active"
// );

toggleHideAndShow(".pickup_btn", ".pickup_contanier", "ocordion_body--active");

toggleHideAndShow(
  ".dropoff_btn",
  ".dropoff_container",
  "ocordion_body--active"
);

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

toggleHideAndShow(
  ".map_info-col_collaps--tasks",
  ".map_tasks",
  "map_col--collapsed",
  () =>
  changeIcon(
    ".map_info-col_icon--tasks",
    "fa-chevron-left",
    "fa-chevron-right"
  )
);

toggleHideAndShow(
  ".map_info-col_collaps--agents",
  ".map_agents",
  "map_col--collapsed",
  () =>
  changeIcon(
    ".map_info-col_icon--agents",
    "fa-chevron-right",
    "fa-chevron-left"
  )
);

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