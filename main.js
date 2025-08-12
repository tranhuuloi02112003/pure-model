const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
  this.opt = Object.assign(
    {
      destroyOnClose: true,
      footer: false,
      cssClass: [],
      closeMethods: ["button", "overlay", "escape"],
    },
    options
  );

  this.template = $(`#${this.opt.templateId}`);

  if (!this.template) {
    console.error(`Template with ID ${this.opt.templateId} not found.`);
    return;
  }

  const { closeMethods } = this.opt;
  this._allowBackdropClose = closeMethods.includes("overlay");
  this._allowEscapeClose = closeMethods.includes("escape");
  this._allowButtonClose = closeMethods.includes("button");
  this._footerButtons = [];

  this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Modal.prototype._build = function () {
  const content = this.template.content.cloneNode(true);

  // Create modal elements
  this._backdrop = document.createElement("div");
  this._backdrop.className = "modal-backdrop";

  const container = document.createElement("div");
  container.className = "modal-container";

  this.opt.cssClass.forEach((className) => {
    if (typeof className === "string") {
      container.classList.add(className);
    }
  });

  if (this._allowButtonClose) {
    const closeBtn = this._createButton("&times;", "modal-close", () =>
      this.close()
    );

    container.append(closeBtn);
  }

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  // Append content and elements
  modalContent.append(content);
  container.append(modalContent);

  if (this.opt.footer) {
    this._modalFooter = document.createElement("div");
    this._modalFooter.className = "modal-footer";

    this._renderFooterContent();
    this._renderFooterButtons();

    container.append(this._modalFooter);
  }

  this._backdrop.append(container);
  document.body.append(this._backdrop);
};

Modal.prototype.setFooterContent = function (html) {
  this._footerContent = html;
  this._renderFooterContent();
};

Modal.prototype._renderFooterContent = function () {
  if (this._modalFooter && this._footerContent) {
    this._modalFooter.innerHTML = this._footerContent;
  }
};

Modal.prototype.addFooterButton = function (title, cssClass, callback) {
  const button = this._createButton(title, cssClass, callback);
  this._footerButtons.push(button);

  this._renderFooterButtons();
};

Modal.prototype._renderFooterButtons = function () {
  if (this._modalFooter) {
    this._footerButtons.forEach((button) => {
      this._modalFooter.append(button);
    });
  }
};

Modal.prototype._createButton = function (title, cssClass, callback) {
  const button = document.createElement("button");
  button.innerHTML = title;
  button.className = cssClass;
  button.onclick = callback;

  return button;
};

Modal.prototype.open = function () {
  Modal.elements.push(this);
  if (!this._backdrop) this._build();

  setTimeout(() => {
    this._backdrop.classList.add("show");
  }, 0);

  //Attach event listeners
  if (this._allowBackdropClose) {
    this._backdrop.onclick = (e) => {
      if (e.target === this._backdrop) {
        this.close();
      }
    };
  }

  if (this._allowEscapeClose) {
    document.addEventListener("keydown", this._handleEscapeKey);
  }

  // Disable scrolling on the body
  document.body.style.paddingRight = `${this._getScrollbarWidth()}px`;
  document.body.classList.add("no-scroll");

  this._onTransitionEnd(this.opt.onOpen);

  return this._backdrop;
};

Modal.prototype._handleEscapeKey = function (e) {
  const lastModal = Modal.elements[Modal.elements.length - 1];
  if (e.key === "Escape" && lastModal === this) {
    this.close();
  }
};

Modal.prototype._onTransitionEnd = function (callback) {
  this._backdrop.ontransitionend = (e) => {
    if (e.propertyName !== "transform") return;
    if (typeof callback === "function") callback();
  };
};

Modal.prototype.close = function (destroy = this.opt.destroyOnClose) {
  Modal.elements.pop();

  this._backdrop.classList.remove("show");

  if (this._allowEscapeClose) {
    document.removeEventListener("keydown", this._handleEscapeKey);
  }

  this._onTransitionEnd(() => {
    if (this._backdrop && destroy) {
      this._backdrop.remove();
      this._backdrop = null;
      this._modalFooter = null;
    }
    // Enable scrolling on the body
    if (!Modal.elements.length) {
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";
    }

    if (typeof this.opt.onClose === "function") {
      this.opt.onClose();
    }
  });
};

Modal.prototype.destroy = function () {
  this.close(true);
};

Modal.prototype._getScrollbarWidth = function () {
  if (this._scrollbarWidth) return this._scrollbarWidth;

  const scrollDiv = document.createElement("div");
  Object.assign(scrollDiv.style, {
    overflow: "scroll",
    position: "absolute",
    top: "-9999px",
  });

  scrollDiv.style.overflow = "scroll";
  document.body.appendChild(scrollDiv);
  this._scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return this._scrollbarWidth;
};

const modal1 = new Modal({
  templateId: "modal-1",
  destroyOnClose: false,
});

$("#open-modal-1").onclick = () => {
  const modalElement = modal1.open();
};

const modal2 = new Modal({
  templateId: "modal-2",
  cssClass: ["custom-modal"],
  onOpen: () => {
    console.log("Modal 2 opened");
  },
  onClose: () => {
    console.log("Modal 2 closed");
  },
});

$("#open-modal-2").onclick = () => {
  const modalElement = modal2.open();

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

const modal3 = new Modal({
  templateId: "modal-3",
  closeMethods: ["escape"],
  footer: true,
  cssClass: ["custom-modal"],
  onOpen: () => {
    console.log("Modal 3 opened");
  },
  onClose: () => {
    console.log("Modal 3 closed");
  },
});
// modal3.setFooterContent('<h2>Footer Content new</h2>');

modal3.addFooterButton("Danger", "modal-btn danger pull-left", (e) => {
  modal3.close();
});

modal3.addFooterButton("Cancel", "modal-btn", (e) => {
  modal3.close();
});

modal3.addFooterButton("<span>Confirm</span>", "modal-btn primary", (e) => {
  //Something...
  modal3.close();
});

$("#open-modal-3").onclick = () => {
  modal3.open();
};
