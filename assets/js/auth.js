// redirect user if he is logged in
auth.onAuthStateChanged((user) => {
  if (user || Cookies.get("logedin")) {
    return window.location.replace("index.html");
  }
});

// login system
const loginForm = document.querySelector(".loginForm");
const loginEmail = loginForm["login_email"];
const loginPassword = loginForm["login_password"];
const loginRemberMe = loginForm["login_rember"];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (loginEmail.value.trim() == "" || loginPassword.value.trim() == "") {
    return errMessageViblity("loginErrMessage", "errorMessage--active", "Plase Write Your Email and Password")
  }

  auth
    .signInWithEmailAndPassword(loginEmail.value.trim(), loginPassword.value.trim())
    .then((cred) => {
      const uid = cred.user.uid;
      if (Cookies.get("uid")) {
        if (loginRemberMe.checked) {
          Cookies.set("logedin", true, {
            expires: 7,
          });
        }
        Cookies.set("uid", uid, {
          expires: 30,
        });
      }
    })
    .catch((err) => {
      console.log(err.code)
      if (err.code == "auth/invalid-email") {
        errMessageViblity("loginErrMessage", "errorMessage--active", "wronge email or address")
      } else {
        errMessageViblity("loginErrMessage", "errorMessage--active", "something went wronge please try again later")
      }
    })
});

// singup system
const signupForm = document.querySelector(".signupForm");
const signupEmail = signupForm["signup_email"];
const signupPassword = signupForm["signup_password"];
const signupFristName = signupForm["signup_firstName"];
const signupLastName = signupForm["signup_lastName"];
const signupTerms = signupForm["signup_term"];

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const requiredInputs = signupForm.querySelectorAll("input:required")
  requiredInputs.forEach((requiredInput) => {
    if (requiredInput.value.trim() == "") {
      requiredInput.classList.add("reg-input_err")
    }
  })

  if (!signupTerms.checked) {
    return errMessageViblity("loginErrMessage", "errorMessage--active", "plase accept terms")
  }

  if (signupEmail.value.trim() == "" || signupPassword.value.trim() == "" || signupFristName.value.trim() == "" || signupLastName.value.trim() == "") {
    return errMessageViblity("loginErrMessage", "errorMessage--active", "plase fill required inputs")
  }

  auth
    .createUserWithEmailAndPassword(signupEmail.value.trim(), signupPassword.value.trim())
    .then((cred) => {
      const uid = cred.user.uid;
      Cookies.set("uid", uid, {
        expires: 30,
      });
      console.log(4)

      db.ref(`users/${uid}`).set({
        email: cred.user.email,
        fristName: signupFristName.value,
        lastName: signupLastName.value
      });
    })
    .catch((err) => {
      if (err.code == "auth/email-already-in-use") {
        return errMessageViblity("loginErrMessage", "errorMessage--active", err.message)
      } else {
        return errMessageViblity("loginErrMessage", "errorMessage--active", "something went wronge please try again ")
      }
    })
});

const forgetPasswordcontainer = document.querySelector(".forgetPassword");
const forgetPasswordEmail = forgetPasswordcontainer["forgetpassword_email"];

forgetPasswordcontainer.addEventListener("submit", (e) => {
  e.preventDefault();
  auth
    .sendPasswordResetEmail(forgetPasswordEmail.value)
    .then(() => {
      window.alert("Email has been sent to you, Please check and verify.");
    })
    .catch((err) => {
      return errMessageViblity("forgetPasswordErrMessage", "errorMessage--active", "something went wronge please try again")
    });
});


// function run
tabSystem(
  ".registration_link",
  ".registration_tab",
  "registration_link--active",
  "registration_tab--active",
  "tab_reg"
);