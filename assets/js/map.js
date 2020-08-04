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
const confirmationPopUp = document.querySelector(".confirmation_contianer_popup");
const confirmationPopUpActiveClass = "confirmation_contianer_popup--active";
const confirmationMessage = confirmationPopUp.querySelector(".confirmation_contianer_popup-message");
const confirmationContianerCancel = confirmationPopUp.querySelector("#confirmation_contianer_cancel");
const confirmationContianerDiscard = confirmationPopUp.querySelector("#confirmation_contianer_dicard");
const popUpMessage = document.querySelector(".popup_message");

popUpMessage.addEventListener("click", () => {
  popUpMessage.style.display = "none";
});

const popUpMessgeFunction = (message, delay, status) => {
  popUpMessage.innerHTML = message;
  popUpMessage.classList.add(`popup_message--${status == 1 ? "succ" : "err"}`);
  popUpMessage.style.display = "block";
  setTimeout(() => {
    popUpMessage.style.display = "none";
    popUpMessage.innerHTML = "";
  }, delay * 1000);
};

// LOGOUT ========
const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    Cookies.remove("logedin");
    Cookies.remove("uid");
  });
});
// ===============

// initiate the maps ================
function initMap() {
  // DASHBOARD MAP
  var maps = new google.maps.Map(
    document.querySelector(".map_container"), {
      zoom: 4,
      center: {
        lat: -33,
        lng: 151,
      },
      disableDefaultUI: true,
    }
  );

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
    google.maps.event.addListener(
      autoComplete,
      "place_changed",
      function () {
        var place = autoComplete.getPlace().geometry
          .location;
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
      }
    );
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
}
// ===============

// =========== ADDING TASK ===========
// CONSTS
const addingTaskForm = document.querySelector(".createTaskItemContainer_form");
const addTaskBtn = document.querySelector(".createTaskBtnItem");
const closeTaskBtn = document.querySelector(".createTaskItemContainer_close");
const closeTaskkey = document.querySelector(".createTaskItemContainer_close");
const createTaskItemContainerPopup = document.querySelector(".createTaskItemContainerPopup");
const createTaskItemContainer = document.querySelector(".createTaskItemContainer");
const createTaskItemContainer_btn = document.querySelector(".createTaskItemContainer_btn");

// FUNCTIONS
const closeAddTaskPopUpAnimation = () => {
  anime({
    targets: ".createTaskItemContainerPopup",
    left: ["0%", "-100%"],
    duration: 500,
    easing: "easeInOutQuad",
    complete: () => {
      createTaskItemContainerPopup.style.display = "none";
      addingTaskForm.reset();
    },
  });
};

const closeAddTaskPopUp = () => {
  const taskForm = document.querySelector(
    ".createTaskItemContainer_form"
  );

  // CHECK IF THERE IS FILLED INPUTS
  let isEmptyInputs = 0;

  taskForm.querySelectorAll("input").forEach((input) => {
    if (input.value.trim() != "") {
      return (isEmptyInputs += 1);
    }
    // IF THERE IS A FILLED INPUT SHOW A CONFIRM ATION MESSAGE
    if (isEmptyInputs > 0) {
      // SHOW
      confirmationPopUp.classList.add(
        confirmationPopUpActiveClass
      );
      confirmationMessage.innerHTML =
        "Are you sure you want to discard this task ?!!";

      // CANCEL CLICKED
      confirmationContianerCancel.innerHTML = "Cancel";
      confirmationContianerCancel.onclick = () => {
        confirmationPopUp.classList.remove(
          confirmationPopUpActiveClass
        );
        return (confirmationMessage.innerHTML = "");
      };

      // DISCARD CLICKED
      confirmationContianerDiscard.innerHTML = "Discard";
      confirmationContianerDiscard.onclick = () => {
        confirmationPopUp.classList.remove(
          "confirmation_contianer_popup--active"
        );
        confirmationMessage.innerHTML = "";
        closeAddTaskPopUpAnimation();
      };
    } else {
      closeAddTaskPopUpAnimation();
    }
  });
};

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
  closeAddTaskPopUp();
});

