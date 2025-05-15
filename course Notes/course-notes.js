document.addEventListener("DOMContentLoaded", function () {
    const notesContainer = document.getElementById("notes-container");
    const searchInput = document.getElementById("search-input");
    const courseSelect = document.getElementById("courseSelect");
    const sortSelect = document.getElementById("sortSelect");
    const form = document.getElementById("note-form");
    const message = document.getElementById("message");
    const loading = document.getElementById("loading");
  
    let notes = [
      {
        course: "ITCS113",
        title: "Programming Basics",
        postedBy: "Noor",
        summary: "Overview of programming basics and best practices.",
        date: "2025-04-25",
      },
      {
        course: "ITCS214",
        title: "Advanced Algorithms",
        postedBy: "Rehab",
        summary: "Advanced concepts in algorithms and data structures.",
        date: "2025-04-26",
      },
      {
        course: "ITNE101",
        title: "Networking Basics",
        postedBy: "Reem",
        summary: "Basics of computer networks and communication.",
        date: "2025-04-27",
      },
      {
        course: "MATHS101",
        title: "Calculus Notes",
        postedBy: "Sarah",
        summary: "Calculus basics and integration techniques.",
        date: "2025-04-27",
      },
    ];
  
    function renderNotes(filteredNotes) {
      notesContainer.innerHTML = "";
      if (filteredNotes.length === 0) {
        notesContainer.innerHTML = "<p class='text-center'>No notes found.</p>";
        return;
      }
      filteredNotes.forEach((note) => {
        const noteBox = document.createElement("div");
        noteBox.classList.add("col-md-6", "mb-4");
        noteBox.innerHTML = `
          <div class="note-box">
            <h5>${note.title} - ${note.course}</h5>
            <p><strong>Posted by:</strong> ${note.postedBy}</p>
            <p><strong>Summary:</strong> ${note.summary}</p>
            <p><strong>Date:</strong> ${note.date}</p>
            <button>View Notes</button>
          </div>
        `;
        notesContainer.appendChild(noteBox);
      });
    }
  
    function filterAndSortNotes() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCourse = courseSelect.value;
      const sortOption = sortSelect.value;
  
      let filtered = notes.filter((note) => {
        const inSearch =
          note.title.toLowerCase().includes(searchTerm) ||
          note.summary.toLowerCase().includes(searchTerm);
        const inCourse =
          selectedCourse === "All" || note.course === selectedCourse;
        return inSearch && inCourse;
      });
  
      filtered.sort((a, b) => {
        if (sortOption === "Oldest") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortOption === "Newest") {
          return new Date(b.date) - new Date(a.date);
        }
        return 0;
      });
  
      renderNotes(filtered);
    }
  
    searchInput.addEventListener("input", filterAndSortNotes);
    courseSelect.addEventListener("change", filterAndSortNotes);
    sortSelect.addEventListener("change", filterAndSortNotes);
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const course = document.getElementById("course").value;
      const title = document.getElementById("title").value;
      const postedBy = "You";
      const summary = document.getElementById("description").value;
      const date = new Date().toISOString().split("T")[0];
  
      notes.push({ course, title, postedBy, summary, date });
      message.textContent = "Note submitted successfully!";
      message.style.color = "green";
      form.reset();
      filterAndSortNotes();
    });
  
    loading.style.display = "block";
    setTimeout(() => {
      loading.style.display = "none";
      renderNotes(notes);
    }, 1000);
  })