const list = document.querySelector(".contacts");

// function to change message
const changeInvalidMessage = (evt) => {
    evt.target.setCustomValidity("Телефон состоит из цифр и тире (возможен “+” как первый символ)");
};
const clearInvalidMessage = (evt) => {
    evt.target.setCustomValidity("");
};

// fuctiont to edit item
const editItem = (evt) => {
    const changedItem = evt.target.closest(".contacts__item");
    changedItem.querySelector(".buttons__delete").removeEventListener("click", deleteItem);
    changedItem.querySelector(".buttons__edit").removeEventListener("click", editItem);
    changedItem.innerHTML = "";
    changedItem.style.display = "block";

    const form = document.createElement("form");
    form.classList.add("save-form");
    form.style.display = "flex";
    form.style.justifyContent = "space-between";
    form.style.alignItems = "center";

    const inputWrapper = document.createElement("div");

    const inputName = document.createElement("input");
    inputName.classList.add("save-name");
    inputName.placeholder = "Введите имя";
    inputName.autocomplete = "off";
    inputName.required = "true";
    inputName.style.display = "block";

    const inputTelno = document.createElement("input");
    inputTelno.classList.add("save-telno");
    inputTelno.placeholder = "Введите номер";
    inputTelno.autocomplete = "off";
    inputTelno.required = "true";
    inputTelno.pattern = "[0-9/+]{1}[0-9/-]{1,100}";
    inputTelno.style.display = "block";
    inputTelno.addEventListener("invalid", changeInvalidMessage);
    inputTelno.addEventListener("input", clearInvalidMessage);

    const saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.textContent = "Сохранить";
    saveButton.type = "submit";

    form.addEventListener("submit", saveItem);

    inputWrapper.append(inputName, inputTelno);
    form.append(inputWrapper, saveButton);
    changedItem.append(form);
};

// function to delete item
const deleteItem = ({ target }) => {
    const item = target.closest(".contacts__item");
    const editButton = item.querySelector(".buttons__edit");
    item.remove();
    target.removeEventListener("click", deleteItem);
    editButton.removeEventListener("click", editItem);
};

// function to save changes
const saveItem = (evt) => {
    const changedItem = evt.target.closest(".contacts__item");
    const form = changedItem.querySelector(".save-form");
    const inputName = changedItem.querySelector(".save-name");
    const inputTelno = changedItem.querySelector(".save-telno");
    evt.preventDefault();
    inputTelno.removeEventListener("invalid", changeInvalidMessage);
    inputTelno.removeEventListener("input", clearInvalidMessage);
    form.removeEventListener("submit", saveItem);
    const newName = inputName.value;
    const newTelno = inputTelno.value;
    changedItem.innerHTML = "";
    changedItem.style.display = "flex";
    createLiInner(changedItem, { name: newName, telno: newTelno });
};

// function to fill li
const createLiInner = (li, contact) => {
    li.classList.add("contacts__item");

    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("contacts__info", "info");

    const name = document.createElement("div");
    name.classList.add("info__name");
    name.textContent = contact.name;

    const telno = document.createElement("div");
    telno.classList.add("info__telno");
    telno.textContent = contact.telno;

    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("contacts__buttons", "buttons");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("buttons__delete");
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", deleteItem);

    const editButton = document.createElement("button");
    editButton.classList.add("buttons__edit");
    editButton.textContent = "Изменить";
    editButton.addEventListener("click", editItem);

    infoWrapper.append(name, telno);
    buttonWrapper.append(deleteButton, editButton);

    li.append(infoWrapper, buttonWrapper);

    return li;
};

// creating contacts in ul
const createContactItem = (contact) => {
    const li = document.createElement("li");
    createLiInner(li, contact);
    list.append(li);
};

// create loading appearence
const loader = document.querySelector(".loader");

function toggleLoader() {
    if (loader.hasAttribute("hidden")) {
        loader.removeAttribute("hidden");
    } else {
        loader.setAttribute("hidden", "");
    }
}

// filling ul with help of created function, used jsonplaceholder.typicode.com for request
function getContacts() {
    toggleLoader();
    const getContacts = fetch("https://jsonplaceholder.typicode.com/users");
    getContacts
        .then((response) => response.json())
        .then((json) => {
            json.slice(0, 4).forEach((item) =>
                createContactItem({ name: item.name, telno: item.phone.split(" ")[0] })
            );
        })
        .finally(() => toggleLoader());
}

// reset task
const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", () => {
    const deleteButtons = list.querySelectorAll(".buttons__delete");
    deleteButtons.forEach((item) => {
        item.removeEventListener("click", deleteItem);
    });
    const editButtons = list.querySelectorAll(".buttons__edit");
    editButtons.forEach((item) => {
        item.removeEventListener("click", editItem);
    });
    list.innerHTML = "";
    getContacts();
});

// adding contact
const form = document.querySelector(".form");
const nameInput = form.querySelector(".form__name");
const telnoInput = form.querySelector(".form__telno");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    createContactItem({ name: nameInput.value, telno: telnoInput.value });
    nameInput.value = "";
    telnoInput.value = "";
});

// change validity message of telno
telnoInput.addEventListener("invalid", changeInvalidMessage);
telnoInput.addEventListener("input", clearInvalidMessage);

// init contacts
getContacts();
