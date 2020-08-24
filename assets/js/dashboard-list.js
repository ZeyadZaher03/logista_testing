const taskDetailsMapMarkersArray = [];

function initMap(mapObject) {
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
	getDataAndSetMark(dropOffInput, autocompletedropOffInput, addTaskMaps, "Drop of point");

	if (mapObject) {
		if (mapObject.mode == "add") {
			if (mapObject.mapType == "popupSeeLocation") {
				const bound = new google.maps.LatLngBounds();
				const mapObjectPickup = mapObject.pickup;
				const mapObjectDropoff = mapObject.dropOff;
				bound.extend(new google.maps.LatLng(mapObjectPickup.lat, mapObjectPickup.lng));
				bound.extend(new google.maps.LatLng(mapObjectDropoff.lat, mapObjectDropoff.lng));

				const centerLat = bound.getCenter().lat();
				const centerLng = bound.getCenter().lng();
				const directionsService = new google.maps.DirectionsService();
				const directionsDisplay = new google.maps.DirectionsRenderer();

				pickupLatLng = {
					lat: parseFloat(mapObjectPickup.lat),
					lng: parseFloat(mapObjectPickup.lng),
				};

				dropoffLatLng = {
					lat: parseFloat(mapObjectDropoff.lat),
					lng: parseFloat(mapObjectDropoff.lng),
				};
				const trafficLayer = new google.maps.TrafficLayer();
				const seeTaskLocationMap = new google.maps.Map(
					document.querySelector(".popupTaskMap"), {
						zoom: 10,
						center: {
							lat: centerLat,
							lng: centerLng,
						},
						disableDefaultUI: true,
					}
				);
				trafficLayer.setMap(seeTaskLocationMap);

				const addMarker = (myLatLng, map, title, iconSrc, arrayToPush) => {
					const marker = new google.maps.Marker({
						position: myLatLng,
						map,
						title,
						icon: !!iconSrc ? iconSrc : undefined,
					});
					return marker;
				};

				directionsService.route({
						origin: pickupLatLng,
						destination: dropoffLatLng,
						travelMode: google.maps.TravelMode.DRIVING,
						avoidTolls: true,
					},
					(res, status) => {
						if (status === "OK") {
							directionsDisplay.setMap(seeTaskLocationMap);
							// directionsDisplay.setOptions({
							// 	polylineOptions: {
							// 		strokeColor: "red",
							// 	},
							// });
							directionsDisplay.setDirections(res);
						} else {
							directionsDisplay.setMap(null);
							directionsDisplay.setDirections(null);
						}
					}
				);
			}
		}

		if (mapObject.mode == "remove") {
			taskDetailsMapMarkersArray.forEach((marker) => marker.setMap(null));
			taskDetailsMapMarkersArray.splice(0, taskDetailsMapMarkersArray.length);
		}
	}
}
// ===============
// ===============
// ===============
// ===============
// ===============
// ===============
// ===============

