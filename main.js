const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal() {
  this.openModal = (options = {}) => {
    const { templateId, allowBackdropClose = true } = options;
    const template = $(`#${templateId}`);

    if (!template) {
      console.error(`Template with ID ${templateId} not found.`);
      return;
    }

    const content = template.content.cloneNode(true);

    // Create modal elements
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "&times;";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append content and elements
    modalContent.append(content);
    container.append(closeBtn, modalContent);
    backdrop.append(container);
    document.body.append(backdrop);

    setTimeout(() => {
      backdrop.classList.add("show");
    }, 0);

    //Attach event listeners
    closeBtn.onclick = () => {
      this.closeModal(backdrop);
    };

    if (allowBackdropClose) {
       backdrop.onclick = (e) => {
         if (e.target === backdrop) {
           this.closeModal(backdrop);
         }
        };
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });

    // Disable scrolling on the body
    document.body.classList.add("no-scroll");
    return backdrop;
  };

  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    modalElement.ontransitionend = () => {
      modalElement.remove();
      // Enable scrolling on the body
    document.body.classList.remove("no-scroll");
    };
  };
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
  modal.openModal({ templateId: "modal-1" });
};

$("#open-modal-2").onclick = () => {
  const modalElement = modal.openModal({
    templateId: "modal-2",
    allowBackdropClose: false,
  });

  const form = modalElement.querySelector("#login-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const username = form.username.value;
      const password = form.password.value;
      console.log("Logging in:", { username, password });
    };
  }
};
