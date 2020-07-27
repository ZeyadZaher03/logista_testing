const uid = Cookies.get("uid");

if (!uid) {
  auth.signOut();
}

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.replace("signup.html");
  } else {
    // User not logged in or has just logged out.
  }
});

//logout
const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => auth.signOut());
const popUpMessage = document.querySelector(".popup_message");
popUpMessage.addEventListener("click", () => {
  popUpMessage.style.display = "none";
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
    document.querySelector(".createTaskItemContainer_map"),
    {
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
const createTaskItemContainerPopup = document.querySelector(
  ".createTaskItemContainerPopup"
);
const createTaskItemContainer = document.querySelector(
  ".createTaskItemContainer"
);

closeTaskBtn.addEventListener("click", () => {
  createTaskItemContainerPopup.classList.remove(
    "createTaskItemContainerPopup--active"
  );
  createTaskItemContainer.classList.remove("createTaskItemContainer--active");
});

addTaskBtn.addEventListener("click", (e) => {
  createTaskItemContainerPopup.classList.add(
    "createTaskItemContainerPopup--active"
  );
  createTaskItemContainer.classList.add("createTaskItemContainer--active");
});

const addingTaskForm = document.querySelector(".createTaskItemContainer_form");
const createTaskItemContainer_btn = document.querySelector(
  ".createTaskItemContainer_btn"
);

addingTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskType =
    addingTaskForm["taskType"].options[addingTaskForm["taskType"].selectedIndex]
      .value;

  const taskPickUpName = addingTaskForm["taskPickUpName"].value;
  const taskPickUpNumber = addingTaskForm["taskPickUpNumber"].value;
  const taskPickUpEmail = addingTaskForm["taskPickUpEmail"].value;
  const taskPickUpOrderId = addingTaskForm["taskPickUpOrderId"].value;
  const taskPickUpAddressLng = addingTaskForm["taskPickUpAddress"].getAttribute(
    "lng"
  );
  const taskPickUpAddressLat = addingTaskForm["taskPickUpAddress"].getAttribute(
    "lat"
  );
  const taskPickUpPickUpBefore = addingTaskForm["taskPickUpPickUpBefore"].value;
  const taskPickUpDescription = addingTaskForm["taskPickUpDescription"].value;

  const taskDeliveryName = addingTaskForm["taskDeliveryName"].value;
  const taskDeliveryPhone = addingTaskForm["taskDeliveryNumber"].value;
  const taskDeliveryEmail = addingTaskForm["taskDeliveryEmail"].value;
  const taskDeliveryOrderId = addingTaskForm["taskDeliveryOrderId"].value;
  const taskDeliveryAddressLng = addingTaskForm[
    "taskDeliveryAddress"
  ].getAttribute("lng");
  const taskDeliveryAddressLat = addingTaskForm[
    "taskDeliveryAddress"
  ].getAttribute("lat");
  const taskDeliveryPickUpBefore =
    addingTaskForm["taskDeliveryPickUpBefore"].value;
  const taskDeliveryDescription =
    addingTaskForm["taskDeliveryDescription"].value;

  const taskItem = {
    taskType: taskType,
    taskDriver: "zeyad",

    pickup: {
      name: taskPickUpName,
      phone: taskPickUpNumber,
      email: taskPickUpEmail,
      orderId: taskPickUpOrderId,
      pickUpAddress: {
        taskPickUpAddressLng,
        taskPickUpAddressLat,
      },
      pickUpBefore: taskPickUpPickUpBefore,
      description: taskPickUpDescription,
    },

    delivery: {
      name: taskDeliveryName,
      phone: taskDeliveryPhone,
      email: taskDeliveryEmail,
      orderId: taskDeliveryOrderId,
      deliverAddress: {
        taskDeliveryAddressLng,
        taskDeliveryAddressLat,
      },
      deliverBefore: taskDeliveryPickUpBefore,
      description: taskDeliveryDescription,
    },
    status: 0,
  };

  db.ref(`users/${uid}/tasks`)
    .push(taskItem)
    .then(() => {
      addingTaskForm.reset();
      createTaskItemContainerPopup.classList.remove(
        "createTaskItemContainerPopup--active"
      );
      createTaskItemContainer.classList.remove(
        "createTaskItemContainer--active"
      );

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

toggleHideAndShow(
  ".createTaskBtn",
  ".createTaskContainer",
  "nav_popup--active"
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
