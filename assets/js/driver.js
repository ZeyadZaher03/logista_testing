var profileInput = document.querySelector("#driver_proile_picture");
const uid = Cookies.get("uid");

profileInput.addEventListener("change", () => {
  var reader = new FileReader();
  reader.onload = function (e) {
    document.querySelector(".profile_imageContent img").src = e.target.result;
  };
  reader.readAsDataURL(profileInput.files[0]);
});

const addDriverForm = document.querySelector(".addDriver_popup-form")
addDriverForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const requiredInputs = addDriverForm.querySelectorAll("input:required")
  let hasEmptyInputs = false;
  requiredInputs.forEach((requiredInput) => {
    return hasEmptyInputs = requiredInput.value == '' ? true : hasEmptyInputs;
  })

  if (!hasEmptyInputs) {
    const driverFirstName = addDriverForm["driverFirstName"].value;
    const driverLastName = addDriverForm["driverLastName"].value;
    const driverEmail = addDriverForm["driverEmail"].value;
    const driverPhoneNumber = addDriverForm["driverPhoneNumber"].value;
    const driverUsername = addDriverForm["driverUsername"].value;
    const driverPassword = addDriverForm["driverPassword"].value;
    const driverRole = addDriverForm["driverRole"].options[addDriverForm["driverRole"].selectedIndex].value;
    const driverTags = [];
    const driverTeam = addDriverForm["driverTeam"].options[addDriverForm["driverTeam"].selectedIndex].value;
    const driverAddress = addDriverForm["driverAddress"].value;
    const transportation_type = addDriverForm["transportation_type"].value;

    const driver = {
      driverFirstName,
      driverLastName,
      driverEmail,
      driverPhoneNumber,
      driverUsername,
      driverPassword,
      driverRole,
      driverTags,
      driverTeam,
      driverAddress,
      driverTransportation: transportation_type,
      driverProfileImage: "",
    }

    var reader = new FileReader();
    reader.onload = (e) => {
      driver.driverProfileImage = e.target.result
      db.ref(`users/${uid}/drivers/${driverTeam}`)
        .push(driver)
        .then(() => {
          console.log("done")
          addDriverForm.reset()
        })
        .catch(() => {
          console.log("err")
        })
    };
    reader.readAsDataURL(profileInput.files[0]);



  }



})