const faqButtons = document.querySelectorAll(".faq-item");
const form = document.querySelector(".lead-form");
const statusMessage = document.querySelector(".form-status");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    button.querySelector("small").textContent = isOpen ? "+" : "−";
    panel.classList.toggle("is-open", !isOpen);
  });
});

function setFieldState(field, hasError) {
  field.classList.toggle("has-error", hasError);
}

function isValidContact(value) {
  const normalized = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\d\s-]{7,}$/;

  return emailPattern.test(normalized) || phonePattern.test(normalized);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameField = form.querySelector("#name").closest(".form-field");
    const contactField = form.querySelector("#contactMethod").closest(".form-field");
    const messageField = form.querySelector("#message").closest(".form-field");
    const submitButton = form.querySelector(".form-submit");
    const replyTo = form.querySelector("#replyTo");

    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();
    const message = form.elements.message.value.trim();

    const errors = {
      name: name.length < 2,
      contact: !isValidContact(contact),
      message: message.length < 4,
    };

    setFieldState(nameField, errors.name);
    setFieldState(contactField, errors.contact);
    setFieldState(messageField, errors.message);

    statusMessage.className = "form-status";

    if (errors.name || errors.contact || errors.message) {
      statusMessage.textContent = "Перевірте поля форми та спробуйте ще раз.";
      statusMessage.classList.add("is-error");
      return;
    }

    if (replyTo) {
      replyTo.value = isEmail(contact) ? contact : "";
    }

    submitButton.disabled = true;
    submitButton.textContent = "Надсилаємо...";
    statusMessage.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error("FormSubmit request failed");
      }

      statusMessage.textContent =
        "Дякуємо. Заявку надіслано, і ми скоро з вами зв’яжемося.";
      statusMessage.classList.add("is-success");
      form.reset();
      window.location.href = "thanks.html";
    } catch (error) {
      statusMessage.textContent =
        "Не вдалося надіслати заявку. Спробуйте ще раз або напишіть напряму на ihnatovvlad7@gmail.com.";
      statusMessage.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Записатися на консультацію";
    }
  });
}
