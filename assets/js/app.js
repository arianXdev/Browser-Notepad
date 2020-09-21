const form = document.querySelector("#form"),
    noteList = document.querySelector("#note-list"),
    noteBox = document.querySelector("#note-box"),
    titleBox = document.querySelector("#title-box"),
    buttonsBox = document.querySelector("#note-box-buttons"),
    closeButton = document.querySelector("#close-btn"),
    emptyAlert = document.querySelector("#empty-alert"),
    overlay = document.querySelector("#overlay"),
    formOverlay = document.querySelector("#form-overlay"),
    addNoteBtn = document.querySelector("#add-note-btn"),
    closeOlButton = document.querySelector("#close-overlay-btn"),
    randBorderBtn = document.querySelector("#rand-border-toggle"),
    pinnedList = document.querySelector("#pinned-list"),
    dividerPinnedList = document.querySelector("#divider-pinned-list"),
    titlePinnedList = document.querySelector("#pinned-list-title");

eventListener();
function eventListener() {
    // Collapse Note Form when outside click
    window.addEventListener("click", (e) => {
        if (e.target.id == "title-box" || e.target.id == "note-box") {
            titleBox.classList.add("active");

            noteBox.style.borderBottom = "none";
            noteBox.style.borderTop = "none";

            buttonsBox.classList.add("active");
        } else {
            titleBox.classList.remove("active");

            noteBox.style.borderBottom = "";
            noteBox.style.borderTop = "";

            buttonsBox.classList.remove("active");
        }
    });

    // form submit
    form.addEventListener("submit", newNote);
    formOverlay.addEventListener("submit", newNoteOverlay);

    // remove btn
    noteList.addEventListener("click", removeNote);

    // get Notes on load
    document.addEventListener("DOMContentLoaded", localStorgeOnLoad);

    // add note btn overlay
    addNoteBtn.addEventListener("click", toggleOverlay);

    // close btn
    closeButton.addEventListener("click", clearNoteForm);
    closeOlButton.addEventListener("click", clearNoteFormMobile);

    // randBorder btn
    randBorderBtn.addEventListener("change", addStateCheckBoxInLocalStorage);
}

// for toggle random border color switch
(() => {
    if (localStorage.getItem("random-border") == "1") {
        randBorderBtn.setAttribute("checked", "");
        randBorderBtn.parentElement.title = "Disable Random BoderColor";
    } else {
        randBorderBtn.removeAttribute("checked");
        randBorderBtn.parentElement.title = "Enable Random BoderColor";
    }
})();

// add note to NoteList
function newNote() {
    const noteTitle = document.querySelector("#title-box").value;
    const note = document.querySelector("#note-box").value;

    // Validate From
    if (validateForm(note, noteTitle) == true) {
        return;
    }

    // create remove button
    const removeBtn = document.createElement("a");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.title = "حذف یادداشت";

    // create edit button
    const editBtn = document.createElement("ion-icon");
    editBtn.setAttribute("name", "create-outline");
    editBtn.classList.add("edit-btn");
    editBtn.title = "ویرایش یادداشت";
    editBtn.onclick = editNote;

    // create pin button
    const pinBtn = document.createElement("ion-icon");
    pinBtn.setAttribute("name", "flag-outline");
    pinBtn.classList.add("pin-btn");
    pinBtn.title = "Pin";
    pinBtn.onclick = pinNote;

    // create note card
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");

    // create "div" Tags for noteCard
    const titleNoteCard = document.createElement("div");
    const bodyNoteCard = document.createElement("div");

    // create "p" Tags for DIVs in noteCard
    const pTitleNoteCard = document.createElement("p");
    const pBodyNoteCard = document.createElement("p");

    titleNoteCard.classList = "title-note-card";
    bodyNoteCard.classList = "body-note-card";

    titleNoteCard.appendChild(pTitleNoteCard);
    bodyNoteCard.appendChild(pBodyNoteCard);

    pTitleNoteCard.textContent = noteTitle;
    pBodyNoteCard.textContent = note;

    noteCard.appendChild(removeBtn);
    noteCard.appendChild(editBtn);
    noteCard.appendChild(pinBtn);
    noteCard.appendChild(titleNoteCard);
    noteCard.appendChild(bodyNoteCard);

    // set Auto Direction for LTR or RTL notes
    bodyNoteCard.dir = "auto";
    pBodyNoteCard.dir = "auto";

    getRandBorderFromLocalStorage(noteCard);
    noteList.appendChild(noteCard);
    addNoteToLocalStorage(noteTitle, note);

    // Rest Form
    this.reset();
    emptyAlertCheck();
}

