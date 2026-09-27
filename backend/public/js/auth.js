const registerForm =
  document.getElementById("registerForm");

const loginForm =
  document.getElementById("loginForm");

const authMessage =
  document.getElementById("authMessage");


function showAuthMessage(message, success) {
  if (!authMessage) {
    return;
  }

  authMessage.textContent = message;

  authMessage.className =
    success ? "success" : "error";
}


if (registerForm) {
  registerForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const username =
        document
          .getElementById("registerUsername")
          .value
          .trim();

      const email =
        document
          .getElementById("registerEmail")
          .value
          .trim();

      const password =
        document
          .getElementById("registerPassword")
          .value;

      try {
        const response =
          await fetch(
            "/api/auth/register",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username,
                email,
                password,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          showAuthMessage(
            data.error || "Register failed",
            false
          );

          return;
        }

        showAuthMessage(
          "Registration successful.",
          true
        );

        registerForm.reset();

      } catch (error) {
        console.error(error);

        showAuthMessage(
          "Register request failed.",
          false
        );
      }
    }
  );
}


if (loginForm) {
  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const username =
        document
          .getElementById("loginUsername")
          .value
          .trim();

      const password =
        document
          .getElementById("loginPassword")
          .value;

      try {
        const response =
          await fetch(
            "/api/auth/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username,
                password,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          showAuthMessage(
            data.error || "Login failed",
            false
          );

          return;
        }

        showAuthMessage(
          `Login successful: ${data.user.username}`,
          true
        );

        loginForm.reset();

      } catch (error) {
        console.error(error);

        showAuthMessage(
          "Login request failed.",
          false
        );
      }
    }
  );
}