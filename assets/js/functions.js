//	TOGGLE HIDE AND SHOW
//
//		arguments 
//			=================================================
//				-> btn that will be clicked
//				-> contanier which will be visible
//				-> the class that add the vis or hiding option
//			 =================================================
const toggleHideAndShow = (btn, container, className, callback) => {
	const buttonItem = document.querySelector(btn);
	const containerItem = document.querySelector(container);

	buttonItem.addEventListener("click", () => {
		if (typeof callback === "function") {
			callback();
		}
		containerItem.classList.toggle(className);
	});
};

// ERROR MESSAGE FUNCTION
//
//		arguments 
//			=================================================
//				-> id of the elemebt
//				-> class that will be added to make the element visible
//				-> message will be displayed inside the element
//			 =================================================
const errMessageViblity = (id, addedClass, message) => {
	const el = document.querySelector(`#${id}`)
	el.innerHTML = message
	el.classList.add(addedClass)

	setTimeout(() => {
		el.classList.remove(addedClass)
	}, 5000);
}

const changeIcon = (select, oldIconClass, newIconClass) => {
	const iconContainer = document.querySelector(select);
	if (iconContainer.classList.contains(oldIconClass)) {
		iconContainer.classList.remove(oldIconClass);
		iconContainer.classList.add(newIconClass);
	} else {
		iconContainer.classList.add(oldIconClass);
		iconContainer.classList.remove(newIconClass);
	}
};

const tabSystem = (
	tabBtnsClass,
	containerClass,
	activeTabClass,
	activeContainerClass,
	dataName
) => {
	const allTabsBtns = document.querySelectorAll(tabBtnsClass);
	const allContainers = document.querySelectorAll(containerClass);

	const resetContainers = () => {
		allContainers.forEach((container) => {
			container.classList.remove(activeContainerClass);
		});
	};

	const resetTabs = () => {
		allTabsBtns.forEach((btnTab) => {
			btnTab.classList.remove(activeTabClass);
		});
	};

	allTabsBtns.forEach((tabBtn) => {
		tabBtn.addEventListener("click", () => {
			const data = tabBtn.getAttribute(`data-${dataName}`);
			const container = document.querySelector(
				`[data-${dataName}='${data}']${containerClass} `
			);
			resetContainers();
			resetTabs();
			container.classList.add(activeContainerClass);
			tabBtn.classList.add(activeTabClass);
		});
	});
};

const responsiveJs = (width, callback) => {
	const windowWidth = window.matchMedia(`(max-width: ${width})`);
	if (windowWidth.matches) {
		if (typeof callback === "function") {
			callback();
		}
	}
};

// message -> LIKE "ARE YOU SURE YOU WANT TO DELETE THIS USER"
// btnCancelName -> "CANCEL" OR ANY BUTTON NAME YOU'D LIKE
// btnDiscardName -> "DELET" OR "DISCARD" ANY BUTTON NAME YOU'D LIKE
// callback -> THIS WILL BE A FUNCTION THAT WILL EXECUTE WHEN YOU SELECT DELETE
const popupAreYouSure = (message, btnCancelName, btnDiscardName, callback, escape) => {

	const popupshader = document.querySelector("#confirmation_bgshade")
	const popupContainer = document.querySelector(".confirmation_contianer_popup")
	const popupMessage = document.querySelector(".confirmation_contianer_popup-message")
	const popupCancelBtn = document.querySelector("#confirmation_contianer_cancel")
	const popupDiscardBtn = document.querySelector("#confirmation_contianer_dicard")
	popupMessage.innerHTML = message ? message : "are you sure?"
	popupCancelBtn.innerHTML = btnCancelName ? btnCancelName : "Cancel"
	popupDiscardBtn.innerHTML = btnDiscardName ? btnDiscardName : "Remove"

	const closePopup = () => {
		anime({
			targets: "#confirmation_bgshade",
			opacity: [1, 0],
			duration: 150,
			easing: "easeInOutQuad",
			complete: () => {
				popupshader.style.display = "none"
			}
		})

		anime({
			targets: ".confirmation_contianer_popup",
			opacity: [1, 0],
			duration: 150,
			delay: 50,
			easing: "easeInOutQuad",
			complete: () => {
				popupContainer.style.display = "none"
			}
		})
		return popupMessage.innerHTML = ""
	}

	popupshader.style.display = "flex"
	popupContainer.style.display = "flex"

	anime({
		targets: "#confirmation_bgshade",
		opacity: [0, 1],
		duration: 150,
		easing: "easeInOutQuad",
	})
	anime({
		targets: ".confirmation_contianer_popup",
		opacity: [0, 1],
		duration: 150,
		delay: 50,
		easing: "easeInOutQuad",
	})

	// if (escape) {
	// 	document.addEventListener("keydown", (e) => {
	// 		if (e.key === "Escape") closePopup()
	// 	})
	// }

	popupCancelBtn.addEventListener("click", (e) => {
		e.preventDefault()
		closePopup()
	})
	popupDiscardBtn.addEventListener("click", (e) => {
		e.preventDefault()
		closePopup()
		if (typeof callback == "function") return callback()
	})
}
const getDisplayValue = (element) => document.defaultView.getComputedStyle(element, null).display;
const getHeightValue = (element) => document.defaultView.getComputedStyle(element, null).height;


