const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];
const storageKey = "quicknotes-notes";

try {
  const savedNotes = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(savedNotes)) {
    notes = savedNotes.filter((note) =>
      note &&
      typeof note.id === "string" &&
      typeof note.text === "string" &&
      typeof note.category === "string" &&
      typeof note.createdAt === "string",
    );
  }
} catch {
  notes = [];
}

function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  const visibleNotes = notes.filter((note) =>
    note.text.toLocaleLowerCase().includes(searchTerm),
  );

  if (searchTerm && visibleNotes.length === 0) {
    const item = document.createElement("li");
    item.classList.add("empty-message");
    item.textContent = "No notes match your search.";
    notesList.append(item);
    return;
  }

  visibleNotes.forEach((note) => {
    const item = document.createElement("li");
    item.classList.add("note-card", getCategoryClass(note.category));

    const content = document.createElement("div");
    content.classList.add("note-content");

    const text = document.createElement("p");
    text.classList.add("note-text");
    text.textContent = note.text;

    const details = document.createElement("div");
    details.classList.add("note-details");

    const category = document.createElement("span");
    category.classList.add("category-label");
    category.textContent = note.category;

    const date = document.createElement("time");
    date.textContent = note.createdAt;

    details.append(category, date);
    content.append(text, details);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      notes = notes.filter((entry) => entry.id !== note.id);
      localStorage.setItem(storageKey, JSON.stringify(notes));
      render();
    });

    item.append(content, deleteButton);
    notesList.append(item);
  });
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (noteInput.value.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  const note = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  localStorage.setItem(storageKey, JSON.stringify(notes));
  noteInput.value = "";
  errorMessage.textContent = "";
  render();
});

searchInput.addEventListener("input", render);

render();
