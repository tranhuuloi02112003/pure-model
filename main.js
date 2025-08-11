const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// <div class="modal-backdrop">
//   <div class="modal-container">
//     <button class="modal-close">&times;</button>
//     <div class="modal-content">Modal 1 Content</div>
//   </div>
// </div>

function Modal() {
  this.openModal = (options = {}) => {
    const { templateId } = options;
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

    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });
  };

  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    modalElement.ontransitionend = () => {
      modalElement.remove();
    };
  };
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
  modal.openModal({ templateId: "modal-1" });
};

$("#open-modal-2").onclick = () => {
  modal.openModal({ templateId: "modal-2" });
};
