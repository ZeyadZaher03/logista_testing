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

const popupAreYouSure = (message, btnCancelName, btnDiscardName, callback) => {
	console.log("s");
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
		console.log("typeof callback")
		e.preventDefault()
		popupContainer.classList.remove("confirmation_contianer_popup--active")
		popupMessage.innerHTML = ""
		console.log(typeof callback)
		if (typeof callback == "function") return callback()
	})
}


// function to close module by esc key or close button
// closeBtn -> Close button selector
// Module -> Module Div selector
// validate -> should it validate if there is any empty inputs (true , false) 
const closeElement = (closeBtn, moduleContainer, validate) => {

	const selectedModal = document.querySelector(moduleContainer)
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