// function to close module by esc key or close button
// 		closeBtn -> Close button selector
// 		Module -> Module Div selector
// 		validate -> should it validate if there is any empty inputs (true , false) 
const closeElement = (closeBtn, moduleContainer, validate) => {

	const selectedModal = document.querySelector(moduleContainer)
	const closeModalBtn = document.querySelector(closeBtn)
	const closeAnimation = () => {
		anime({
			targets: moduleContainer,
			top: ['0px', '-150px'],
			opacity: ['1', '0'],
			duration: 300,
			easing: "easeInOutQuad",
			// complete() {
			// 	addTeamContainer.style.display = "none"
			// 	anime({
			// 		targets: "#taskDetailsPopup_bgshade",
			// 		opacity: ['1', '0'],
			// 		duration: 200,
			// 		easing: "easeInQuad",
			// 		complete() {
			// 			backgroundShade.style.display = "none"
			// 		}
			// 	})
			// }
		})
	}
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
			// selectedModal.style.display = "none"
			closeAnimation()
		})

		document.addEventListener("keydown", (e) => {
			if (e.key == "Escape") {
				// selectedModal.style.display = "none"
				closeAnimation()
			}
		})

	}

}

const assigneTaskToDriver = async (taskId, driverId) => {
	const driver = await db.ref(`users/${uid}/drivers/${driverId}`)
	const task = await db.ref(`users/${uid}/tasks/${taskId}`)
	task.update({
		status: 0
	})
	const driverTasksData = await driver.once("value", (snapshot) => snapshot)
	const hasTasks = driverTasksData.val().driverStatus
	if (!hasTasks) {
		const newVal = [taskId]
		driver.update({
			driverStatus: -1,
			tasks: newVal
		})
	} else {
		const oldVal = hasTasks
		if (oldVal.includes(taskId)) return
		const newVal = [...oldVal, taskId]
		driver.update({
			driverStatus: -1,
			tasks: newVal
		})
	}
}

