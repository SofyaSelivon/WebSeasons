function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function ensureCSRF() {
  return window.CSRF_TOKEN || getCookie('csrftoken');
}


document.addEventListener("DOMContentLoaded", function () {
  const authButton = document.getElementById("auth-button");
  const authModal = document.getElementById("auth-modal");
  const closeModal = document.querySelector(".close");
  const authForm = document.getElementById("auth-form");
  const switchForm = document.getElementById("switch-form");
  const formTitle = document.getElementById("form-title");
  const logoutContainer = document.getElementById("logout-container");
  const logoutButton = document.getElementById("logout-button");
  const authContainer = document.getElementById("auth-container");

  checkAuth();

  authButton.addEventListener("click", () => {
    authModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    authModal.style.display = "none";
  });

  switchForm.addEventListener("click", (e) => {
    e.preventDefault();
    if (formTitle.innerText === "Вход") {
      formTitle.innerText = "Регистрация";
      authForm.querySelector("button").innerText = "Зарегистрироваться";
      switchForm.innerHTML = 'Уже есть аккаунт? <a href="#">Войти</a>';
    } else {
      formTitle.innerText = "Вход";
      authForm.querySelector("button").innerText = "Войти";
      switchForm.innerHTML = 'Нет аккаунта? <a href="#">Зарегистрироваться</a>';
    }
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await ensureCSRF();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const csrfToken = getCookie("csrftoken");

    if (formTitle.innerText === "Регистрация") {
      try {
        const response = await fetch("/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
            "first-name": firstName,
            "last-name": lastName,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error("Ошибка регистрации: " + text);
        }

        const data = await response.json();
        alert("Регистрация успешна!");
        authModal.style.display = "none";
        checkAuth();
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка регистрации: " + error.message);
      }
    } else {
      try {
        const response = await fetch("/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error("Ошибка входа: " + text);
        }

        const data = await response.json();
        authModal.style.display = "none";
        checkAuth();
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка входа: " + error.message);
      }
    }
  });

  async function checkAuth() {
    try {
      const response = await fetch("/check_auth/", {
      credentials: "include"
      });
      const data = await response.json();
      if (data.authenticated) {
        showUser(data.user);
      }
    } catch (error) {
      console.error("Ошибка проверки авторизации:", error);
    }
  }

  function showUser(userData) {
    const userInfo = document.getElementById("user-info");
    const userName = document.getElementById("user-name");
    userName.textContent = `${userData.first_name} ${userData.last_name}`;
    userInfo.style.display = "flex";
    authContainer.style.display = "none";
    logoutContainer.style.display = "block";
  }

  logoutButton.addEventListener("click", async () => {
    await ensureCSRF();

    try {
      await fetch("/logout/", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),

        },
        credentials:"include",
      });
      location.reload();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      alert("Произошла ошибка при выходе");
    }
  });

  const feedbackButton = document.getElementById("feedback-button");
  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackClose = document.querySelector(".feedback-close");

  feedbackButton.addEventListener("click", () => {
    feedbackModal.style.display = "block";
  });

  feedbackClose.addEventListener("click", () => {
    feedbackModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  });

  document.getElementById("feedback-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("feedback-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const message = document.getElementById("feedback-message").value.trim();

    const namePattern = /^[А-ЯЁ][а-яё]+$/;
    if (!namePattern.test(name)) {
      alert("Имя должно начинаться с заглавной буквы и содержать только буквы!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Пожалуйста, введите корректный email!");
      return;
    }

    if (message.length < 5) {
      alert("Сообщение должно содержать не менее 5 символов!");
      return;
    }

    try {
      const response = await fetch("/feedback/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        alert("Сообщение отправлено!");
        e.target.reset();
        feedbackModal.style.display = "none";
      } else {
        alert("Ошибка при отправке.");
      }
    } catch (error) {
      alert("Произошла ошибка. Попробуйте позже.");
    }
  });

});