// add note to NoteList in MOBILE_MODE
function newNoteOverlay() {
    const noteTitle = document.querySelector("#title-overlay-box").value;
    const note = document.querySelector("#note-overlay-box").value;

    // Validate From
    if (validateForm(note, noteTitle) == true) {
        return;
    }

    // create remove button
    const removeBtn = document.createElement("a");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.title = "حذف یادداشت";

    // create edit button
    const editBtn = document.createElement("ion-icon");
    editBtn.setAttribute("name", "create-outline");
    editBtn.classList.add("edit-btn");
    editBtn.title = "ویرایش یادداشت";
    editBtn.onclick = editNote;

    // create pin button
    const pinBtn = document.createElement("ion-icon");
    pinBtn.setAttribute("name", "flag-outline");
    pinBtn.classList.add("pin-btn");
    pinBtn.title = "Pin";
    pinBtn.onclick = pinNote;

    // create note card
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");

    // create "div" Tags for noteCard
    const titleNoteCard = document.createElement("div");
    const bodyNoteCard = document.createElement("div");

    // create "p" Tags for DIVs in noteCard
    const pTitleNoteCard = document.createElement("p");
    const pBodyNoteCard = document.createElement("p");

    titleNoteCard.classList = "title-note-card";
    bodyNoteCard.classList = "body-note-card";

    titleNoteCard.appendChild(pTitleNoteCard);
    bodyNoteCard.appendChild(pBodyNoteCard);

    pTitleNoteCard.textContent = noteTitle;
    pBodyNoteCard.textContent = note;

    noteCard.appendChild(removeBtn);
    noteCard.appendChild(editBtn);
    noteCard.appendChild(pinBtn);
    noteCard.appendChild(titleNoteCard);
    noteCard.appendChild(bodyNoteCard);

    // set Auto Direction for LTR or RTL notes
    bodyNoteCard.dir = "auto";
    pBodyNoteCard.dir = "auto";

    getRandBorderFromLocalStorage(noteCard);
    noteList.appendChild(noteCard);
    addNoteToLocalStorage(noteTitle, note);

    toggleOverlay();

    // Rest Form
    this.reset();

    emptyAlertCheck();
}

// remove note from NoteList
function removeNote(e) {
    if (e.target.classList.contains("remove-btn")) {
        e.target.parentElement.remove();
        removeNoteFromLocalStorage(e.target.parentElement);

        Swal.fire({
            title: "!یادداشت با موفقیت حذف شد",
            text: " ",
            position: "bottom-right",
            timer: 3000,
            toast: true,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "success",
        });
        emptyAlertCheck();
    }
}

// edit note handler
async function editNote(e) {
    // get Note Title Text
    let noteTitle = e.target.parentElement.querySelector(".title-note-card p")
        .innerText;

    // get Note Body Text
    let note = e.target.parentElement.querySelector(".body-note-card p")
        .innerText;

    // Edit Note Alert(Popup Form for edit notes)
    const { value: text } = await Swal.fire({
        html: `<input id="swal-input1" dir="auto" autocomplete="off" placeholder="Title" class="swal2-input" value="${noteTitle}">`,
        focusConfirm: false,
        title: "ویرایش یادداشت",
        input: "textarea",
        direction: "auto",
        inputPlaceholder: "Take a note...",
        inputAttributes: {
            "aria-label": "Type your message here",
        },
        showCancelButton: true,
        confirmButtonText: "ویرایش",
        cancelButtonText: "بستن",
        inputValue: note,
        background: "#1e1e1e",
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.querySelector(".swal2-textarea").value,
            ];
        },
    });

    // Alert Success then edit note
    if (text) {
        Swal.fire({
            title: "!یادداشت با موفقیت ویرایش شد",
            text: " ",
            position: "bottom-right",
            timer: 3000,
            toast: true,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "success",
        });
    }

    // Validate Form
    if (validateForm(text[0], text[1]) == true) {
        return;
    }

    // Send New title, body note text to function for Save on LocalStoarge
    editNoteFromLocalStorage(text, e.target.parentElement);
}