const task_container = document.querySelector("#taskListContainer");
const createTaskListElement = (databaseTasksItemSnapshot) => {
	// creat elements
	const taskItem = document.createElement("div");
	const locationFromEle = document.createElement("p");
	const locationToEle = document.createElement("p");
	const taskESTEle = document.createElement("p");
	const taskStatusEle = document.createElement("p");
	const DriverNameSelect = document.createElement("select");
	const openLocationButton = document.createElement("button");
	const moreTaskDetailsButton = document.createElement("button");
	const editTaskButton = document.createElement("button");
	const deleteTaskButton = document.createElement("button");

	// organizing and ordering elements
	taskItem.appendChild(locationFromEle);
	taskItem.appendChild(locationToEle);
	taskItem.appendChild(taskESTEle);
	taskItem.appendChild(taskStatusEle);
	taskItem.appendChild(DriverNameSelect);
	taskItem.appendChild(moreTaskDetailsButton);
	taskItem.appendChild(openLocationButton);
	taskItem.appendChild(editTaskButton);
	taskItem.appendChild(deleteTaskButton);

	//add classes
	locationFromEle.classList.add("list_item");
	locationToEle.classList.add("list_item");
	deleteTaskButton.classList.add("defaultButton", "defaultButton--delete");
	editTaskButton.classList.add("defaultButton", "defaultButton--edit");
	taskItem.classList.add("task_item-list");
	moreTaskDetailsButton.classList.add("list_buttons", "taskDetails-popupBtn", "defaultButton--edit");
	openLocationButton.classList.add("openLocationPopup", "list_buttons", "defaultButton--edit");

	// retriving data from database
	const task = databaseTasksItemSnapshot.val();
	const taskId = databaseTasksItemSnapshot.key;
	const taskDriverId = task.driverId;
	const taskDriverTeam = task.driverTeam;
	const pickAddressName = task.pickup.address.name;
	const deliverAddressName = task.deliver.address.name;
	const status = task.status;

	// filling elements with data
	locationFromEle.innerHTML = pickAddressName;
	locationToEle.innerHTML = deliverAddressName;
	taskStatusEle.innerHTML = statusText(status);
	taskESTEle.innerHTML = "18min";
	DriverNameSelect.innerHTML = "";
	moreTaskDetailsButton.innerHTML = "See More";
	moreTaskDetailsButton.dataset.id = taskId;
	if (taskDriverId != 0) {
		moreTaskDetailsButton.dataset.Did = taskDriverId;
		moreTaskDetailsButton.dataset.team = taskDriverTeam;
	}
	openLocationButton.innerHTML = "View on Map";
	deleteTaskButton.dataset.id = taskId;
	editTaskButton.innerHTML = "Edit";
	deleteTaskButton.innerHTML = "Delete";
	taskItem.dataset.id = taskId;

	//load drivers in drivers select
	fillDriversSelect(taskDriverId, DriverNameSelect);

	// add task item to task container
	task_container.appendChild(taskItem);
};

const listViewTasksItemGenrator = () => {
	db.ref(`users/${uid}/tasks`).on("value", (snapshot) => {
		task_container.innerHTML = "";
		// add taskitem for each task
		snapshot.forEach((taskData) => {
			createTaskListElement(taskData);
		});

		// task item functions
		const viewTaskDetailsButtons = document.querySelectorAll(".taskDetails-popupBtn");
		openTaskDetailsPopup(viewTaskDetailsButtons);
		closePopupDefault(".closeBtnContianer", ".taskDetailsPopup_container", "#taskDetailsPopup_bgshade");
		viewTaskOnTheMapPopup();
		deleteTask();
		closePopupDefault("#closeTaskLocation", ".popupTaskMap_container", "#popupTaskMap_bgshade", () => {
			initMap({
				mapType: "popupSeeLocation",
				mode: "remove"
			});
		});
	});
};

const fillDriversSelect = (driverTaskId, driverSelect) => {
	db.ref(`users/${uid}/drivers`).on("value", (snapshot) => {
		const driversByTeam = snapshot;
		driversByTeam.forEach((driversData) => {
			const drivers = driversData;
			driverSelect.innerHTML = "";
			drivers.forEach((driverData) => {
				const driver = driverData.val();
				const driverId = driverData.key;
				const driverTeam = driver.driverTeam;
				const driverFirstName = driver.driverFirstName;
				const driverLastName = driver.driverLastName;

				if (driverTaskId == driverId) {
					const DriverNameOption = `<option value="${driverId}" selected>${driverFirstName}</option>`;
					driverSelect.innerHTML += DriverNameOption;
				} else {
					const DriverNameOption = `<option value="${driverId}">${driverFirstName}</option>`;
					driverSelect.innerHTML += DriverNameOption;
				}
			});
		});
		driverSelect.innerHTML += `<option>Select A driver</option>`;
	});
};


