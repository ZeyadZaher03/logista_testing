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