// add note to localStorage
function addNoteToLocalStorage(noteTitle, note) {
    const noteArray = noteTitle + "%$#$#$10$58725#" + note;
    const notes = getNoteFromLocalStorage();

    // Validate Form
    if (
        noteArray === " %$#$#$10$58725#" ||
        noteArray === "%$#$#$10$58725# " ||
        noteArray === " %$#$#$10$58725# "
    ) {
        return;
    }

    notes.push(noteArray);
    localStorage.setItem("notes", JSON.stringify(notes));
}

// get Note from LocalStorage
function getNoteFromLocalStorage() {
    let notes;
    let getNotesFromLS = localStorage.getItem("notes");
    if (getNotesFromLS === null) {
        notes = [];
    } else {
        notes = JSON.parse(getNotesFromLS);
    }
    emptyAlertCheck();
    return notes;
}

// remove note from localStorage
function removeNoteFromLocalStorage(noteContent) {
    const notes = getNoteFromLocalStorage();
    let notesArray =
        noteContent.querySelector(".title-note-card p").textContent +
        "%$#$#$10$58725#" +
        noteContent.querySelector(".body-note-card p").textContent;

    notes.map((note, index) => {
        if (note === notesArray) {
            notes.splice(index, 1);
        }
    });

    localStorage.setItem("notes", JSON.stringify(notes));
}

// remove pinNotes from localStorage
function removePinNotesOnLocalStorage(noteContent) {
    const pinNotes = getPinNotesFromLocalStorage();
    let notesArray =
        noteContent.querySelector(".title-note-card p").textContent +
        "%$#$#$10$58725#" +
        noteContent.querySelector(".body-note-card p").textContent;

    pinNotes.map((note, index) => {
        if (note === notesArray) {
            pinNotes.splice(index, 1);
        }
    });

    localStorage.setItem("pinNotes", JSON.stringify(pinNotes));

    if (pinnedList.children.length - 1 == 0) {
        pinnedList.style.display = "none";
        dividerPinnedList.style.display = "none";
        titlePinnedList.style.display = "none";
    } else {
        pinnedList.style.display = "flex";
        dividerPinnedList.style.display = "flex";
        titlePinnedList.style.display = "flex";
    }
}

// edit Note From LocalStorage
function editNoteFromLocalStorage(text, parentElement) {
    const notes = getNoteFromLocalStorage();
    const pinNotes = getPinNotesFromLocalStorage();

    // get Note Title Text
    let noteTitle = parentElement.querySelector(".title-note-card p").innerText;
    // get Note Body Text
    let note = parentElement.querySelector(".body-note-card p").innerText;

    // Edit Title Note on LocalStorage
    notes.map((element, index) => {
        notes.splice(index, 1);
        notes.splice(index, 0, element.replace(noteTitle, text[0]));
    });

    // Edit Body Note on LocalStorage
    notes.map((element, index) => {
        notes.splice(index, 1);
        notes.splice(index, 0, element.replace(note, text[1]));
    });

    // Edit Title Note on LocalStorage | for Pin Notes
    pinNotes.map((element, index) => {
        pinNotes.splice(index, 1);
        pinNotes.splice(index, 0, element.replace(noteTitle, text[0]));
    });

    // Edit Body Note on LocalStorage | for Pin Notes
    pinNotes.map((element, index) => {
        pinNotes.splice(index, 1);
        pinNotes.splice(index, 0, element.replace(note, text[1]));
    });

    // edit note on noteCard
    parentElement.querySelector(".title-note-card p").textContent = text[0];
    parentElement.querySelector(".body-note-card p").textContent = text[1];

    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("pinNotes", JSON.stringify(pinNotes));
}