// ADD TASK FUNCTION
const addTask = () => {
	// selectors
	const creatTaskPopup = document.querySelector(".createTaskItemContainerPopup");
	const addTaskForm = document.querySelector(".createTaskItemContainer_form");
	const openTaskBtn = document.querySelector(".createTaskBtnItem");
	const closeTaskBtn = document.querySelector(".createTaskItemContainer_close");
	const addTaskBtn = document.querySelector(".createTaskItemContainer_btn");

	let numberOfErrorInInputs = 0;

	// functions
	const openAddTask = () => {
		const openAddTaskAnimation = () => {
			creatTaskPopup.style.display = "flex";
			anime({
				targets: ".createTaskItemContainerPopup",
				left: ["-100%", "0%"],
				duration: 500,
				easing: "easeInOutQuad",
			});
		};

		openTaskBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openAddTaskAnimation();
		});
	};

	const closeTaskAnimation = () => {
		anime({
			targets: ".createTaskItemContainerPopup",
			left: ["0%", "-100%"],
			duration: 500,
			easing: "easeInOutQuad",
			complete: () => {
				creatTaskPopup.style.display = "none";
				addTaskForm.reset();
			},
		});
	};

	const closeAddTask = (options) => {
		const checkBeforClose = () => {
			let numberOfEmptyInputs;
			const addTaskInputs = addTaskForm.querySelectorAll("input");
			addTaskInputs.forEach((input) => {
				if (input.value.trim()) {
					return numberOfEmptyInputs++;
				}
			});
			if (numberOfEmptyInputs > 0) {
				const popupshader = document.querySelector("#confirmation_bgshade");
				if (getDisplayValue(popupshader) !== "none") return;
				popupAreYouSure(
					"are You sure you want to discard this task",
					"Cancel",
					"discard",
					() => {
						closeTaskAnimation();
					},
					false
				);
			} else {
				closeTaskAnimation();
			}
		};

		closeTaskBtn.addEventListener("click", (e) => {
			if (getDisplayValue(creatTaskPopup) == "none") return;
			return checkBeforClose();
		});

		if (!options.doesEscKeyClose) return;
		document.addEventListener("keydown", (e) => {
			if (getDisplayValue(creatTaskPopup) == "none") return;
			if (e.key !== "Escape") return;
			return checkBeforClose();
		});
	};

	const openAndCloseOcordion = () => {
		const ocordionButtons = addTaskForm.querySelectorAll(".ocordion_btn");

		ocordionButtons.forEach((ocordionButton) => {
			const ocordionBody = ocordionButton.nextSibling.nextSibling;
			const ocordionBodyId = ocordionButton.nextSibling.nextSibling.getAttribute("id");

			const openAnimation = () => {
				const ocordionBtnIcon = ocordionButton.querySelector("svg");
				ocordionBtnIcon.classList.remove("fa-chevron-down");
				ocordionBtnIcon.classList.add("fa-chevron-up");
				ocordionBody.style.display = "grid";
				anime({
					targets: `#${ocordionBodyId}`,
					height: ["0", "325px"],
					duration: 150,
					easing: "easeInOutQuad",
				});
			};

			const closeAnimation = () => {
				const ocordionBtnIcon = ocordionButton.querySelector("svg");
				ocordionBtnIcon.classList.remove("fa-chevron-up");
				ocordionBtnIcon.classList.add("fa-chevron-down");
				anime({
					targets: `#${ocordionBodyId}`,
					height: ["325px", "0"],
					duration: 150,
					easing: "easeInOutQuad",
					complete: () => {
						ocordionBody.style.display = "none";
					},
				});
			};

			ocordionButton.addEventListener("click", () => {
				if (getDisplayValue(ocordionBody) === "none") return openAnimation();
				return closeAnimation();
			});
		});
	};

	// form functions
	const checkPhoneNumber = () => {
		const phoneNumberInputs = addTaskForm.querySelectorAll("input[type=phone]");

		const phoneValidationOptions = (e) => {
			const charCode = e.which ? e.which : e.keyCode;
			const isNumber =
				event.ctrlKey ||
				event.altKey ||
				(47 < event.keyCode && event.keyCode < 58 && event.shiftKey == false) ||
				(95 < event.keyCode && event.keyCode < 106) ||
				event.keyCode == 8 ||
				event.keyCode == 9 ||
				(event.keyCode > 34 && event.keyCode < 40) ||
				event.keyCode == 46;

			// || e.target.value.length > 11
			if (!isNumber) {
				e.preventDefault();
			} else if (e.target.value.length > 11) {
				return (e.target.value = "");
			} else {
				return (e.target.value = e.target.value.trim());
			}
		};

		phoneNumberInputs.forEach((phoneNumberInput) => {
			phoneNumberInput.addEventListener("keydown", (e) => phoneValidationOptions(e));
			phoneNumberInput.addEventListener("change", (e) => phoneValidationOptions(e));
		});
	};

	const validateAddTaskInputs = () => {
		numberOfErrorInInputs = 0
		const validatePhones = () => {
			const phoneInputs = addTaskForm.querySelectorAll("input[type=phone]");
			phoneInputs.forEach((phoneInput) => {

				const inputContainer = phoneInput.parentElement
				const input = inputContainer.querySelector("input")
				const inputIcon = inputContainer.querySelector("svg")
				const inputErrorMessage = inputContainer.querySelector("span")
				if (phoneInput.value.trim() == "" || phoneInput.value.trim().length > 11) {
					inputErrorMessage.innerHTML = ""
					input.classList.add("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.add("addTaskErrorIcon")
					inputErrorMessage.classList.add("addTaskError")
					inputErrorMessage.innerHTML = "Phone Number Is not Valid"
					return numberOfErrorInInputs++
				} else {
					input.classList.remove("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.remove("addTaskErrorIcon")
					inputErrorMessage.classList.remove("addTaskError")
					inputErrorMessage.innerHTML = ""
				}
			});
		};

		const validateEmails = () => {
			const phoneInputs = addTaskForm.querySelectorAll("input[type=email]");
			phoneInputs.forEach((phoneInput) => {
				const validateEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				const isEmail = phoneInput.value.match(validateEmailRegex);
				const inputContainer = phoneInput.parentElement
				const input = inputContainer.querySelector("input")
				const inputIcon = inputContainer.querySelector("svg")
				const inputErrorMessage = inputContainer.querySelector("span")
				if (!isEmail) {
					inputErrorMessage.innerHTML = ""
					input.classList.add("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.add("addTaskErrorIcon")
					inputErrorMessage.classList.add("addTaskError")
					inputErrorMessage.innerHTML = "Email Is not Valid"
					return numberOfErrorInInputs++
				} else {
					input.classList.remove("addTaskErrorInput")
					inputIcon.classList.remove("addTaskErrorIcon")
					inputErrorMessage.classList.remove("addTaskError")
					inputErrorMessage.innerHTML = ""
				}
			});
		};

		const validateDates = () => {
			const dateInputs = addTaskForm.querySelectorAll("input[type=datetime-local]");
			dateInputs.forEach((dateInput) => {
				const inputContainer = dateInput.parentElement
				const input = inputContainer.querySelector("input")
				const inputIcon = inputContainer.querySelector("svg")
				const inputErrorMessage = inputContainer.querySelector("span")
				const currentDate = parseInt(moment(Date.now()).add(10, 'm').format("X"))
				const selectedDate = parseInt(moment(dateInput.value, "YYYY MM DD hh:mm").format("X"))
				if (currentDate > selectedDate) {
					inputErrorMessage.innerHTML = ""
					input.classList.add("addTaskErrorInput")
					inputIcon.classList.add("addTaskErrorIcon")
					inputErrorMessage.classList.add("addTaskError")
					inputErrorMessage.innerHTML = "Plase Select a Valid Date"
					return numberOfErrorInInputs++
				}
				if (dateInput.value == "") {
					inputErrorMessage.innerHTML = ""
					input.classList.add("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.add("addTaskErrorIcon")
					inputErrorMessage.classList.add("addTaskError")
					inputErrorMessage.innerHTML = "Please Select a Date"
					return numberOfErrorInInputs++
				} else {
					input.classList.remove("addTaskErrorInput")
					inputIcon.classList.remove("addTaskErrorIcon")
					inputErrorMessage.classList.remove("addTaskError")
					inputErrorMessage.innerHTML = ""
				}
			})
		}

		const validateTextInputs = () => {
			const textInputs = addTaskForm.querySelectorAll("input[isReq=true]");
			textInputs.forEach((textInput) => {
				const inputContainer = textInput.parentElement
				const input = inputContainer.querySelector("input")
				const inputIcon = inputContainer.querySelector("svg")
				const inputErrorMessage = inputContainer.querySelector("span")
				const inputValue = textInput.value.trim()
				if (inputValue == "") {
					inputErrorMessage.innerHTML = ""
					input.classList.add("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.add("addTaskErrorIcon")
					inputErrorMessage.classList.add("addTaskError")
					inputErrorMessage.innerHTML = "this input cannot Empty "
					return numberOfErrorInInputs++
				} else {
					input.classList.remove("addTaskErrorInput")
					if (inputIcon) inputIcon.classList.remove("addTaskErrorIcon")
					inputErrorMessage.classList.remove("addTaskError")
					inputErrorMessage.innerHTML = ""
				}
			})
		}

		validateTextInputs()
		validateEmails();
		validateDates();
		validatePhones();
	};

	const taskObject = () => {
		const taskTypeOption = addTaskForm["taskType"];
		const taskTypeValue = taskTypeOption.options[taskTypeOption.selectedIndex].value;
		const duration = document.querySelector("#taskDurationInSec").value;
		const distance = document.querySelector("#taskDistance").value;
		const driversSelect = document.querySelector("#addTaskDrivers")
		const driver = driversSelect.options[driversSelect.selectedIndex].value
		const driverId = driversSelect.options[driversSelect.selectedIndex].dataset.id
		const driverTeam = driversSelect.options[driversSelect.selectedIndex].dataset.team
		const pickupName = addTaskForm["taskPickUpName"].value;
		const pickupNumber = addTaskForm["taskPickUpNumber"].value;
		const pickupEmail = addTaskForm["taskPickUpEmail"].value;
		const pickupOrderId = addTaskForm["taskPickUpOrderId"].value;
		const pickupAddress = addTaskForm["taskPickUpAddress"];
		const pickupAddressName = pickupAddress.value;
		const pickupAddressLng = pickupAddress.getAttribute("lng");
		const pickupAddressLat = pickupAddress.getAttribute("lat");
		const pickupDate = moment(addTaskForm["taskPickUpPickUpBefore"].value, "YYYY MM DD hh:mm").format("X")
		const pickupDescription = addTaskForm["taskPickUpDescription"].value;

		const deliverName = addTaskForm["taskDeliveryName"].value;
		const deliverNumber = addTaskForm["taskDeliveryNumber"].value;
		const deliverEmail = addTaskForm["taskDeliveryEmail"].value;
		const deliverOrderId = addTaskForm["taskDeliveryOrderId"].value;
		const deliverAddress = addTaskForm["taskDeliveryAddress"];
		const deliverAddressName = deliverAddress.value;
		const deliverLng = deliverAddress.getAttribute("lng");
		const deliverLat = deliverAddress.getAttribute("lat");
		const deliverDate = moment(addTaskForm["taskDeliveryPickUpBefore"].value, "YYYY MM DD hh:mm").format("X")
		const deliverDescription = addTaskForm["taskDeliveryDescription"].value;

		const task = {
			type: taskTypeValue,
			estTime: duration,
			distance: distance,
			status: -1,
			pickup: {
				name: pickupName,
				email: pickupEmail,
				phone: pickupNumber,
				orderId: pickupOrderId,
				date: pickupDate,
				description: pickupDescription ? pickupDescription : "",
				address: {
					name: pickupAddressName,
					lat: pickupAddressLat,
					lng: pickupAddressLng,
				},
			},
			deliver: {
				name: deliverName,
				email: deliverEmail,
				phone: deliverNumber,
				orderId: deliverOrderId,
				date: deliverDate,
				description: deliverDescription ? deliverDescription : "",
				address: {
					name: deliverAddressName,
					lat: deliverLat,
					lng: deliverLng,
				},
			}
		}

		const hasDriver = driver.trim() != "" || !!driverId || !!driverTeam

		if (hasDriver) {
			task.driver = {
				id: driver,
				team: driverTeam,
				name: driverId
			}
			task.status = 0
		}

		return task
	}

	const driverSelectOptions = async () => {
		const driverQuery = db.ref(`users/${uid}/drivers`)
		const snapshot = await driverQuery.once("value")
		const driversSelect = document.querySelector("#addTaskDrivers")
		driversSelect.innerHTML = ""
		driversSelect.innerHTML = `<option value="" disabled selected>Please Select A driver</option>`
		snapshot.forEach((driverSnapshot) => {
			const driver = driverSnapshot.val()
			const driverId = driverSnapshot.key
			const fristName = driver.driverFirstName
			const lastName = driver.driverLastName
			const team = driver.driverTeam.value
			driversSelect.innerHTML += `<option data-team=${team} data-id="${driverId}">${fristName} ${lastName}</option>`
		})
		if (!snapshot.val()) {
			driversSelect.innerHTML = `<option value="" disabled selected>Please Select A driver</option>`
			driversSelect.innerHTML = `<option value="" disabled selected>You Have No drivers :(</option>`
		}
	}

	const addTaskToDataBase = () => {
		db.ref(tasksQuery)
			.push(taskObject())
			.then((snapshot) => {
				const task = snapshot.val()
				const driverId = task.driver.id
				const driverTeam = task.driver.team
				const taskId = snapshot.key
				if (!!taskDriver) assigneTaskToDriver(taskId, driverTeam, driverId)
			})
	}

	const submitAddTask = () => {
		validateAddTaskInputs()
		if (numberOfErrorInInputs !== 0) return
		addTaskToDataBase()
		closeTaskAnimation()
	}

	addTaskForm.addEventListener('submit', (e) => e.preventDefault())
	addTaskBtn.addEventListener('click', (e) => {
		e.preventDefault()
		submitAddTask()
	})

	driverSelectOptions()
	openAndCloseOcordion();
	checkPhoneNumber();
	openAddTask();
	closeAddTask({
		doesEscKeyClose: true,
	});
};

const dashboardTabsActivate = () => {
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
}

const driverAndTaskTabsVisibility = () => {
	toggleHideAndShow(".map_info-col_collaps--tasks", ".map_tasks", "map_col--collapsed", () =>
		changeIcon(".map_info-col_icon--tasks", "fa-chevron-left", "fa-chevron-right")
	);
	toggleHideAndShow(".map_info-col_collaps--agents", ".map_agents", "map_col--collapsed", () =>
		changeIcon(".map_info-col_icon--agents", "fa-chevron-right", "fa-chevron-left")
	);
}

const navigationButton = () => {
	toggleHideAndShow(".navigation_hamburgerBtn", ".hamburger_menu", "hamburger_menu--active");
	toggleHideAndShow(".hamburger_btn-back_container", ".hamburger_menu", "hamburger_menu--active");
	toggleHideAndShow(".pickup_btn", ".pickup_contanier", "ocordion_body--active");
	toggleHideAndShow(".dropoff_btn", ".dropoff_container", "ocordion_body--active");
	toggleHideAndShow(".notification_btn", ".notification_nav_container", "nav_popup--active");
	toggleHideAndShow(".menu_navigation_btn", ".menu_navigation_container", "nav_popup--active");
}

const navigationButtonsActivation = () => {
	toggleHideAndShow(".notification_btn", ".notification_nav_container", "nav_popup--active");
	toggleHideAndShow(".navigation_hamburgerBtn", ".hamburger_menu", "hamburger_menu--active");
	toggleHideAndShow(".hamburger_btn-back_container", ".hamburger_menu", "hamburger_menu--active");
	toggleHideAndShow(".menu_navigation_btn", ".menu_navigation_container", "nav_popup--active");

}

const hamburgerMenu = () => {
	toggleHideAndShow(".navigation_hamburgerBtn", ".hamburger_menu", "hamburger_menu--active");
	toggleHideAndShow(".hamburger_btn-back_container", ".hamburger_menu", "hamburger_menu--active");
}

const closeByEscape = (callback) => {
	document.addEventListener("keydown", (e) => {
		if (e.key == "Escape") callback()
	})
}


const closeByButton = (button, callback) => {
	button.addEventListener("click", (e) => {
		e.preventDefault()
		callback()
	})
}