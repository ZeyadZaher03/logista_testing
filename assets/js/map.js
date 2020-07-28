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

//logout
const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => auth.signOut());
const popUpMessage = document.querySelector(".popup_message");
popUpMessage.addEventListener("click", () => {
  popUpMessage.style.display = "none";
  Cookies.remove("logedin");
});

// init the map
function initMap() {
  var maps = new google.maps.Map(document.querySelector(".map_container"), {
    zoom: 4,
    center: {
      lat: -33,
      lng: 151,
    },
    disableDefaultUI: true,
  });

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

  var pickupPoint = document.querySelector("#taskPickUpAddressSearchInput");
  var autocompletePickUp = new google.maps.places.Autocomplete(pickupPoint);
  autocompletePickUp.setComponentRestrictions({
    country: ["eg"],
  });
  var dropOffInput = document.querySelector("#taskDeliveryAddress");
  var autocompletedropOffInput = new google.maps.places.Autocomplete(
    dropOffInput
  );
  autocompletedropOffInput.setComponentRestrictions({
    country: ["eg"],
  });
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
  setTimeout(() => {
    const pickupPointLng = pickupPoint.getAttribute("lng");
    const pickupPointLat = pickupPoint.getAttribute("lat");
    const dropOffInputLng = dropOffInput.getAttribute("lng");
    const dropOffInputLat = dropOffInput.getAttribute("lat");
    var start = new google.maps.LatLng(pickupPointLat, pickupPointLng);
    var end = new google.maps.LatLng(dropOffInputLat, dropOffInputLng);

    // var request = {
    //   origin: start,
    //   destination: end,
    //   travelMode: google.maps.TravelMode.DRIVING
    // };
    // directionsService.route(request, function (response, status) {
    //   if (status == google.maps.DirectionsStatus.OK) {
    //     directionsDisplay.setDirections(response);
    //   }
    // });
  }, 5000);
}

// =========== ADDING TASK ===========
const addTaskBtn = document.querySelector(".createTaskBtnItem");
const closeTaskBtn = document.querySelector(".createTaskItemContainer_close");
const closeTaskkey = document.querySelector(".createTaskItemContainer_close");

const createTaskItemContainerPopup = document.querySelector(
  ".createTaskItemContainerPopup"
);
const createTaskItemContainer = document.querySelector(
  ".createTaskItemContainer"
);

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault()
  createTaskItemContainerPopup.style.display = "flex"
  anime({
    targets: ".createTaskItemContainerPopup",
    left: ["-100%", "0%"],
    duration: 500,
    easing: 'easeInOutQuad'
  })
})

closeTaskBtn.addEventListener("click", (e) => {
  e.preventDefault()
  anime({
    targets: ".createTaskItemContainerPopup",
    left: ["0%", "-100%"],
    duration: 500,
    easing: 'easeInOutQuad',
    complete: () => {
      createTaskItemContainerPopup.style.display = "none"
    }
  })
})

document.body.addEventListener('keydown', function (e) {
  if (createTaskItemContainerPopup.style.display != "none") {
    if (e.key == "Escape" || e.keyCode == 27) {
      anime({
        targets: ".createTaskItemContainerPopup",
        left: ["0%", "-100%"],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
          createTaskItemContainerPopup.style.display = "none"
        }
      })
    }
  }
});


const addingTaskForm = document.querySelector(".createTaskItemContainer_form");
const createTaskItemContainer_btn = document.querySelector(
  ".createTaskItemContainer_btn"
);