const addDataInTaskDetailsContainer = (taskId, driverId, teamValue) => {
	const taskDetailsContainer = document.querySelector(".taskDetailsPopup_content");
	const taskDetailsContainerInputs = taskDetailsContainer.querySelectorAll(`[data-task-item]`);

	taskDetailsContainerInputs.forEach((input) => (input.innerHTML = ""));

	// General data selectors
	const taskDetailsPickupAddress = taskDetailsContainer.querySelector(`[data-task-item="from"]`);
	const taskDetailsDeliverAddress = taskDetailsContainer.querySelector(`[data-task-item="to"]`);

	// pickup data selectors
	const taskDetailsPickupName = taskDetailsContainer.querySelector(`[data-task-item="name_pickup"]`);
	const taskDetailsPickupEmail = taskDetailsContainer.querySelector(`[data-task-item="email_pickup"]`);
	const taskDetailsPickupPhoneNumber = taskDetailsContainer.querySelector(
		`[data-task-item="phoneNumebr_pickup"]`
	);
	const taskDetailsPickupBefore = taskDetailsContainer.querySelector(`[data-task-item="date_pickup"]`);
	const taskDetailsPickupOrderId = taskDetailsContainer.querySelector(`[data-task-item="orderId_pickup"]`);

	// deliver data selectors
	const taskDetailsDeliverName = taskDetailsContainer.querySelector(`[data-task-item="name_deliver"]`);
	const taskDetailsDeliverEmail = taskDetailsContainer.querySelector(`[data-task-item="email_deliver"]`);
	const taskDetailsDeliverPhoneNumber = taskDetailsContainer.querySelector(
		`[data-task-item="phoneNumebr_deliver"]`
	);
	const taskDetailsDeliverBefore = taskDetailsContainer.querySelector(`[data-task-item="date_deliver"]`);
	const taskDetailsDeliverOrderId = taskDetailsContainer.querySelector(`[data-task-item="orderId_deliver"]`);

	// driver data selectors
	const taskDetailsDriverName = taskDetailsContainer.querySelector(`[data-task-item="name_driver"]`);
	const taskDetailsDriverEmail = taskDetailsContainer.querySelector(`[data-task-item="email_driver"]`);
	const taskDetailsDriverUsername = taskDetailsContainer.querySelector(`[data-task-item="username_driver"]`);
	const taskDetailsDriverPhoneNumber = taskDetailsContainer.querySelector(
		`[data-task-item="phoneNumber_driver"]`
	);
	const taskDetailsDriverImage = taskDetailsContainer.querySelector(`[data-task-item="image_driver"]`);


	// fetching from database
	db.ref(`users/${uid}/tasks/${taskId}`).once("value", (snapshot) => {
		// database data to var
		const task = snapshot.val();
		const taskId = snapshot.key;
		const pickup = task.pickup;
		const deliver = task.deliver;

		const to = pickup.address.name;
		const from = deliver.address.name;

		const pickupBefore = pickup.pickupBefore;
		const pickupName = pickup.name;
		const pickupEmail = pickup.email;
		const pickupPhone = pickup.phone;
		const pickupOrderId = pickup.orderId;

		const deliverBefore = deliver.deliverBefore;
		const deliverName = deliver.name;
		const deliverEmail = deliver.email;
		const deliverPhone = deliver.phone;
		const deliverOrderId = deliver.orderId;

		// filling selectors with database data
		taskDetailsPickupAddress.innerHTML = to;
		taskDetailsDeliverAddress.innerHTML = from;

		taskDetailsPickupName.innerHTML = pickupName;
		taskDetailsPickupEmail.innerHTML = pickupEmail;
		taskDetailsPickupPhoneNumber.innerHTML = pickupPhone;
		taskDetailsPickupBefore.innerHTML = pickupBefore;
		taskDetailsPickupOrderId.innerHTML = pickupOrderId;

		taskDetailsDeliverName.innerHTML = deliverName;
		taskDetailsDeliverEmail.innerHTML = deliverEmail;
		taskDetailsDeliverPhoneNumber.innerHTML = deliverPhone;
		taskDetailsDeliverBefore.innerHTML = deliverBefore;
		taskDetailsDeliverOrderId.innerHTML = deliverOrderId;
	});

	//if it's assingend to driver
	if (!!driverId || !!teamValue) {
		db.ref(`users/${uid}/drivers/${teamValue}/${driverId}`).once("value", (snapshot) => {
			// fetch from db
			const driver = snapshot.val();
			const name = `${driver.driverFirstName} ${driver.driverLastName}`;
			const email = driver.driverEmail;
			const username = driver.driverUsername;
			const phone = driver.driverPhoneNumber;
			//filling selectors
			taskDetailsDriverName.innerHTML = name;
			taskDetailsDriverEmail.innerHTML = email;
			taskDetailsDriverImage.src = driver.driverProfileImage
			taskDetailsDriverImage.setAttribute("alt", name)
			taskDetailsDriverUsername.innerHTML = username;
			taskDetailsDriverPhoneNumber.innerHTML = phone;
		});
	} else {
		// hide the input
		document.querySelector("#driverInfo").style.display = "none";
	}
};

