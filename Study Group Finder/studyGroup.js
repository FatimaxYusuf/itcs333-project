document.addEventListener("DOMContentLoaded", function () {
  const groupContainer = document.getElementById("groupContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  let allGroups = [];

  // Fetch all groups at first and store them
  fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-groups.php")
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.groups)) {
        allGroups = data.groups;
        renderGroups(allGroups);
      } else {
        groupContainer.innerHTML = "<p>Failed to load groups.</p>";
      }
    })
    .catch(() => {
      groupContainer.innerHTML = "<p>Error loading groups.</p>";
    });

  // Render groups to the page
  function renderGroups(groups) {
    groupContainer.innerHTML = "";
    if (!groups.length) {
      groupContainer.innerHTML = "<p>No groups found.</p>";
      return;
    }
    groups.forEach(group => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="group-card">
          <div class="group-title">${group.title}</div>
          <div class="group-info"><strong>Subject:</strong> ${group.subject}</div>
          <div class="group-info"><strong>Location:</strong> ${group.location}</div>
          <div class="group-info"><strong>Day:</strong> ${group.meeting_day}</div>
          <div class="group-info"><strong>Time:</strong> ${group.meeting_time}</div>
          <div class="group-info"><strong>Spots:</strong> 0 / ${group.capacity} filled</div>
          <button class="btn btn-join mt-3" onclick="window.location.href='groupChat.html?id=${group.id}'">Join Group</button>
        </div>
      `;
      groupContainer.appendChild(col);
    });
  }

  // Live search on input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    clearSearch.style.display = query.length > 0 ? "inline" : "none";
    if (!query) {
      renderGroups(allGroups);
      return;
    }
    const filtered = allGroups.filter(group =>
      (group.title && group.title.toLowerCase().includes(query)) ||
      (group.subject && group.subject.toLowerCase().includes(query)) ||
      (group.location && group.location.toLowerCase().includes(query)) ||
      (group.meeting_day && group.meeting_day.toLowerCase().includes(query)) ||
      (group.meeting_time && group.meeting_time.toLowerCase().includes(query))
    );
    renderGroups(filtered);
  });

  // Clear ❌ icon
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    renderGroups(allGroups);
  });
});

// Show/hide clear icon and clear input on click
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  if (!searchInput || !clearBtn) return;

  function toggleClearBtn() {
    clearBtn.style.display = searchInput.value.length > 0 ? "block" : "none";
  }
  searchInput.addEventListener("input", toggleClearBtn);
  clearBtn.addEventListener("click", function () {
    searchInput.value = "";
    clearBtn.style.display = "none";
    searchInput.dispatchEvent(new Event("input"));
    // Reset the group list to default
    if (typeof renderGroups === "function" && typeof allGroups !== "undefined") {
      renderGroups(allGroups);
    } else {
      window.location.reload();
    }
  });
  toggleClearBtn();
});
