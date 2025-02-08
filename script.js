const addBtn = document.getElementById("addBtn");
const saveBtn = document.querySelector(".fa-save");
const savedNotesContainer = document.querySelector("#saved-notes ul");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const noteArea = document.getElementById("noteArea");
const showFormatToolsBtn = document.getElementById("showFormatTools");
const hideFormatToolsBtn = document.getElementById("hideFormatTools");
const toolSection = document.getElementById("toolSection");
const formatSection = document.getElementById("formatSection");
const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValue = document.getElementById("fontSizeValue");
const textColor = document.getElementById("textColor");
const fontType = document.getElementById("fontType");
const alignmentOptions = document.querySelectorAll("alignmentOptions");
const alignBtnz = document.querySelectorAll(".align-btn");

let activeNote = null;

let undoStack = [];

let redoStack = [];

let formatting = {};

let autoSaveTimeout;

const defaultFormatting = {
  textAlign: "left",
  fontSize: "24px",
  color: "black",
  fontFamily: "Arial",
};

function applyFormatting(noteArea, formatting) {
  noteArea.style.textAlign = formatting.textAlign || defaultFormatting.textAlign;
  noteArea.style.fontSize = formatting.fontSize || defaultFormatting.fontSize;
  noteArea.style.fontFamily = formatting.fontFamily || defaultFormatting.fontFamily;
  noteArea.style.color = formatting.color || defaultFormatting.color;
}

function captureNoteState() {
  return {
    content: noteArea.value,
    formatting: {
      textAlign: noteArea.style.textAlign,
      fontSize: noteArea.style.fontSize,
      color: noteArea.style.color,
      fontFamily: noteArea.style.fontFamily,
    },
  };
}

function restoreNoteState(state) {
  noteArea.value = state.content;
  applyFormatting(noteArea, state.formatting);
}

window.addEventListener("load", function () {
  applyFormatting(noteArea, formatting);
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach((note) => {
    createNoteElement(note.title, note.content, note.formatting || {});
  });
});

// Save notes to your local storage
function saveNotesToLocalStorage() {
  const notes = Array.from(savedNotesContainer.querySelectorAll("li")).map((li) => ({
    title: li.querySelector(".note-title").textContent,
    content: li.dataset.content,
    formatting: JSON.parse(li.dataset.formatting),
  }));
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Create and append a note element
function createNoteElement(title, content) {
  const li = document.createElement("li");
  li.dataset.content = content;
  li.dataset.formatting = JSON.stringify(formatting);
  li.innerHTML = `
    <div class="note-header">
      <span class="note-title" style="font-weight: bold;">${title}</span>
      <div class="note-buttons">
        <i class="fa-regular fa-pen-to-square" title="Edit Title"></i>
      </div>
    </div>
    <div class="note-body">
      <span class="preview">${content.substring(0, 30)}...</span>
      <div class="note-buttons">
        <i class="fa-solid fa-trash" title="Delete"></i>
      </div>
    </div>
  `;

  applyFormatting(noteArea, defaultFormatting);

  // Add event listeners
  li.querySelector(".fa-trash").addEventListener("click", function () {
    li.remove();
    saveNotesToLocalStorage();
  });

  li.querySelector(".fa-pen-to-square").addEventListener("click", function () {
    // pushUndoState(li);
    const newTitle = prompt("Edit your title:", title);
    if (newTitle) {
      li.querySelector(".note-title").textContent = newTitle;
      saveNotesToLocalStorage();
    }
  });

  li.addEventListener("click", function () {
    noteArea.value = li.dataset.content;
    const formatting = JSON.parse(li.dataset.formatting);
    applyFormatting(noteArea, formatting);
    if (activeNote) activeNote.classList.remove("active-note");
    li.classList.add("active-note");
    activeNote = li;
    saveBtn.disabled = false;
  });

  savedNotesContainer.appendChild(li);
  return li;
}

function saveNote() {
  const content = noteArea.value;
  if (content.trim() === "") {
    alert("Note content cannot be empty.");
    return;
  }
  let title;

  if (activeNote) {
    title = activeNote.querySelector(".note-title").textContent;
  } else {
    title = prompt("What do we call this one?");
    if (!title) {
      return;
    }
  }

  const formatting = {
    textAlign: noteArea.style.textAlign,
    fontSize: noteArea.style.fontSize,
    color: noteArea.style.color,
    fontFamily: noteArea.style.fontFamily,
  };

  if (activeNote) {
    activeNote.querySelector(".note-title").textContent = title;
    activeNote.querySelector(".preview").textContent = `${content.substring(0, 30)}...`;
    activeNote.dataset.content = content;
    activeNote.dataset.formatting = JSON.stringify(formatting);
  } else {
    activeNote = createNoteElement(title, content);
  }
  saveNotesToLocalStorage();
}

addBtn.addEventListener("click", function () {
  if (noteArea.value.trim() !== "") {
    alert("Remember to save your note.");
  } else {
    noteArea.value = "";
    noteArea.style.textAlign = "left";
    activeNote = createNoteElement("Untitled", "");
  }
});

saveBtn.addEventListener("click", saveNote);

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveNote();
  }
});

saveBtn.disabled = true;

noteArea.addEventListener("input", () => {
  saveBtn.disabled = false;
});

// This piece of code deals with the format menu toggle

showFormatToolsBtn.addEventListener("click", () => {
  toolSection.style.display = "none";
  formatSection.style.display = "flex";
});

hideFormatToolsBtn.addEventListener("click", () => {
  formatSection.style.display = "none";
  toolSection.style.display = "flex";
});

fontSizeSlider.addEventListener("input", () => {
  fontSizeValue.textContent = `${fontSizeSlider.value}px`;
  noteArea.style.fontSize = `${fontSizeSlider.value}px`;
});

fontType.addEventListener("change", () => {
  noteArea.style.fontFamily = fontType.value;
});

alignBtnz.forEach((button) => {
  button.addEventListener("click", () => {
    const align = button.getAttribute("data-align");
    noteArea.style.textAlign = align;
  });
});

textColor.addEventListener("input", () => {
  noteArea.style.color = textColor.value;
});

noteArea.addEventListener("input", () => {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(saveNote, 1000);
  saveBtn.disabled = false;
});

undoBtn.addEventListener("click", () => {
  if (undoStack.length > 0) {
    redoStack.push(captureNoteState());
    const previousState = undoStack.pop();
    restoreNoteState(previousState);
  }
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length > 0) {
    undoStack.push(captureNoteState());
    const nextState = redoStack.pop();
    restoreNoteState(nextState);
  }
});