const deleteTask = () => {
	const deleteButtons = document.querySelectorAll(".defaultButton--delete");
	deleteButtons.forEach((deleteButton) => {
		deleteButton.addEventListener("click", () => {
			const taskId = deleteButton.dataset.id;
			popupAreYouSure("Are You Sure You Want to Delete this Task", "Cancel", "Delete", () => {
				// console.log(taskId)
				db.ref(`users/${uid}/tasks/${taskId}`).remove();
			});
		});
	});
};

const defaultPopupOpenAnimation = (popupSelector, parentSelector) => {
	const popup = document.querySelector(popupSelector);

	popup.parentNode.style.display = "flex";
	anime({
		targets: parentSelector,
		opacity: 1,
		duration: 150,
		easing: "easeInOutQuad",
		complete: () => {
			popup.style.display = "flex";
			anime({
				targets: popupSelector,
				scale: [0.5, 1],
				opacity: 1,
				duration: 200,
				easing: "easeInOutQuad",
			});
		},
	});
};

const defaultPopupCloseAnimation = (popupSelector, parentSelector) => {
	const popup = document.querySelector(popupSelector);
	const parentPopup = document.querySelector(parentSelector);
	anime({
		targets: popupSelector,
		scale: [1, 0.5],
		opacity: 0,
		duration: 200,
		easing: "easeInOutQuad",
		complete: () => {
			popup.style.display = "none";
			anime({
				targets: parentSelector,
				opacity: 0,
				duration: 100,
				easing: "easeInOutQuad",
				complete: () => {
					parentPopup.style.display = "none";
				},
			});
		},
	});
};

const closePopupDefault = (buttonSelector, selector, parentSelector, callback) => {
	const button = document.querySelector(buttonSelector);
	button.addEventListener("click", () => {
		defaultPopupCloseAnimation(selector, parentSelector);
		if (typeof callback === "function") callback();
	});

	document.addEventListener("keydown", (e) => {
		if (document.querySelector(selector).parentNode.style.display === "none") return;
		if (e.key != "Escape") return;
		defaultPopupCloseAnimation(selector, parentSelector);
		if (typeof callback === "function") callback();
	});
};

const viewTaskOnTheMapPopup = () => {
	const openTaskMapButtons = document.querySelectorAll(".openLocationPopup");
	openTaskMapButtons.forEach((openTaskMapButton) => {
		openTaskMapButton.addEventListener("click", () => {
			const taskId = openTaskMapButton.parentNode.dataset.id;
			db.ref(`users/${uid}/tasks/${taskId}/pickup/address`).on("value", (snapshot) => {
				const pickupAddress = snapshot.val();
				db.ref(`users/${uid}/tasks/${taskId}/deliver/address`).on("value", (snapshot) => {
					const deliverAddress = snapshot.val();
					initMap({
						mapType: "popupSeeLocation",
						pickup: pickupAddress,
						dropOff: deliverAddress,
						mode: "add",
					});
				});
			});
			defaultPopupOpenAnimation(".popupTaskMap_container", "#popupTaskMap_bgshade");
		});
	});
};