// get Notes on Load Page
function localStorgeOnLoad() {
    const notes = getNoteFromLocalStorage();
    const pinNotes = getPinNotesFromLocalStorage();

    notes.map((element) => {
        const noteTitle = element.split("%$#$#$10$58725#")[0];
        const note = element.split("%$#$#$10$58725#")[1];

        // create remove button
        const removeBtn = document.createElement("a");
        removeBtn.innerHTML = "&times;";
        removeBtn.classList.add("remove-btn");
        removeBtn.setAttribute("title", "حذف یادداشت");

        // create edit button
        const editBtn = document.createElement("ion-icon");
        editBtn.setAttribute("name", "create-outline");

        editBtn.classList.add("edit-btn");
        editBtn.title = "ویرایش یادداشت";
        editBtn.onclick = editNote;

        // create pin button
        const pinBtn = document.createElement("ion-icon");
        pinBtn.setAttribute("name", "flag-outline");
        pinBtn.classList.add("pin-btn");
        pinBtn.title = "Pin";
        pinBtn.onclick = pinNote;

        // create card
        const noteCard = document.createElement("div");
        const titleNoteCard = document.createElement("div");
        const bodyNoteCard = document.createElement("div");
        const pTitleNoteCard = document.createElement("p");
        const pBodyNoteCard = document.createElement("p");

        noteCard.classList.add("note-card");

        titleNoteCard.classList = "title-note-card";
        bodyNoteCard.classList = "body-note-card";

        titleNoteCard.appendChild(pTitleNoteCard);
        bodyNoteCard.appendChild(pBodyNoteCard);

        noteCard.appendChild(removeBtn);
        noteCard.appendChild(editBtn);
        noteCard.appendChild(pinBtn);
        noteCard.appendChild(titleNoteCard);
        noteCard.appendChild(bodyNoteCard);

        pTitleNoteCard.textContent = noteTitle;
        pBodyNoteCard.textContent = note;

        getRandBorderFromLocalStorage(noteCard);

        bodyNoteCard.dir = "auto";
        pBodyNoteCard.dir = "auto";

        noteList.appendChild(noteCard);
        emptyAlertCheck();
    });

    pinNotes.map((element) => {
        const noteTitle = element.split("%$#$#$10$58725#")[0];
        const note = element.split("%$#$#$10$58725#")[1];

        // create remove button
        const removeBtn = document.createElement("a");
        removeBtn.innerHTML = "&times;";
        removeBtn.classList.add("remove-btn");
        removeBtn.setAttribute("title", "حذف یادداشت");

        // create edit button
        const editBtn = document.createElement("ion-icon");
        editBtn.setAttribute("name", "create-outline");
        editBtn.classList.add("edit-btn");
        editBtn.title = "ویرایش یادداشت";
        editBtn.onclick = editNote;

        // create pin button
        const pinBtn = document.createElement("ion-icon");
        pinBtn.setAttribute("name", "flag");
        pinBtn.classList.add("pin-btn");
        pinBtn.title = "Pin";
        pinBtn.onclick = pinNote;

        // create card
        const noteCard = document.createElement("div");
        const titleNoteCard = document.createElement("div");
        const bodyNoteCard = document.createElement("div");
        const pTitleNoteCard = document.createElement("p");
        const pBodyNoteCard = document.createElement("p");

        noteCard.classList.add("note-card");

        titleNoteCard.classList = "title-note-card";
        bodyNoteCard.classList = "body-note-card";

        titleNoteCard.appendChild(pTitleNoteCard);
        bodyNoteCard.appendChild(pBodyNoteCard);

        noteCard.appendChild(removeBtn);
        noteCard.appendChild(editBtn);
        noteCard.appendChild(pinBtn);
        noteCard.appendChild(titleNoteCard);
        noteCard.appendChild(bodyNoteCard);

        pTitleNoteCard.textContent = noteTitle;
        pBodyNoteCard.textContent = note;

        getRandBorderFromLocalStorage(noteCard);

        bodyNoteCard.dir = "auto";
        pBodyNoteCard.dir = "auto";

        pinnedList.style.display = "flex";
        dividerPinnedList.style.display = "flex";
        titlePinnedList.style.display = "flex";

        removeBtn.addEventListener("click", (e) => {
            Swal.fire({
                title: "!ابتدا یادداشت را از حالت پین خارج کنید",
                text: " ",
                position: "bottom-right",
                timer: 4500,
                toast: true,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: "error",
            });
        });

        pinnedList.appendChild(noteCard);
        emptyAlertCheck();
    });
}

// display Empty Alert
function emptyAlertCheck() {
    // display Empty Alert When NoteList.length = 0
    if (noteList.children.length == 0) {
        emptyAlert.style.display = "flex";
    } else {
        emptyAlert.style.display = "none";
    }
}

// toggle overlay
function toggleOverlay() {
    addNoteBtn.classList.toggle("active");
    overlay.classList.toggle("active");
    formOverlay.classList.toggle("active");

    // disable scroll overlay
    noteList.classList.toggle("active");
}

// clear Note Form
function clearNoteForm() {
    const noteTitle = document.querySelector("#title-box");
    const note = document.querySelector("#note-box");

    noteTitle.value = "";
    note.value = "";
}

