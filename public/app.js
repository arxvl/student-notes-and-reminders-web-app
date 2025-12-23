const API_URL = "/api/notes";

/* =========================
THEME TOGGLE
========================= */

const themeToggle = document.getElementById("themeToggle");
themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
};

/* =========================
DOM ELEMENTS
========================= */

const form = document.querySelector("#noteForm");
const titleInput = form.querySelector("input[type='text']");
const contentInput = form.querySelector("textarea");
const categorySelect = form.querySelector("select");
const dateInput = form.querySelector("input[type='date']");
const notesList = document.querySelector(".notes-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById('searchInput'); 

let notes = [];
let currentFilter = "All";
let editId = null;

/* =========================
NOTIFICATION PERMISSION
========================= */

if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

/* =========================
FETCH NOTES
========================= */

async function fetchNotes() {
    const res = await fetch(API_URL);
    notes = await res.json();
    renderNotes();
    checkReminders();
}

/* =========================
RENDER NOTES
========================= */

function renderNotes() {
    notesList.innerHTML = "";

    const filtered = notes.filter(n =>
        currentFilter === "All" || n.category === currentFilter
    );

    if (!filtered.length) {
        notesList.innerHTML = "<p>No notes yet.</p>";
        return;
    }

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = `card note-card ${note.isCompleted ? "completed" : ""}`;

        card.innerHTML = `
            <div class="note-header">
                <h3>${note.title}</h3>
                <span class="category ${note.category.toLowerCase()}">
                    ${note.category}
                </span>
            </div>
            <p>${note.content}</p>
            <div class="note-footer">
                <small>📅 ${note.reminderDate || "No reminder"}</small>
                <div class="actions">
                    <button class="done-btn"><img src="icons/checked.png" alt="check" class="notes-btn"/></button>
                    <button class="edit-btn"><img src="icons/pen.png" alt="check" class="notes-btn"/></button>
                    <button class="delete-btn"><img src="icons/delete.png" alt="check" class="notes-btn"/></button>
                </div>
            </div>
        `;

        card.querySelector(".done-btn").onclick = () =>
            toggleComplete(note.id);

        card.querySelector(".delete-btn").onclick = () =>
            deleteNote(note.id);

        card.querySelector(".edit-btn").onclick = () =>
            startEdit(note);

        notesList.appendChild(card);
    });
}

/* =========================
SEARCH NOTES
========================= */

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note =>{
        const matchesFilter = currentFilter === "All" || note.category === currentFilter;
        const matchesSearch = note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    })

    //Render the filtered notes
    notesList.innerHTML = "";

    if(!filteredNotes.length){
        notesList.innerHTML = "<p>No notes found.</p>";
        return;
    }

    filteredNotes.forEach(note => {
        const card = document.createElement("div");
        card.className = `card note-card ${note.isCompleted ? "completed" : ""}`;

        card.innerHTML = `
            <div class="note-header">
                <h3>${note.title}</h3>
                <span class="category ${note.category.toLowerCase()}">
                    ${note.category}
                </span>
            </div>
            <p>${note.content}</p>
            <div class="note-footer">
                <small>📅 ${note.reminderDate || "No reminder"}</small>
                <div class="actions">
                    <button class="done-btn"><img src="/icons/checked.png" alt="check" class="notes-btn"/></button>
                    <button class="edit-btn"><img src="/icons/pen.png" alt="check" class="notes-btn"/></button>
                    <button class="delete-btn"><img src="/icons/delete.png" alt="check" class="notes-btn"/></button>
                </div>
            </div>
        `;

        card.querySelector(".done-btn").onclick = () =>
            toggleComplete(note.id);
        card.querySelector(".delete-btn").onclick = () =>
            deleteNote(note.id);
        card.querySelector(".edit-btn").onclick = () =>
            startEdit(note);

        notesList.appendChild(card);
    });
});

/* =========================
ADD / EDIT NOTE
========================= */

form.onsubmit = async (e) => {
    e.preventDefault();

    const noteData = {
        title: titleInput.value,
        content: contentInput.value,
        category: categorySelect.value,
        reminderDate: dateInput.value,
        isCompleted: false
    };

    if (editId) {
        await fetch(`${API_URL}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData)
        });
        editId = null;
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData)
        });
    }

    form.reset();
    fetchNotes();
};

function startEdit(note) {
    titleInput.value = note.title;
    contentInput.value = note.content;
    categorySelect.value = note.category;
    dateInput.value = note.reminderDate || "";
    editId = note.id;
}

/* =========================
DELETE / COMPLETE
========================= */
async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
}

async function toggleComplete(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...note,
            isCompleted: !note.isCompleted
        })
    });

    fetchNotes();
}

/* =========================
FILTERS
========================= */
filterButtons.forEach(btn => {
    btn.onclick = () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.textContent;
        renderNotes();
    };
});

/* =========================
REMINDER NOTIFICATIONS
========================= */

function checkReminders() {
    if (Notification.permission !== "granted") return;

    const today = new Date().toISOString().split("T")[0];

    notes.forEach(note => {
        if (
            note.reminderDate === today &&
            !note.isCompleted &&
            !note.notified
        ) {
            new Notification("Reminder", {
                body: note.title + ": " + note.content
            });

            note.notified = true;
        }
    });
}

/* =========================
INIT
========================= */

fetchNotes();
