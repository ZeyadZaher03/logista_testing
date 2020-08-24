// check if user and redirect ====================
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


// consts
const confirmationPopUp = document.querySelector(".confirmation_contianer_popup");
const confirmationPopUpActiveClass = "confirmation_contianer_popup--active";
const confirmationMessage = confirmationPopUp.querySelector(".confirmation_contianer_popup-message");
const confirmationContianerCancel = confirmationPopUp.querySelector("#confirmation_contianer_cancel");
const confirmationContianerDiscard = confirmationPopUp.querySelector("#confirmation_contianer_dicard");
const popUpMessage = document.querySelector(".popup_message");



const popUpMessgeFunction = (message, delay, status) => {
	popUpMessage.innerHTML = message;
	popUpMessage.classList.add(`popup_message--${status == 1 ? "succ" : "err"}`);
	popUpMessage.style.display = "block";
	setTimeout(() => {
		popUpMessage.style.display = "none";
		popUpMessage.innerHTML = "";
	}, delay * 1000);
	popUpMessage.addEventListener("click", () => {
		popUpMessage.style.display = "none";
	});
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
const addTaskMapArr = [];
const addTaskMapArrMarkers = [];
const arrayOfRoutes = [];

function initMap(mapOptions) {
	// Services
	const directionsRendererTwo = new google.maps.DirectionsRenderer();
	const directionsService = new google.maps.DirectionsService();
	const distanceMatrixService = new google.maps.DistanceMatrixService();

	// Functions
	const colorObject = (task) => {
		if (task.status == -1) {
			return {
				strokeColor: "#8c8c8c",
				strokeOpacity: 0.55,
			}
		}
		if (task.status == 0) {
			return {
				strokeColor: "#32a856"
			}
		}
		if (task.status == 1) {
			return {
				strokeColor: "#363636",
				strokeOpacity: 0.15,
			}
		}
	}

	const addRouteOnDashboardMap = (task) => {
		const directionsRenderer = new google.maps.DirectionsRenderer({
			polylineOptions: colorObject(task)
		});
		directionsRenderer.setMap(dashboardMap);
		directionsService.route({
				origin: task.pickup,
				destination: task.deliver,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(response, status) => {
				if (status === "OK") {
					directionsRenderer.setDirections(response);
				} else {
					window.alert("Directions request failed due to " + status);
				}
			}
		);
	}

	// DASHBOARD MAP
	var dashboardMap = new google.maps.Map(document.querySelector(".map_container"), {
		zoom: 8,
		center: {
			lat: 30.0444,
			lng: 31.2357,
		},
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	// ADD TASK ROUTES
	if (mapOptions) {
		if (mapOptions.mode == "addTasksRoutes") arrayOfRoutes.forEach((task) => addRouteOnDashboardMap(task))
	}

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
		google.maps.event.addListener(autoComplete, "place_changed", () => {
			var place = autoComplete.getPlace().geometry.location;
			const lat = place.lat();
			const lng = place.lng();

			const center = new google.maps.LatLng(lat, lng);
			map.panTo(center);

			const addMarker = new google.maps.Marker({
				position: {
					lat,
					lng,
				},
				map,
				title,
			});

			if (input.name === "taskPickUpAddress") {
				input.setAttribute("lng", lng);
				input.setAttribute("lat", lat);

				addTaskMapArr[0] = {
					place: input.value,
					lng: lng,
					lat: lat,
				};
				addTaskMapArrMarkers[0] = addMarker;
			}

			if (input.name === "taskDeliveryAddress") {
				input.setAttribute("lng", lng);
				input.setAttribute("lat", lat);

				addTaskMapArr[1] = {
					place: input.value,
					lng: lng,
					lat: lat,
				};
				addTaskMapArrMarkers[1] = addMarker;
			}

			directionsRendererTwo.setMap(addTaskMaps);

			function calculateAndDisplayRoute(directionsService, directionsRenderer) {
				directionsService.route({
						origin: addTaskMapArr[0],
						destination: addTaskMapArr[1],
						travelMode: google.maps.TravelMode.DRIVING,
					},
					(response, status) => {
						if (status === "OK") {
							directionsRenderer.setDirections(response);
						} else {
							window.alert("Directions request failed due to " + status);
						}
					}
				);
			}

			if (addTaskMapArr.length === 2) {
				addTaskMapArrMarkers.forEach((marker) => marker.setMap(null));
				calculateAndDisplayRoute(directionsService, directionsRendererTwo);
				distanceMatrixService.getDistanceMatrix({
						origins: [addTaskMapArr[0].place],
						destinations: [addTaskMapArr[1].place],
						travelMode: "DRIVING",
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						drivingOptions: {
							departureTime: new Date(Date.now()), // for the time N milliseconds from now.
							trafficModel: "pessimistic",
						},
						avoidTolls: false,
					},
					(res, status) => {
						document.querySelector("#taskDurationInSec").value =
							res.rows[0].elements[0].duration_in_traffic.value;
						document.querySelector("#taskDistance").value =
							res.rows[0].elements[0].distance.value;
					}
				);
			}
		});
	};

	// AUTOCOMPLETE MAP SEARCH INPUT
	var dropOffInput = document.querySelector("#taskDeliveryAddress");
	var autocompletedropOffInput = new google.maps.places.Autocomplete(dropOffInput);

	var pickupPoint = document.querySelector("#taskPickUpAddressSearchInput");
	var autocompletePickUp = new google.maps.places.Autocomplete(pickupPoint);

	// RESTRICT SEARCH TO EGYPT ONLY
	autocompletedropOffInput.setComponentRestrictions({
		country: ["eg"],
	});
	autocompletePickUp.setComponentRestrictions({
		country: ["eg"],
	});

	// RUN
	getDataAndSetMark(pickupPoint, autocompletePickUp, addTaskMaps, "Pick Up point");
	getDataAndSetMark(dropOffInput, autocompletedropOffInput, addTaskMaps, "Pick Up point");
}

// ===============

// =========== TASK ===========

const statusMessage = (status) => {
	if (status == -1) return "Unassigned"
	else if (status == 0) return "Assigned"
	else if (status == 1) return "Completed"
	else "Unassigned"
}

const readTasks = () => {
	db.ref(`users/${uid}/tasks`).on("value", function (tasks) {
		// TABS
		const unAssignedTab = document.querySelector(".map_info-col__containar-tabTask--unassigned");
		const assignedTab = document.querySelector(".map_info-col__containar-tabTask--assigned");
		const completedTab = document.querySelector(".map_info-col__containar-tabTask--completed");

		// EMPTY TABS
		unAssignedTab.innerHTML = "";
		assignedTab.innerHTML = "";
		completedTab.innerHTML = "";

		let numOfUnAssigned = 0;
		let numOfAssigned = 0;
		let numOfCompleted = 0;
		const numFromDb = tasks.numChildren()
		const arrayofTaskRoutes = []

		const showRoutes = () => {
			if (arrayOfRoutes.length === numFromDb) initMap({
				mode: "addTasksRoutes",
			})
		}

		const creatTaskItem = (taskSnapshot) => {
			const task = taskSnapshot.val()
			const taskId = taskSnapshot.key
			const pickupDate = moment.unix(task.pickup.date).format("MM/DD/YY- HH:MM");
			const status = task.status;
			const pickUpName = task.pickup.name;
			const pickUpAddress = task.pickup.address.name;

			const deliverDate = moment.unix(task.deliver.date).format("MM/DD/YY- HH:MM");
			const deliverName = task.deliver.name;
			const deliverAddress = task.deliver.address.name;
			const taskItemHTML =
				`<div data-id="${taskId}" class="map_info-col__item map_info-col__item-task">
					<div class="map_info-col__item--assigning">${statusMessage(status)}</div>
					<div class="map_info-col__item--image_container">
						<div class="map_info-col__item--image">
							<img src="assets/images/profile_image.jpg"/>
						</div>
						<p class="map_info-col__item--image_name">Zeyad</p>
					</div>
					<div class="map_info-col__item-task--progress">
						<div class="map_info-col__item-points map_info-col__item-points--fill map_info-col__item-point-frist">A</div>
						<div class="map_info-col__item-line"></div>
						<div class="map_info-col__item-points map_info-col__item-points--border map_info-col__item-point-last">B</div>
					</div>
					<div class="map_info-col__item-task--info">
						<div class="map_info-col__item-task--starting">
							<div class="map_info-col__item-task--time">${pickupDate}</div>
							<h4 class="map_info-col__item-task--title">${pickUpName}</h4>
							<p class="map_info-col__item-task--address">${pickUpAddress}</p>
							<span class="map_info-col__item-task--status"></span>
						</div>
						<div class="map_info-col__item-task--dropoff">
							<div class="map_info-col__item-task--time">${deliverDate}</div>
							<h4 class="map_info-col__item-task--title">${deliverName}</h4>
							<p class="map_info-col__item-task--address">${deliverAddress}</p>
							<span class="map_info-col__item-task--status"></span>
						</div>
					</div>
					<div id="taskDetails" data-task_id="${task.taskUid}" class="map_info-col__item-task--more">
					<i class="map_info-col__item-task--icon_more fas fa-chevron-right "></i>
					</div>
				</div>`;
			return taskItemHTML
		}

		tasks.forEach((taskData) => {
			const task = taskData.val();
			const isUnassigned = task.status == -1;
			const isAssigned = task.status == 0;
			const isCompleted = task.status == 1;

			const appendTaskToTab = () => {
				if (isUnassigned) {
					unAssignedTab.innerHTML += creatTaskItem(taskData)
					numOfUnAssigned++;
				} else if (isAssigned) {
					assignedTab.innerHTML += creatTaskItem(taskData)
					numOfAssigned++;
				} else if (isCompleted) {
					completedTab.innerHTML += creatTaskItem(taskData)
					numOfCompleted++;
				}
			}

			const changeTabNumber = () => {
				document.querySelector(".map_info-col__subhead-tasks[data-tasktab='0'] span").innerHTML = numOfUnAssigned;
				document.querySelector(".map_info-col__subhead-tasks[data-tasktab='1'] span").innerHTML = numOfAssigned;
				document.querySelector(".map_info-col__subhead-tasks[data-tasktab='2'] span").innerHTML = numOfCompleted;
			}

			const addRoutes = () => {
				const routeData = {
					mode: "addTasksRoutes",
					address: task.deliver.address,
					status: task.status,
					pickup: {
						lat: parseFloat(task.pickup.address.lat),
						lng: parseFloat(task.pickup.address.lng),
					},
					deliver: {
						lat: parseFloat(task.deliver.address.lat),
						lng: parseFloat(task.deliver.address.lng),
					},
				}
				arrayOfRoutes.push(routeData)
			}

			addRoutes()
			appendTaskToTab()
			changeTabNumber()
		});

		showRoutes()
		openTaskDetails()
	})
}

const closeTaskDetailsAnimation = (taskDetailsPopup) => {
	anime({
		targets: ".taskDetailsPopup",
		duration: 300,
		height: ["100%", "0"],
		bottom: ["0", "-100%"],
		easing: "easeInQuad",
		complete: () => {
			taskDetailsPopup.innerHTML = "";
			taskDetailsPopup.style.display = "none";
		},
	});
}

const closeTaskDetails = () => {
	const closeTaskDetailsButton = document.querySelector('#closetaskDetails');
	const taskDetailsPopup = document.querySelector('.taskDetailsPopup');
	closeTaskDetailsAnimation(taskDetailsPopup)
}

const openTaskDetails = () => {
	const taskItems = document.querySelectorAll(".map_info-col__item-task")
	taskItems.forEach((taskItem) => {
		const taskId = taskItem.dataset.id

		const createTaskDetails = (taskSnapshot) => {
			const task = taskSnapshot.val();
			const taskDetailsType = task.type;
			// const taskDetailsDriver = task.driverId;
			const taskDetailsStatus = task.status;
			const taskDetailsPickupName = task.pickup.name;
			const taskDetailsPickupPhone = task.pickup.phone;
			const taskDetailsPickupDescription = task.pickup.description;
			const taskDetailsPickupBefore = task.pickup.date;
			const taskDetailsPickupOrderId = task.pickup.orderId;
			const taskDetailsPickupAddress = task.pickup.address.name;
			// const taskDetailsPickupAddressLng = task.pickup.address.lng;
			// const taskDetailsPickupAddressLat = task.pickup.address.lat;
			const taskDetailsDriverName = task.deliver.name;
			const taskDetailsDriverPhone = task.deliver.phone;
			const taskDetailsDriverDescription = task.deliver.description;
			const taskDetailsDriverBefore = task.deliver.date;
			const taskDetailsDriverOrderId = task.deliver.orderId;
			const taskDetailsDriverAddress = task.deliver.address.name;
			// const taskDetailsDriverAddressLng = task.deliver.address.lng;
			// const taskDetailsDriverAddressLat = task.deliver.address.lat;

			return `<div class="taskDetails_header">
						<h3 class="taskDetails_haeder">Task details</h3>
						<i onclick='closeTaskDetails()' id="closetaskDetails" class="fas fa-times"> </i>
					</div>
					<div class="taskDetails_content">
						<p><b>driver</b>: ${"detaliedDriverName"}</p>
						<p><b>status</b>: ${statusMessage(taskDetailsStatus)}</p>
						<p><b>driverType</b>: ${taskDetailsType}</p>
						<h3>pickup</h3>
						<div class="pickup_details_container">
							<p><b>Name</b>: ${taskDetailsPickupName}</p>
							<p><b>Phone number</b>: ${taskDetailsPickupPhone}</p>
							<p><b>order ID</b>: ${taskDetailsPickupOrderId}</p>
							<p><b>description</b>: ${taskDetailsPickupDescription}</p>
							<p><b>Before</b>: ${moment.unix(taskDetailsPickupBefore).format("MM/DD/YY- HH:MM")}</p>
							<p><b>address</b>: ${taskDetailsPickupAddress}</p>
						</div>
						<h3>deliver</h3>
						<div class="pickup_details_container">
							<p><b>deliver Name</b>: ${taskDetailsDriverName}</p>
							<p><b>deliver Phone number</b>: ${taskDetailsDriverPhone}</p>
							<p><b>deliver order ID</b>: ${taskDetailsDriverOrderId}</p>
							<p><b>deliver description</b>: ${taskDetailsDriverDescription}</p>
							<p><b>deliver Before</b>: ${moment.unix(taskDetailsDriverBefore).format("MM/DD/YY- HH:MM")}</p>
							<p><b>deliver address</b>: ${taskDetailsDriverAddress}</p>
						</div>
						<button class="deleteDetails" data-task_id=${taskId} onclick="deleteTaskRun()" id="deleteTask">Delete</button>
					</div>`;
		}

		taskItem.addEventListener("click", () => {

			db.ref(`${tasksQuery}/${taskId}`).on("value", (taskSnapshot) => {
				const taskDetailedPopUp = document.querySelector(".taskDetailsPopup");
				taskDetailedPopUp.innerHTML = createTaskDetails(taskSnapshot);
				taskDetailedPopUp.style.display = "block";
				anime({
					targets: ".taskDetailsPopup",
					duration: 500,
					bottom: ["-0%", "0%"],
					height: ["0", "100%"],
					easing: "easeInQuad",
				});
			});
		})
	})
}

addTask();
readTasks()

// DELETE TASK

// ====== TASKS END ======


// ====== DRIVERS ======

const driverStatusMessage = (status) => {
	if (status == -1) return "offduty";
	if (status == 0) return "online";
	if (status == 1) return "busy";
	return "offduty";
};

const readDriver = () => {
	// // READ DRIVERS
	db.ref(`users/${uid}/drivers`).on("value", function (driversData) {
		const driverTabs = document.querySelectorAll(".map_info-col__containar-tabAgnet");
		const freeContainer = document.querySelector(".map_info-col__containar-tabAgnet[data-agentTab='0']");
		const busyContainer = document.querySelector(".map_info-col__containar-tabAgnet[data-agentTab='1']");
		const inActiveContainer = document.querySelector(".map_info-col__containar-tabAgnet[data-agentTab='2']");

		let numOfActive = 0;
		let numOfInActive = 0;
		let numOfBusy = 0;

		const changeTabNumber = () => {
			const freeAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='0'] span");
			const busyAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='1'] span");
			const inActiveAgentTabSpanContainer = document.querySelector(".map_info-col__subhead-item[data-agentTab='2'] span");

			freeAgentTabSpanContainer.innerHTML = numOfActive;
			busyAgentTabSpanContainer.innerHTML = numOfInActive;
			inActiveAgentTabSpanContainer.innerHTML = numOfBusy;
		}

		driverTabs.forEach((tab) => (tab.innerHTML = ""));

		const createDriverItem = (driverSnapshot) => {
			const driver = driverSnapshot.val();
			const driverId = driverSnapshot.key;
			const teamValue = driver.driverTeam.value;
			const fristName = driver.driverFirstName;
			const lastName = driver.driverLastName;
			const phoneNumber = driver.driverPhoneNumber;
			const status = driver.driverStatus;
			const profilePicture = driver.driverProfileImage;
			const numberOfAssignedTasks = driver.tasks ? driver.tasks.length : 0;

			return `<div class="map_info-col__item map_info-col__item-driver" data-team="${teamValue}" data-id="${driverId}">
	          <div class="map_info-col__item--image">
	            <img src="${profilePicture}" alt="${fristName} ${lastName}"/>
	            <div class="agent_activity agent_activity--${driverStatusMessage(status)}"></div>
	          </div>
	          <div class="map_info-col__item--info">
	            <h3 class="map_info-col__item--name">${fristName} ${lastName}</h3>
	            <p class="map_info-col__item--number">
	              <span class="map_info-col__item--number_nation">+20</span>${phoneNumber}</p>
	          </div>
	          <div class="map_info-col__item--assign">
	            <div class="map_info-col__item--tasksNumber">
	              <span class="map_info-col__item--tasks_circle">${numberOfAssignedTasks}</span>
	              <p class="map_info-col__item--task-p">Task</p>
	            </div>
	            <div class="map_info-col__item--moreInfoBtn">
	              <i class="fas fa-angle-right"></i>
	            </div>
	          </div>
	        </div>`;
		}

		driversData.forEach((teamsSnapshot) => {
			teamsSnapshot.forEach((driverSnapshot) => {
				const driver = driverSnapshot.val()
				const isOffDuty = driver.driverStatus == -1
				const isOnline = driver.driverStatus == 0
				const isBusy = driver.driverStatus == 1

				const appendDriverToTab = () => {
					if (isOffDuty) {
						busyContainer.innerHTML += createDriverItem(driverSnapshot)
						numOfInActive += 1;
					} else if (isOnline) {
						freeContainer.innerHTML += createDriverItem(driverSnapshot)
						numOfActive += 1;
					} else if (isBusy) {
						inActiveContainer.innerHTML += createDriverItem(driverSnapshot)
						numOfBusy += 1;
					} else {
						inActiveContainer.innerHTML += createDriverItem(driverSnapshot)
						numOfInActive += 1;
					}
				}

				appendDriverToTab()
			})
		});
		changeTabNumber()
		openDriverDetails()
	})
}

const closeDriverDeatailsAnimations = () => {
	anime({
		targets: ".driverDetailsPopup",
		duration: 150,
		height: ["100%", "0%"],
		bottom: ["0%", "-0%"],
		easing: "easeInQuad",
	});
}

const closeDriverDetails = () => {
	closeDriverDeatailsAnimations()
}

const openDriverDetails = () => {
	const driverItems = document.querySelectorAll(".map_info-col__item")
	const driverDetailsItem = document.querySelector(".driverDetailsPopup");

	const createDriverDetailsItem = (snapshot) => {
		const driver = snapshot.val();
		const driverId = snapshot.key;
		const driverUsername = driver.driverUsername;
		const driverFirstName = driver.driverFirstName;
		const driverLastName = driver.driverLastName;
		const driverStatusData = driver.driverStatus;
		const driverEmail = driver.driverEmail;
		const driverTeamValue = driver.driverTeam.value;
		const driverTeamName = driver.driverTeam.name;
		const driverPhoneNumber = driver.driverPhoneNumber;
		// const activeTaskId = driver.tasks ? driver.tasks[0] : 0;
		const driverDriveBy = driver.driverTransportation;

		return (
			`<div class="taskDetails_header">
			<h3 class="taskDetails_haeder">Driver details</h3>
			<i onclick="closeDriverDetails()" id="closeDriverDetails" class="fas fa-times"></i>
			</div>
			<div class="taskDetails_content">
			<p><b>Driver Name</b>: ${driverFirstName} ${driverLastName}</p>
			<p><b>Status</b>:${driverStatusMessage(driverStatusData)}</p>
			<p><b>Drive By</b>: ${driverDriveBy}</p>
			<p><b>Email Address</b>: ${driverEmail}</p>
			<p><b>Phone number</b>: ${driverPhoneNumber}</p>
			<p><b>Username</b>: ${driverUsername}</p>
			<p><b>Team</b>: ${driverTeamName}</p>
			<select id="changeTask"></select>
			<button class="deleteDetails" data-driver_team=${driverTeamValue} data-driver_id=${driverId} onclick="deleteDriverRun()"id="deleteDriver">Delete</button>
			</div>`);
		// <p><b>Active Task</b>: ${activeDriverTaskName ? activeDriverTaskName : "no tasks assigned"}</p>
	}

	const openDriverDetailsAnimation = () => {
		anime({
			targets: ".driverDetailsPopup",
			duration: 500,
			height: ["0", "100%"],
			bottom: ["-0%", "0%"],
			easing: "easeInQuad",
		});
	}

	driverItems.forEach((driverItem) => {
		const driverId = driverItem.dataset.id
		const driverTeam = driverItem.dataset.team
		driverItem.addEventListener("click", () => {
			driverDetailsItem.innerHTML = "";
			db.ref(`users/${uid}/drivers/${driverTeam}/${driverId}`).on("value", (snapshot) => {
				unAssingendTasksSelect()
				driverDetailsItem.innerHTML = createDriverDetailsItem(snapshot)
			})
			openDriverDetailsAnimation()
		})
	})
}


readDriver()
const unAssingendTasksSelect = async () => {
	const dbConnect = await db.ref(`users/${uid}/tasks`)
	const tasksData = await dbConnect.once("value", (snapshot) => snapshot)
	let unAssignedTasks = []
	tasksData.forEach((task) => {
		if (task.val().status != -1) return
		unAssignedTasks.push(task)
	})
	const taskSelectEle = document.querySelector("#changeTask")
	console.log(unAssignedTasks)
	unAssignedTasks.forEach((unAssignedTask) => {
		const id = unAssignedTask.key
		const task = unAssignedTask.val()
		console.log(id)
		console.log(task)
		taskSelectEle.innerHTML += `<option data-id="${id}">${task.pickup.name}</option>`
	})
}


// Front-End styling
navigationButton()
driverAndTaskTabsVisibility()
dashboardTabsActivate()
responsiveJs("900px", () => {
	const colTasks = document.querySelector(".map_tasks");
	const colAgents = document.querySelector(".map_agents");
	const colTasksBtn = document.querySelector(".map_info-col_collaps--tasks");
	const colAgentsBtn = document.querySelector(".map_info-col_collaps--agents");

	colTasks.classList.add("map_col--collapsed");
	colAgents.classList.add("map_col--collapsed");

	changeIcon(".map_info-col_icon--tasks", "fa-chevron-left", "fa-chevron-right");

	changeIcon(".map_info-col_icon--agents", "fa-chevron-right", "fa-chevron-left");

	colTasksBtn.addEventListener("click", () => {
		colAgents.classList.add("map_col--collapsed");
	});

	colAgentsBtn.addEventListener("click", () => {
		colTasks.classList.add("map_col--collapsed");
	});
});