addingTaskForm.querySelectorAll("input").forEach((requiredInput) => {
  requiredInput.addEventListener("change", () => {
    if (requiredInput.value != "") {
      requiredInput.classList.remove("reg-input_err")
    }
  })
})
addingTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskType = addingTaskForm["taskType"];
  const taskTypeOption = taskType.options[taskType.selectedIndex];
  const taskPickUpName = addingTaskForm["taskPickUpName"];
  const taskPickUpNumber = addingTaskForm["taskPickUpNumber"];
  const taskPickUpEmail = addingTaskForm["taskPickUpEmail"];
  const taskPickUpOrderId = addingTaskForm["taskPickUpOrderId"];
  const taskPickUpAddress = addingTaskForm["taskPickUpAddress"]
  const taskPickUpAddressValue = taskPickUpAddress
  const taskPickUpAddressLng = taskPickUpAddress.getAttribute("lng");
  const taskPickUpAddressLat = taskPickUpAddress.getAttribute("lat");
  const taskPickUpPickUpBefore = addingTaskForm["taskPickUpPickUpBefore"];
  const taskPickUpDescription = addingTaskForm["taskPickUpDescription"];

  const taskDeliveryName = addingTaskForm["taskDeliveryName"];
  const taskDeliveryPhone = addingTaskForm["taskDeliveryNumber"];
  const taskDeliveryEmail = addingTaskForm["taskDeliveryEmail"];
  const taskDeliveryOrderId = addingTaskForm["taskDeliveryOrderId"];
  const taskDeliveryAddress = addingTaskForm["taskDeliveryAddress"]
  const taskDeliveryAddressLng = taskDeliveryAddress.getAttribute("lng");
  const taskDeliveryAddressLat = taskDeliveryAddress.getAttribute("lat");
  const taskDeliveryPickUpBefore = addingTaskForm["taskDeliveryPickUpBefore"];
  const taskDeliveryDescription = addingTaskForm["taskDeliveryDescription"];

  const addTaskValidate = [taskTypeOption, taskPickUpName, taskPickUpNumber, taskPickUpEmail, taskPickUpOrderId, taskPickUpAddressValue, taskPickUpPickUpBefore, taskDeliveryName, taskDeliveryPhone, taskDeliveryEmail, taskDeliveryOrderId, taskDeliveryAddress, taskDeliveryPickUpBefore]

  let emptyInputs = 0;
  addTaskValidate.forEach((input) => {
    if (input.value.trim() == "") {
      input.classList.add("reg-input_err")
      return emptyInputs += 1
    }
  })
  if (emptyInputs != 0) {
    return
  }

  const task = {
    driverId: 0,
    taskType: taskTypeOption,
    pickup: {
      name: taskPickUpName.value,
      email: taskPickUpEmail.value,
      phone: taskPickUpNumber.value,
      orderId: taskPickUpOrderId.value,
      description: taskPickUpDescription.value,
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
      address: {
        name: taskDeliveryAddress.value,
        lat: taskDeliveryAddressLat,
        lng: taskDeliveryAddressLng,
      },
    }
  }

  db.ref(`users/${uid}/tasks`)
    .push(task)
    .then(() => {
      addingTaskForm.reset();
      anime({
        targets: ".createTaskItemContainerPopup",
        left: ["0%", "-100%"],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
          createTaskItemContainerPopup.style.display = "none"
        }
      })
      popUpMessage.innerHTML = "task added succesfully";
      popUpMessage.classList.add("popup_message--succ");
      popUpMessage.style.display = "block";
      setTimeout(() => {
        popUpMessage.style.display = "none";
      }, 5000);
    });
});

// ===================================

// read tasks
db.ref(`users/${uid}/tasks`).on("value", function (tasks) {
  const assignedTab = document.querySelector(
    ".map_info-col__containar-tabTask--assigned"
  );
  assignedTab.innerHTML = "";
  tasks.forEach((taskData) => {
    task = taskData.val();

    const taskDriver = task.taskDriver;
    const pickUpBefore = task.pickup.pickUpBefore;
    const pickUpAddress = task.pickup.pickUpAddress;

    const deliverBefore = task.delivery.deliverBefore;
    const deliverAddress = task.delivery.deliverAddress;

    taskItemHTML = `<div class="map_info-col__item map_info-col__item-task">
                      <div class="map_info-col__item--assigning">
                        Assigned
                      </div>
                      <div class="map_info-col__item--image_container">
                        <div class="map_info-col__item--image">
                          <img src="assets/images/logos/defaul-profile-pic.png" alt="${taskDriver}" />
                        </div>
                        <p class="map_info-col__item--image_name">${taskDriver}</p>
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
                          <h4 class="map_info-col__item-task--title">${pickUpAddress}</h4>
                          <p class="map_info-col__item-task--address">
                            ${pickUpAddress}
                          </p>
                          <span class="map_info-col__item-task--status">Assigned</span>
                        </div>
                        <div class="map_info-col__item-task--dropoff">
                          <div class="map_info-col__item-task--time">${deliverBefore}</div>
                          <h4 class="map_info-col__item-task--title">${deliverAddress}</h4>
                          <p class="map_info-col__item-task--address">
                            ${deliverAddress}
                          </p>
                          <span class="map_info-col__item-task--status">Assigned</span>
                        </div>
                      </div>

                      <div class="map_info-col__item-task--more">
                        <i class="map_info-col__item-task--icon_more fas fa-chevron-right"></i>
                      </div>
                    </div>`;

    assignedTab.innerHTML += taskItemHTML;
  });
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
    drivers.forEach((driverData) => {
      const driver = driverData.val();
      const tab = Array.from(driverTabs).filter((driverTab) => {
        return driverTab.dataset.agenttab == 1;
      });

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
              <span class="map_info-col__item--tasks_circle">0</span>
              <p class="map_info-col__item--task-p">Task</p>
            </div>
            <div class="map_info-col__item--moreInfoBtn">
              <i class="fas fa-angle-right"></i>
            </div>
          </div>
        </div>`;

      tab[0].innerHTML += driverItem;
    });
  });
  // driversArray.forEach((driverData, index) => {
  //   const drivers = driverData
  //   console.log(drivers.val())
  //   console.log(drivers, index)

  // })
});

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