const openTaskDetailsPopup = (buttons) => {
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			defaultPopupOpenAnimation(".taskDetailsPopup_container", "#taskDetailsPopup_bgshade");
			const id = button.dataset.id;
			const driverId = button.dataset.Did;
			const teamValue = button.dataset.team;
			addDataInTaskDetailsContainer(id, driverId, teamValue);
		});
	});
};

const statusText = (status) => {
	if (status == -1) return "Unassigned"
	else if (status == 0) return "Assigned"
	else if (status == 1) return "Completed"
	return "Unassigned"
}

listViewTasksItemGenrator();
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================
// ===================

// toggleHideAndShow(".navigation_hamburgerBtn", ".hamburger_menu", "hamburger_menu--active");
// toggleHideAndShow(".hamburger_btn-back_container", ".hamburger_menu", "hamburger_menu--active");
// toggleHideAndShow(".notification_btn", ".notification_nav_container", "nav_popup--active");
// toggleHideAndShow(".menu_navigation_btn", ".menu_navigation_container", "nav_popup--active");
// tabSystem(
// 	".map_info-col__subhead-tasks",
// 	".map_info-col__containar-tabTask",
// 	"map_info-col__subhead-item--active",
// 	"map_info-col__containar-tabTask--active",
// 	"tasktab"
// );
// tabSystem(
// 	".map_info-col__subhead-agents",
// 	".map_info-col__containar-tabAgnet",
// 	"map_info-col__subhead-item--active",
// 	"map_info-col__containar-tabAgnet--active",
// 	"agentTab"
// );

// const addingTaskForm = document.querySelector(".createTaskItemContainer_form");
// const addTaskBtn = document.querySelector(".createTaskBtnItem");
// const addTaskBtnSec = document.querySelector("#addDriverBtn");
// const closeTaskBtn = document.querySelector(".createTaskItemContainer_close");
// const closeTaskkey = document.querySelector(".createTaskItemContainer_close");
// const createTaskItemContainerPopup = document.querySelector(".createTaskItemContainerPopup");
// const createTaskItemContainer = document.querySelector(".createTaskItemContainer");
// const createTaskItemContainer_btn = document.querySelector(".createTaskItemContainer_btn");

// // FUNCTIONS
// const closeAddTaskPopUpAnimation = () => {
// 	anime({
// 		targets: ".createTaskItemContainerPopup",
// 		left: ["0%", "-100%"],
// 		duration: 500,
// 		easing: "easeInOutQuad",
// 		complete: () => {
// 			createTaskItemContainerPopup.style.display = "none";
// 			addingTaskForm.reset();
// 		},
// 	});
// };

// const closeAddTaskPopUp = () => {
// 	const taskForm = document.querySelector(".createTaskItemContainer_form");

// 	// CHECK IF THERE IS FILLED INPUTS
// 	let isEmptyInputs = 0;

// 	taskForm.querySelectorAll("input").forEach((input) => {
// 		if (input.value.trim() != "") {
// 			return (isEmptyInputs += 1);
// 		}
// 		// IF THERE IS A FILLED INPUT SHOW A CONFIRM ATION MESSAGE
// 		if (isEmptyInputs > 0) {
// 			// SHOW
// 			confirmationPopUp.classList.add(confirmationPopUpActiveClass);
// 			confirmationMessage.innerHTML = "Are you sure you want to discard this task ?!!";

// 			// CANCEL CLICKED
// 			confirmationContianerCancel.innerHTML = "Cancel";
// 			confirmationContianerCancel.onclick = () => {
// 				confirmationPopUp.classList.remove(confirmationPopUpActiveClass);
// 				return (confirmationMessage.innerHTML = "");
// 			};

// 			// DISCARD CLICKED
// 			confirmationContianerDiscard.innerHTML = "Discard";
// 			confirmationContianerDiscard.onclick = () => {
// 				confirmationPopUp.classList.remove("confirmation_contianer_popup--active");
// 				confirmationMessage.innerHTML = "";
// 				closeAddTaskPopUpAnimation();
// 			};
// 		} else {
// 			closeAddTaskPopUpAnimation();
// 		}
// 	});
// };

