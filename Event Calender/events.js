// 📁 events.js

// Load and categorize events from database
function fetchAndDisplayEvents() {
  fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-events.php")
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        const events = response.data;
        categorizeAndRenderEvents(events);
      } else {
        console.error("Server error:", response.error);
      }
    })
    .catch(err => console.error("Network error:", err));
}

function categorizeAndRenderEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEvents = [], nextWeekEvents = [], nextMonthEvents = [], thisYearEvents = [], previousEvents = [];

  events.forEach(event => {
    const date = new Date(event.date);
    date.setHours(0, 0, 0, 0);

    if (date < today) return previousEvents.push(event);
    if (date.toDateString() === today.toDateString()) return todayEvents.push(event);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    if (date <= nextWeek) return nextWeekEvents.push(event);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    if (date <= nextMonth) return nextMonthEvents.push(event);

    if (date.getFullYear() === today.getFullYear()) return thisYearEvents.push(event);
  });

  displayEventSection("today-events", todayEvents);
  displayEventSection("next-week-events", nextWeekEvents);
  displayEventSection("this-month-events", nextMonthEvents);
  displayEventSection("this-year-events", thisYearEvents);
  displayEventSection("previous-events-container", previousEvents, true);
}

function displayEventSection(sectionId, eventsArray, hide = false) {
  const section = document.getElementById(sectionId);
  if (!section) {
    console.warn(`Section '${sectionId}' not found.`);
    return;
  }
  let row = section.querySelector(".row");
  if (!row) {
    row = document.createElement("div");
    row.className = "row row-cols-1 g-4";
    section.appendChild(row);
  } else {
    row.innerHTML = "";
  }

  if (hide) section.parentElement.style.display = "none";

  if (eventsArray.length === 0) {
    const msg = document.createElement("div");
    msg.className = "no-events-message";
    msg.textContent = `No events ${sectionId.includes("previous") ? "from the past" : "for this period"}.`;
    row.appendChild(msg);
    return;
  }

  eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  eventsArray.forEach(event => row.appendChild(createEventCard(event)));
}

function createEventCard(event) {
  const col = document.createElement("div");
  col.className = "col";
  // Ensure the data-id is set on the correct .event-card div
  col.innerHTML = 
  `<div class="event-card" data-id="${event.id}">
      <div class="event-title">${event.title}</div>
      <div class="event-date" data-date="${event.date}">${new Date(event.date).toDateString()}</div>
      <div class="event-description">${event.description} ${event.time ? `at ${event.time}` : ""} in ${event.location}.</div>
      <div class="mt-2">
        <button class="btn btn-sm btn-outline-secondary toggle-comment-btn">💬 Comments</button>
      </div>
      <div class="comment-section mt-3" style="display:none;">
        <textarea class="form-control comment-input" rows="2" placeholder="Write a comment..."></textarea>
        <button class="btn btn-sm btn-primary mt-2 submit-comment-btn">Submit</button>
        <ul class="comment-list mt-3"></ul>
      </div>
      <div class="EditButton">
        <button type="button" class="btn btn-primary btn-sm edit-event-btn">Edit</button>
        <button type="button" class="btn btn-danger btn-sm delete-event-btn">Delete</button>
      </div>
    </div>`;
  return col;
}

// Event Delegation
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-comment-btn")) {
    const section = e.target.closest(".event-card").querySelector(".comment-section");
    section.style.display = section.style.display === "none" ? "block" : "none";
  }

  if (e.target.classList.contains("submit-comment-btn")) {
    const card = e.target.closest(".event-card");
    const title = card.querySelector(".event-title").textContent.trim();
    const date = card.querySelector(".event-date").dataset.date;
    const input = card.querySelector(".comment-input");
    const list = card.querySelector(".comment-list");
    const comment = input.value.trim();

    if (!comment) return;

    fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-event-comment.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, comment })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const li = document.createElement("li");
        li.textContent = comment;
        list.appendChild(li);
        input.value = "";
      }
    });
  }

  if (e.target.classList.contains("edit-event-btn")) {
    const card = e.target.closest(".event-card");
    const event = {
      id: card.dataset.id,
      title: card.querySelector(".event-title").textContent.trim(),
      date: card.querySelector(".event-date").dataset.date,
      location: card.querySelector(".event-description").textContent.split(" in ")[1]?.replace(".", "").trim(),
      description: card.querySelector(".event-description").textContent.split(" in ")[0],
      time: card.querySelector(".event-description").textContent.includes("at") ? card.querySelector(".event-description").textContent.split("at ")[1].split(" in ")[0].trim() : "",
      category: ""
    };
    localStorage.setItem("editEvent", JSON.stringify(event));
    window.location.href = "addEvents.html";
  }

  if (e.target.classList.contains("delete-event-btn")) {
    const card = e.target.closest(".event-card");
    const id = card.dataset.id;
    // Get title and date for confirmation message
    const title = card.querySelector(".event-title").textContent.trim();
    const date = card.querySelector(".event-date").dataset.date;

    if (id && confirm(`Are you sure you want to delete "${title}" on ${date}?`)) {
      fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/delete-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }) // ensure id is sent as a string or number
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          card.remove();
          alert("✅ Event deleted successfully!");
        } else {
          alert("❌ Delete failed: " + res.error);
        }
      })
      .catch(err => {
        console.error("Network error:", err);
        alert("Network error while deleting.");
      });
    } else if (!id) {
      alert("❌ Cannot delete: Event ID not found.");
    }
  }
});

document.getElementById("toggle-previous-btn")?.addEventListener("click", function (e) {
  e.preventDefault();
  const prevSection = document.getElementById("previous-events");
  const toggle = document.getElementById("toggle-previous-btn");
  if (prevSection.style.display === "none" || prevSection.style.display === "") {
    prevSection.style.display = "block";
    toggle.textContent = "Hide Previous Events";
  } else {
    prevSection.style.display = "none";
    toggle.textContent = "Previous Events";
  }
});

document.addEventListener("DOMContentLoaded", fetchAndDisplayEvents);

// Script for shifting
document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("btn");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("change", function () {
      document.body.classList.toggle("menu-open", this.checked);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("btn");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("change", function () {
      document.body.classList.toggle("menu-open", this.checked);
    });
  }

  // 🔍 Live Text Search
  const searchInput = document.getElementById("searchText");
  const clearSearchBtn = document.getElementById("clearSearchText");

  searchInput?.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    document.querySelectorAll(".event-card").forEach(card => {
      const title = card.querySelector(".event-title")?.textContent.toLowerCase() || "";
      const desc = card.querySelector(".event-description")?.textContent.toLowerCase() || "";
      const matches = title.includes(query) || desc.includes(query);
      card.closest(".col").style.display = matches ? "" : "none";
    });
  });

// 📅 Live Date Search
searchDate?.addEventListener("input", function () {
  const selectedDate = this.value;
  if (!selectedDate) return;

  document.querySelectorAll(".event-card").forEach(card => {
    const eventDate = card.querySelector(".event-date")?.getAttribute("data-date");
    card.closest(".col").style.display = eventDate === selectedDate ? "" : "none";
  });
});


  
  // ❌ Clear search text and reset cards
  clearSearchBtn?.addEventListener("click", function () {
    searchInput.value = "";
    document.querySelectorAll(".event-card").forEach(card => {
      card.closest(".col").style.display = "";
    });
  });

  
});