// CLOSE POP UP WITH ESC KEY
document.body.addEventListener("keydown", function (e) {
  if (createTaskItemContainerPopup.style.display != "none") {
    if (e.key == "Escape" || e.keyCode == 27) {
      closeAddTaskPopUp();
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
  const addTaskDriverIdValue = addTaskDriverId.options[addTaskDriverId.selectedIndex];
  let driverId;


  db.ref(`users/${uid}/drivers`).once("value", (drivers) => {
    if (!!drivers) return (driverId = drivers.val().filter(driverData => driverData.status == 0));
    return driverId = 0;
  });
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
    addTaskDriverId,
  ];

  let emptyInputs = 0;
  addTaskValidate.forEach((input) => {
    if (input.value.trim() == "") {
      input.classList.add("reg-input_err");
      document.querySelector(
        "#addTaskErrorMessage"
      ).innerHTML = "This Fields cant be blank";
      document.querySelector(
        "#addTaskErrorMessage"
      ).classList.add("addTaskErrMessage--active");
      return (emptyInputs += 1);
    }
  });
  if (emptyInputs != 0) {
    return;
  }

  const task = {
    driverId: addTaskDriverIdValue.value,
    taskUid: "",
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
          createTaskItemContainerPopup.style.display =
            "none";
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
    });
});

// ===================================

// SEE TASK DETAILS ========================
const closeDetailsPopup = (selector) => {
  const elePopUp = document.querySelector(selector);
  anime({
    targets: ".taskDetailsPopup",
    duration: 300,
    height: ["100%", "0"],
    bottom: ["0", "-100%"],
    easing: "easeInQuad",
    complete: () => {
      elePopUp.innerHTML = "";
      elePopUp.style.display = "none";
    },
  });
};

// DELETE TASK ========================
const deleteTaskRun = () => {
  confirmationPopUp.classList.add(confirmationPopUpActiveClass);
  confirmationMessage.innerHTML =
    "Are you sure you want to delete this task??!";
  confirmationContianerCancel.onclick = () => {
    confirmationPopUp.classList.remove(
      confirmationPopUpActiveClass
    );
    return (confirmationMessage.innerHTML = "");
  };
  confirmationContianerDiscard.innerHTML = "Delete";
  confirmationContianerDiscard.onclick = () => {
    confirmationPopUp.classList.remove(
      confirmationPopUpActiveClass
    );
    confirmationMessage.innerHTML = "";

    //SELECT TASK ID
    const deleteDriverkBtn = document.querySelector("#deleteTask");
    const deleteId = deleteDriverkBtn.dataset.task_id;

    // DELETE FROM DATABASE
    db.ref(`users/${uid}/tasks/${deleteId}`)
      .remove()
      .then(() => {
        popUpMessgeFunction("task has been deleted successfully", 5, 1);
      })
      .catch((err) => {
        popUpMessgeFunction(err.message, 5, 0);
      });
  };
};
// ====================================