// // CLOSE BY BUTTON
// closeTaskBtn.addEventListener("click", (e) => {
// 	e.preventDefault();
// 	closeAddTaskPopUp();
// });

// // CLOSE POP UP WITH ESC KEY
// document.body.addEventListener("keydown", function (e) {
// 	if (createTaskItemContainerPopup.style.display != "none") {
// 		if (e.key == "Escape" || e.keyCode == 27) {
// 			closeAddTaskPopUp();
// 		}
// 	}
// });

// // VALIDATE TASK INPUTS
// addingTaskForm.querySelectorAll("input").forEach((requiredInput) => {
// 	requiredInput.addEventListener("change", () => {
// 		if (requiredInput.value != "") {
// 			requiredInput.classList.remove("reg-input_err");
// 		}
// 	});
// });

// // ADD TASK
// const openAddTask = (button) => {
// 	// ADD TASK FORM VISIBILITY
// 	button.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		createTaskItemContainerPopup.style.display = "flex";
// 		anime({
// 			targets: ".createTaskItemContainerPopup",
// 			left: ["-100%", "0%"],
// 			duration: 500,
// 			easing: "easeInOutQuad",
// 		});
// 	});
// };

// openAddTask(addTaskBtn);
// openAddTask(addTaskBtnSec);

// addingTaskForm.addEventListener("submit", (e) => {
// 	e.preventDefault();
// 	const taskType = addingTaskForm["taskType"];
// 	const taskTypeOption = taskType.options[taskType.selectedIndex];
// 	const taskPickUpName = addingTaskForm["taskPickUpName"];
// 	const taskPickUpNumber = addingTaskForm["taskPickUpNumber"];
// 	const taskPickUpEmail = addingTaskForm["taskPickUpEmail"];
// 	const taskPickUpOrderId = addingTaskForm["taskPickUpOrderId"];
// 	const taskPickUpAddress = addingTaskForm["taskPickUpAddress"];
// 	const taskPickUpAddressValue = taskPickUpAddress;
// 	const taskPickUpAddressLng = taskPickUpAddress.getAttribute("lng");
// 	const taskPickUpAddressLat = taskPickUpAddress.getAttribute("lat");
// 	const taskPickUpPickUpBefore = addingTaskForm["taskPickUpPickUpBefore"];
// 	const taskPickUpDescription = addingTaskForm["taskPickUpDescription"];
// 	const taskDeliveryName = addingTaskForm["taskDeliveryName"];
// 	const taskDeliveryPhone = addingTaskForm["taskDeliveryNumber"];
// 	const taskDeliveryEmail = addingTaskForm["taskDeliveryEmail"];
// 	const taskDeliveryOrderId = addingTaskForm["taskDeliveryOrderId"];
// 	const taskDeliveryAddress = addingTaskForm["taskDeliveryAddress"];
// 	const taskDeliveryAddressLng = taskDeliveryAddress.getAttribute("lng");
// 	const taskDeliveryAddressLat = taskDeliveryAddress.getAttribute("lat");
// 	const taskDeliveryPickUpBefore = addingTaskForm["taskDeliveryPickUpBefore"];
// 	const taskDeliveryDescription = addingTaskForm["taskDeliveryDescription"];
// 	const addTaskDriverId = addingTaskForm["addTaskDriverId"];
// 	const addTaskDriverIdOption = addTaskDriverId.options[addTaskDriverId.selectedIndex];
// 	const addTaskDriverTeamValue =
// 		addTaskDriverIdOption.value === 0
// 			? addTaskDriverId.options[addTaskDriverId.selectedIndex].dataset.team
// 			: 0;
// 	let driverId;

// 	const addTaskValidate = [
// 		taskTypeOption,
// 		taskPickUpName,
// 		taskPickUpNumber,
// 		taskPickUpEmail,
// 		taskPickUpOrderId,
// 		taskPickUpAddressValue,
// 		taskPickUpPickUpBefore,
// 		taskDeliveryName,
// 		taskDeliveryPhone,
// 		taskDeliveryEmail,
// 		taskDeliveryOrderId,
// 		taskDeliveryAddress,
// 		taskDeliveryPickUpBefore,
// 		addTaskDriverId,
// 	];

