const addBtn = document.getElementById("addBtn");
const saveBtn = document.querySelector(".fa-save");
const savedNotesContainer = document.querySelector("#saved-notes ul");

let activeNote = null;

window.addEventListener("load", function () {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach((note) => {
    createNoteElement(note.title, note.content);
  });
});

function saveNotesToLocalStorage() {
  const notes = Array.from(savedNotesContainer.querySelectorAll("li")).map((li) => ({
    title: li.querySelector(".note-title").textContent,
    content: li.dataset.content,
  }));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteElement(title, content) {
  const li = document.createElement("li");
  li.dataset.content = content;
  li.innerHTML = `
    <div class="note-header">
      <span class="note-title" style="font-weight: bold;">${title}</span>
    </div>
    <div class="note-body">
      <span class="preview">${content.substring(0, 30)}...</span>
      <div class="note-buttons">
        <i class="fa-regular fa-pen-to-square" title="Edit Title"></i>
        <i class="fa-solid fa-trash" title="Delete"></i>
      </div>
    </div>
  `;

  li.querySelector(".fa-trash").addEventListener("click", function () {
    li.remove();
    saveNotesToLocalStorage();
  });

  li.querySelector(".fa-pen-to-square").addEventListener("click", function () {
    const newTitle = prompt("Edit your title:", title);
    if (newTitle) {
      li.querySelector(".note-title").textContent = newTitle;
      saveNotesToLocalStorage();
    }
  });

  li.addEventListener("click", function () {
    document.querySelector(".note textarea").value = li.dataset.content;
    if (activeNote) activeNote.classList.remove("active-note");
    li.classList.add("active-note");
    activeNote = li;
    saveBtn.disabled = false;
  });

  savedNotesContainer.appendChild(li);
}

addBtn.addEventListener("click", function () {
  const title = prompt("Enter title here:");

  if (title && title.trim() !== "") {
    createNoteElement(title.trim(), "");
    saveNotesToLocalStorage();
  } else {
    alert("Note title cannot be empty.");
  }
});

saveBtn.addEventListener("click", function () {
  if (activeNote) {
    const noteContent = document.querySelector(".note textarea").value;
    activeNote.dataset.content = noteContent;
    activeNote.querySelector(".preview").textContent = `${noteContent.substring(0, 30)}...`;

    saveNotesToLocalStorage();
    document.querySelector(".note textarea").value = "";
    activeNote.classList.remove("active-note");
    activeNote = null;
    saveBtn.disabled = true;
  }
});

saveBtn.disabled = true;
