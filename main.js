const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let currentModal = null;

$$("[data-modal]").forEach((element) => {
  element.onclick = function () {
    const modal = $(element.dataset.modal);
    if (modal) {
      modal.classList.add("show");
      currentModal = modal;
    } else {
      console.error(`Modal with ID ${element.dataset.modal} not found`);
    }
  };
});

$$(".modal-close").forEach((element) => {
  element.onclick = function () {
    const modal = element.closest(".modal-backdrop");

    if (modal) {
      modal.classList.remove("show");
      currentModal = modal;
      console.log(`Closed modal: ${modal.id}`);
    } else {
      console.error(`Modal not found`);
    }
  };
});

$$(".modal-backdrop").forEach((element) => {
  element.onclick = function (event) {
    if (event.target === element) {
      element.classList.remove("show");
      currentModal = null;
    }
  };
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && currentModal) {
    currentModal.classList.remove("show");
    currentModal = null;
  }
});