// 	let emptyInputs = 0;

// 	addTaskValidate.forEach((input) => {
// 		if (input.value.trim() == "") {
// 			input.classList.add("reg-input_err");
// 			document.querySelector("#addTaskErrorMessage").innerHTML = "This Fields cant be blank";
// 			document.querySelector("#addTaskErrorMessage").classList.add("addTaskErrMessage--active");
// 			return (emptyInputs += 1);
// 		}
// 	});

// 	if (emptyInputs != 0) return;
// 	const task = {
// 		driverId: addTaskDriverIdOption.value,
// 		taskUid: "",
// 		status: -1,
// 		type: taskTypeOption.value,
// 		pickup: {
// 			name: taskPickUpName.value,
// 			email: taskPickUpEmail.value,
// 			phone: taskPickUpNumber.value,
// 			orderId: taskPickUpOrderId.value,
// 			description: taskPickUpDescription.value,
// 			pickupBefore: taskPickUpPickUpBefore.value,
// 			address: {
// 				name: taskPickUpAddress.value,
// 				lat: taskPickUpAddressLat,
// 				lng: taskPickUpAddressLng,
// 			},
// 		},
// 		deliver: {
// 			name: taskDeliveryName.value,
// 			email: taskDeliveryEmail.value,
// 			phone: taskDeliveryPhone.value,
// 			orderId: taskDeliveryOrderId.value,
// 			description: taskDeliveryDescription.value,
// 			deliverBefore: taskDeliveryPickUpBefore.value,
// 			address: {
// 				name: taskDeliveryAddress.value,
// 				lat: taskDeliveryAddressLat,
// 				lng: taskDeliveryAddressLng,
// 			},
// 		},
// 	};

// 	db.ref(`users/${uid}/tasks`)
// 		.push(task)
// 		.then((cred) => {
// 			const taskUid = cred.getKey();
// 			cred.update({
// 				taskUid,
// 			});
// 			if (addTaskDriverIdOption.value != 0) {
// 				let pastValue;
// 				db.ref(
// 					`users/${uid}/drivers/${addTaskDriverTeamValue}/${addTaskDriverIdOption.value}/tasks`
// 				)
// 					.once("value", (cred) => (pastValue = cred.val()))
// 					.then(() => {
// 						let newValue;
// 						if (pastValue !== null) {
// 							newValue = [...pastValue, taskUid];
// 						} else {
// 							newValue = [taskUid];
// 						}

// 						db.ref(
// 							`users/${uid}/drivers/${addTaskDriverTeamValue}/${addTaskDriverIdOption.value}`
// 						).update({
// 							tasks: newValue,
// 							driverStatus: 0,
// 						});
// 					});
// 			}

// 			anime({
// 				targets: ".createTaskItemContainerPopup",
// 				left: ["0%", "-100%"],
// 				duration: 500,
// 				easing: "easeInOutQuad",
// 				complete: () => {
// 					createTaskItemContainerPopup.style.display = "none";
// 				},
// 			});
// 			popUpMessage.innerHTML = "task added succesfully";
// 			popUpMessage.classList.add("popup_message--succ");
// 			popUpMessage.style.display = "block";
// 			setTimeout(() => {
// 				popUpMessage.style.display = "none";
// 			}, 5000);
// 		})
// 		.catch((err) => {
// 			popUpMessage.innerHTML = err.message;
// 			popUpMessage.classList.add("popup_message--err");
// 			popUpMessage.style.display = "block";
// 			setTimeout(() => {
// 				popUpMessage.style.display = "none";
// 			}, 5000);
// 		});
// });

// // ===================================

// // Task Details ===================================
// const taskDetailsPopup = document.querySelector(".taskDetailsPopup_container");
// const taskDetailsPopupBackgroundShade = taskDetailsPopup.parentNode;

// // ===================================