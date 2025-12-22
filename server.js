const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "notes.json");

app.use(express.json());
app.use(express.static("public"));

/* =========================
HELPER FUNCTIONS
========================= */

function readNotes() {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
}

function writeNotes(notes) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

/* =========================
API ROUTES
========================= */

// GET all notes
app.get("/api/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// ADD note
app.post("/api/notes", (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: Date.now().toString(),
        ...req.body,
        notified: false
    };
    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
});

// UPDATE note (edit)
app.put("/api/notes/:id", (req, res) => {
    let notes = readNotes();
    notes = notes.map(note =>
        note.id === req.params.id
            ? { ...note, ...req.body }
            : note
    );
    writeNotes(notes);
    res.json({ message: "Note updated" });
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
    let notes = readNotes();
    notes = notes.filter(note => note.id !== req.params.id);
    writeNotes(notes);
    res.json({ message: "Note deleted" });
});

// MARK COMPLETED
app.patch("/api/notes/:id/complete", (req, res) => {
    let notes = readNotes();
    notes = notes.map(note =>
        note.id === req.params.id
            ? { ...note, isCompleted: !note.isCompleted }
            : note
    );
    writeNotes(notes);
    res.json({ message: "Status updated" });
});

/* =========================
START SERVER
========================= */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