// clear Note Form in MOBILE_MODE
function clearNoteFormMobile() {
    const noteTitle = document.querySelector("#title-overlay-box");
    const note = document.querySelector("#note-overlay-box");

    noteTitle.value = "";
    note.value = "";

    toggleOverlay();
}

// create random border color for NoteCards
function randomBorderColor() {
    let randNum = Math.floor(Math.random() * 6);
    let color;
    switch (randNum) {
        case 0:
            color = "yellow";
            break;

        case 1:
            color = "green";
            break;

        case 2:
            color = "pink";
            break;

        case 3:
            color = "rose";
            break;

        case 4:
            color = "orange";
            break;

        case 5:
            color = "red";
            break;
    }
    return color;
}

// add State Random Border for NoteCards in LocalStorage
function addStateCheckBoxInLocalStorage() {
    if (this.checked) {
        localStorage.setItem("random-border", "1");
        randBorderBtn.setAttribute("checked", "");
        this.parentElement.setAttribute("title", "Disable Random BoderColor");
    } else {
        localStorage.setItem("random-border", "0");
        randBorderBtn.removeAttribute("checked");
        this.parentElement.setAttribute("title", "Enable Random BoderColor");
    }

    Swal.fire({
        title: "!لطفا صفحه را رفرش کنید",
        text: " ",
        position: "bottom-right",
        timer: 3000,
        toast: true,
        timerProgressBar: true,
        showConfirmButton: false,
        icon: "info",
    });
}

// get random border from localStorage
function getRandBorderFromLocalStorage(noteCard) {
    if (localStorage.getItem("random-border") == "1") {
        randBorderBtn.setAttribute("checked", "");
        noteCard.classList.add(randomBorderColor());
    } else {
        randBorderBtn.removeAttribute("checked");
        noteCard.classList.add("blue");
    }
}

// Validate Form
function validateForm(note, noteTitle) {
    if (noteTitle == "" || note == "") {
        Swal.fire({
            title: "!عنوان یا متن یادداشت وارد نشده است",
            text: " ",
            position: "bottom-right",
            timer: 3000,
            toast: true,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "error",
        });
        return true;
    }
}

// pin note handler
function pinNote(e) {
    if (e.target.getAttribute("name") == "flag-outline") {
        e.target.setAttribute("name", "flag");

        pinnedList.style.display = "flex";
        dividerPinnedList.style.display = "flex";
        titlePinnedList.style.display = "flex";

        const removeBtn = e.target.parentElement.getElementsByClassName(
            "remove-btn"
        )[0];

        removeBtn.addEventListener("click", (e) => {
            Swal.fire({
                title: "!ابتدا یادداشت را از حالت پین خارج کنید",
                text: " ",
                position: "bottom-right",
                timer: 4500,
                toast: true,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: "error",
            });
        });

        pinnedList.appendChild(e.target.parentElement);
        removeNoteFromLocalStorage(e.target.parentElement);
        pinNoteOnLocalStorage(e.target.parentElement);
    } else {
        const noteTitle = e.target.parentElement.querySelector(
            ".title-note-card p"
        ).textContent;

        const note = e.target.parentElement.querySelector(".body-note-card p")
            .textContent;

        pinnedList.style.display = "none";
        dividerPinnedList.style.display = "none";
        titlePinnedList.style.display = "none";

        e.target.setAttribute("name", "flag-outline");
        addNoteToLocalStorage(noteTitle, note);
        removePinNotesOnLocalStorage(e.target.parentElement);
        noteList.appendChild(e.target.parentElement);

        emptyAlertCheck();
    }
}

// pin note on localStorage
function pinNoteOnLocalStorage(e) {
    const noteArray =
        e.querySelector(".title-note-card p").textContent +
        "%$#$#$10$58725#" +
        e.querySelector(".body-note-card p").textContent;

    const pinNotes = getPinNotesFromLocalStorage();

    pinNotes.push(noteArray);
    localStorage.setItem("pinNotes", JSON.stringify(pinNotes));
}

// get pinNotes from LocalStorage
function getPinNotesFromLocalStorage() {
    let pinNotes;
    let getPinNotesFromLS = localStorage.getItem("pinNotes");

    if (getPinNotesFromLS === null) {
        pinNotes = [];
    } else {
        pinNotes = JSON.parse(getPinNotesFromLS);
    }

    return pinNotes;
}
