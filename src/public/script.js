const getById = (id) => {
  return document.getElementById(id);
};

const password = getById("password");
const confirmpassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;
const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

window.addEventListener("DOMContentLoader", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });
  token = params.token;
  userId = params.userId;

  const res = await fetch("/auth/verify-pass-reset-token", {
    methid: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      token,
      userId,
    }),
  });
  if (!res.ok) {
    const { error } = await res.json();

    loader.innerText = error;
    return;
  }
  loader.style.display = "none";
  container: style.display = "block";
});

const displayError = (errorMessage) => {
  success.style.display = "none";
  error.innerText = errorMessage;
  error.style.display = "block";
};

const displaySucess = (sucessMessage) => {
  error.style.display = "none";
  success.innerText = sucessMessage;
  success.style.display = "block";
};

const handleSubmit = async (evt) => {
  evt.preventDefault();
  // TODO: Add validation
  if (!password.value.trim()) {
    // render error
    return displayError("Password is missing");
  }
  if (!passRegex.test(password.value)) {
    // render error
    return displayError(
      "Password is too simple,Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    );
  }
  if (password.value !== confirmpassword.value) {
    // render error
    return displayError("Password does not match");
  }
  button.disable = true;
  button.innerText = "Please wait";
  //handle the submit
  const res = await fetch("/auth/update-password", {
    methid: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      token,
      userId,
      password: password.value,
    }),
  });

  button.disable = false;
  button.innerText = "Reset Password";

  if (!res.ok) {
    const { error } = await res.json();
    return displayError(error);
  }

  displaySucess("Your password is reset sucessfully!");

  //reset the form
  password.value = "";
  confirmpassword.value = "";
};

form.addEventListener("submit", handleSubmit);