// READ TASKS ================
db.ref(`users/${uid}/tasks`).on("value", function (tasks) {
  const unAssignedTab = document.querySelector(".map_info-col__containar-tabTask--unassigned");
  const assignedTab = document.querySelector(".map_info-col__containar-tabTask--assigned");
  const completedTab = document.querySelector(".map_info-col__containar-tabTask--completed");

  unAssignedTab.innerHTML = "";
  assignedTab.innerHTML = "";
  completedTab.innerHTML = "";

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
    const taskItemHTML =
      `<div data-task_id="${task.taskUid}" class="map_info-col__item map_info-col__item-task">
        <div class="map_info-col__item--assigning">
          ${isUnassigned ? "Unassigned" : ""}
          ${isAssigned ? "Assigned" : ""}
          ${isCompleted ? "Completed" : ""}
        </div>
        <div class="map_info-col__item--image_container">
          <div class="map_info-col__item--image">
            <img src="assets/images/profile_image.jpg" alt="${driverId == 0 ? "unassigned" : "zeyad"}" />
          </div>
          <p class="map_info-col__item--image_name">${driverId == 0 ? "unassigned" : "zeyad"}</p>
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

    let numOfUnAssigned = 0;
    let numOfAssigned = 0;
    let numOfCompleted = 0;

    if (task.status == 0) {
      numOfUnAssigned++;
      unAssignedTab.innerHTML += taskItemHTML;
    } else if (task.status == 1) {
      numOfAssigned++;
      assignedTab.innerHTML += taskItemHTML;
    } else if (task.status == 2) {
      numOfCompleted++;
      completedTab.innerHTML += taskItemHTML;
    }
    document.querySelector(
      ".map_info-col__subhead-tasks[data-tasktab='0']"
    ).innerHTML = ` <span>${numOfUnAssigned}</span> UNASSIGNED`;
    document.querySelector(
      ".map_info-col__subhead-tasks[data-tasktab='1']"
    ).innerHTML = ` <span>${numOfAssigned}</span> ASSIGNED`;
    document.querySelector(
      ".map_info-col__subhead-tasks[data-tasktab='2']"
    ).innerHTML = ` <span>${numOfCompleted}</span> COMPLETED`;
  });

  const seeMoreTaskDetailsButtons = document.querySelectorAll(".map_info-col__item-task");
  const showMoreTaskDetailsPopup = (seeMoreTaskDetailsButton) => {
    const taskId = seeMoreTaskDetailsButton.dataset.task_id;
    db.ref(`users/${uid}/tasks/${taskId}`).on("value",
      (detailedTask) => {
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

        let detaliedDriverName = taskDetailsDriver == 0 ? "Unassigned" : "undefined";

        const taskDetailsStatusRun = (status) => {
          if (status == -1) return "Unassigned";
          else if (status == 0) return "Assigned";
          return "completed";
        };

        const detaliedTaskItem = `<div class="taskDetails_header">
            <h3 class="taskDetails_haeder">Task details</h3>
            <i onclick = "closeDetailsPopup('.taskDetailsPopup')" id="closetaskDetails" class="fas fa-times"> </i>
          </div>
          <div class="taskDetails_content">
            <p><b>driver</b>: ${detaliedDriverName}</p>
            <p><b>status</b>: ${taskDetailsStatusRun(taskDetailsStatus)}</p>
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
            <button class="deleteDetails" data-task_id=${taskId} onclick="deleteTaskRun()" id="deleteTask">Delete</button>
          </div>`;

        const taskDetailedPopUp = document.querySelector(".taskDetailsPopup");
        taskDetailedPopUp.innerHTML = detaliedTaskItem;
        taskDetailedPopUp.style.display = "block";

        anime({
          targets: ".taskDetailsPopup",
          duration: 500,
          height: ["0", "100%"],
          bottom: ["-0%", "0%"],
          easing: "easeInQuad",
        });
      }
    );
  };
  if (seeMoreTaskDetailsButtons.length >= 0) {
    seeMoreTaskDetailsButtons.forEach(
      (seeMoreTaskDetailsButton) => {
        seeMoreTaskDetailsButton.addEventListener("click", () => showMoreTaskDetailsPopup(seeMoreTaskDetailsButton));
      }
    );
  }
});

// DELETE DRIVER
const deleteDriverRun = () => {
  confirmationPopUp.classList.add(confirmationPopUpActiveClass);
  confirmationMessage.innerHTML =
    "Are you sure you want to delete this Driver??!";
  confirmationContianerCancel.onclick = () => {
    confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
    return (confirmationMessage.innerHTML = "");
  };
  confirmationContianerDiscard.innerHTML = "Delete";
  confirmationContianerDiscard.onclick = () => {
    confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
    confirmationMessage.innerHTML = "";

    //SELECT TASK ID
    const deleteDriverBtn = document.querySelector("#deleteDriver");
    const deleteId = deleteDriverBtn.dataset.driver_id;
    const deleteTeam = deleteDriverBtn.dataset.driver_team;

    // DELETE FROM DATABASE
    db.ref(`users/${uid}/drivers/${deleteTeam}/${deleteId}`)
      .remove()
      .then(() => {
        popUpMessgeFunction("Driver has been deleted successfully", 5, 1);
      })
      .catch((err) => {
        popUpMessgeFunction(err.message, 5, 0);
      });
  };
};
// ====================================

// READ DRIVERS
db.ref(`users/${uid}/drivers`).on("value", function (driversData) {
  const driverTabs = document.querySelectorAll(".map_info-col__containar-tabAgnet");
  const freeAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='0'] span");
  const busyAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='1'] span");
  const inActiveAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='2'] span");

  let numOfActive = 0;
  let numOfInActive = 0;
  let numOfBusy = 0;

  const driverActivityStatusClassString = (status) => {
    if (status == 0) return "online";
    if (status == 1) return "busy";
    if (status == -1) return "offduty";
    return "offduty";
  };

  const driverItemTabIndex = (status) => {
    if (status == 0) return 0;
    if (status == 1) return 1;
    if (status == -1) return 2;
    return 2;
  };

  driverTabs.forEach((tab) => (tab.innerHTML = ""));

  driversData.forEach((drivers) => {

    drivers.forEach((snapshot) => {
      const driver = snapshot.val();
      console.log(driver)
      const driverId = snapshot.key;
      const driverTeamValue = driver.driverTeam.value;
      const driversFristName = driver.driverFirstName;
      const driversLastName = driver.driverLastName;
      const driversNumber = driver.driverPhoneNumber;
      const driversStatus = driver.driverStatus;
      const driversProfilePic = driver.driverProfileImage;
      const numberOfDriverAssignedTasks = JSON.parse(driver.tasks).length;
      const DriverContainerColoumn = document.querySelector(`.map_info-col__containar-tabAgnet[data-agentTab='${driverItemTabIndex(driversStatus)}']`);

      const driverItem =
        `<div class="map_info-col__item map_info-col__item-driver" data-driver_team="${driverTeamValue}" data-driver_id="${driverId}">
          <div class="map_info-col__item--image">
            <img src="${driversProfilePic}" alt="${driversFristName} ${driversLastName}" />
            <div class="agent_activity agent_activity--${driverActivityStatusClassString(driversStatus)}"></div>
          </div>
          <div class="map_info-col__item--info">
            <h3 class="map_info-col__item--name">${driversFristName} ${driversLastName}</h3>
            <p class="map_info-col__item--number">
              <span class="map_info-col__item--number_nation">+20</span>${driversNumber}</p>
          </div>
          <div class="map_info-col__item--assign">
            <div class="map_info-col__item--tasksNumber">
              <span class="map_info-col__item--tasks_circle">${numberOfDriverAssignedTasks}</span>
              <p class="map_info-col__item--task-p">Task</p>
            </div>
            <div class="map_info-col__item--moreInfoBtn">
              <i class="fas fa-angle-right"></i>
            </div>
          </div>
        </div>`;
      const showMoreDriverDetailsPopup = (driverItemEle) => {
        const driverItemId = driverItemEle.dataset.driver_id;
        const driverItemTeam = driverItemEle.dataset.driver_team;
        const driverMoreDetailsPopup = document.querySelector(".driverDetailsPopup");
        driverMoreDetailsPopup.innerHTML = ""
        db.ref(`users/${uid}/drivers/${driverItemTeam}/${driverItemId}`).on("value", (snapshot) => {
          const driverData = snapshot.val()
          const driverId = snapshot.key
          const driverUsername = driverData.driverUsername
          const driverFirstName = driverData.driverFirstName
          const driverLastName = driverData.driverLastName
          const driverStatusData = driverData.driverStatus
          const driverEmail = driverData.driverEmail
          const driverTeamValue = driverData.driverTeam.value
          const driverTeamName = driverData.driverTeam.name
          const driverPhoneNumber = driverData.driverPhoneNumber
          const driverDriveBy = driverData.driverTransportation

          const driverStatusMessage = (statusData) => {
            if (statusData == 0) return "Free"
            else if (statusData == 1) return "Busy"
            else if (statusData == -1) return "Inactive"
            return "Inactive"
          }

          const detaliedTaskItem =
            `<div class="taskDetails_header">
                  <h3 class="taskDetails_haeder">Driver details</h3>
                  <i onclick="closeDetailsPopup('.driverDetailsPopup')" id="closetaskDetails" class="fas fa-times"></i>
                </div>
                <div class="taskDetails_content">
                  <p><b>Driver Name</b>: ${driverFirstName} ${driverLastName}</p>
                  <p><b>Status</b>:${driverStatusMessage(driverStatusData)}</p>
                  <p><b>Drive By</b>: ${driverDriveBy}</p>
                  <p><b>Email Address</b>: ${driverEmail}</p>
                  <p><b>Phone number</b>: ${driverPhoneNumber}</p>
                  <p><b>Username</b>: ${driverUsername}</p>
                  <p><b>Team</b>: ${driverTeamName}</p>
                  <button class="deleteDetails" data-driver_team=${driverTeamValue} data-driver_id=${driverId} onclick="deleteDriverRun()"id="deleteDriver">Delete</button>
                </div>
            </div>`;
          driverMoreDetailsPopup.innerHTML = detaliedTaskItem;
          driverMoreDetailsPopup.style.display = "block";

          anime({
            targets: ".driverDetailsPopup",
            duration: 500,
            height: ["0", "100%"],
            bottom: ["-0%", "0%"],
            easing: "easeInQuad",
          });
        });
      };
      DriverContainerColoumn.innerHTML += driverItem;
      const driverItems = document.querySelectorAll(".map_info-col__item-driver");
      if (driverItems.length >= 0) {
        driverItems.forEach((driverItem) => {
          driverItem.addEventListener("click", () => {
            showMoreDriverDetailsPopup(driverItem)
          });
        });
      }

      if (driver.driverStatus == -1) {
        numOfInActive += 1;
      } else if (driver.driverStatus == 0) {
        numOfActive += 1;
      } else {
        numOfBusy += 1;
      }
    });
  });

  const EmptyColumnMessage = (message, isZero, containerTabIndex) => {
    if (isZero <= 0) {
      const containerTabIndexEle = document.querySelector(`.map_info-col__containar-tabAgnet[data-agentTab='${driverItemTabIndex(containerTabIndex)}']`);
      containerTabIndexEle.innerHTML = `<div class='tasks__empty_message-container' ><p class='tasks__empty_message'>${message} </p></div>`
    }
  };

  EmptyColumnMessage("you have no Active Drivers", numOfActive, 0);
  EmptyColumnMessage("you have no Busy Drivers", numOfBusy, 1);
  EmptyColumnMessage("you have no Inactive Drivers", numOfInActive, 2);

  freeAgentTabSpanContainer.innerHTML = numOfActive;
  busyAgentTabSpanContainer.innerHTML = numOfBusy;
  inActiveAgentTabSpanContainer.innerHTML = numOfInActive;

  const seeMoreTaskDetailsButtons = document.querySelectorAll("#taskDetails");
});

db.ref(`users/${uid}/drivers`).on("value", function (driversData) {
  driversData.forEach((drivers) => {
    drivers.forEach((driverData) => {
      document.querySelector("#addTaskDrivers")
        .innerHTML += `<option value="${driverData.key}" >${driverData.val().driverFirstName} ${driverData.val().driverLastName}</option>`;
    });
  });
});
//  ==============================

// Front-End styling
toggleHideAndShow(".navigation_hamburgerBtn", ".hamburger_menu", "hamburger_menu--active");
toggleHideAndShow(
  ".hamburger_btn-back_container",
  ".hamburger_menu",
  "hamburger_menu--active"
);
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
  "map_col--collap`sed",
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
  const colTasksBtn = document.querySelector(
    ".map_info-col_collaps--tasks"
  );
  const colAgentsBtn = document.querySelector(
    ".map_info-col_collaps--agents"
  );

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

//  ==========================================

// db.ref(`users/${uid}/drivers/0/-MDOWo-VAP3IfAT72aWd`).update("value", (e) => {
//   console.log(e.val());
// });