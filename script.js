const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

let notes = [];

function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();

  notes.forEach((note) => {
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
      render();
    });

    item.append(content, deleteButton);
    notesList.append(item);
  });
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const note = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    text: noteInput.value,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  noteInput.value = "";
  render();
});

render();
