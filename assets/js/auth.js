auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("index.html");
  } else {
    // window.location.replace("signup.html");
  }
});

// login
const loginForm = document.querySelector(".loginForm");
const loginEmail = loginForm["login_email"];
const loginPassword = loginForm["login_password"];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  auth
    .signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
    .then((cred) => {
      const uid = cred.user.uid;
      Cookies.set("uid", uid, {
        expires: 30,
      });
    });
});

// singup
const signupForm = document.querySelector(".signupForm");
const signupEmail = signupForm["signup_email"];
const signupPassword = signupForm["signup_password"];

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  auth
    .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
    .then((cred) => {
      const uid = cred.user.uid;
      Cookies.set("uid", uid, {
        expires: 30,
      });

      db.ref(`users/${uid}`).set({
        email: cred.user.email,
        uid,
      });
    });
});

// const forgetPasswordBtn = document.querySelector("");
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
      console.log(err.message);
    });
});
