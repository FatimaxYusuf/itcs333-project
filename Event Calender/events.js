if (!localStorage.getItem("events")) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sampleEvents = [
        {
            title: "Bahrain Science Expo",
            date: today.toISOString().split("T")[0], // Today
            time: "9:00 AM",
            location: " Bulding CA",
            description: "A showcase of scientific innovations and student projects.",
            category: "Education"
        },
        {
            title: "Startup Bahrain Meetup",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split("T")[0], // 3 days later
            time: "6:00 PM",
            location: "Open lab",
            description: "Networking event for local entrepreneurs and investors.",
            category: "Business"
        },
        {
            title: "Beach Cleanup Campaign",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12).toISOString().split("T")[0], // 12 days later
            time: "7:30 AM",
            location: "Amwaj Islands",
            description: "Join volunteers in keeping Bahrain’s shores clean.",
            category: "Environment"
        },
        {
            title: "Bahrain National Day Parade",
            date: new Date(today.getFullYear(), 11, 16).toISOString().split("T")[0], // December 16
            time: "4:00 PM",
            location: "Abdulaziz Hall",
            description: "Celebrate Bahrain’s National Day with fireworks and parade.",
            category: "Cultural"
        },
        {
            title: "Manama International Book Fair",
            date: new Date(today.getFullYear(), 9, 20).toISOString().split("T")[0], // October 20
            time: "10:00 AM",
            location: "Bahrain National Museum",
            description: "Explore thousands of books and attend author talks.",
            category: "Education"
        },
        {
            title: "Alumni Career Talk",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString().split("T")[0], // 2 days ago
            time: "2:00 PM",
            location: "Lecture Hall 3",
            description: "Insights from graduates on career growth.",
            category: "Career"
        },
    ];

    localStorage.setItem("events", JSON.stringify(sampleEvents));
}

document.addEventListener("DOMContentLoaded", function () {
    const events = JSON.parse(localStorage.getItem("events")) || []; // Retrieve existing events from localStorage
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Normalize the time to midnight for accurate comparison

    const todayEvents = [];
    const nextWeekEvents = [];
    const nextMonthEvents = [];
    const thisYearEvents = [];
    const previousEvents = [];

    // Helper function to calculate date ranges
    function isToday(date) {
        return date.toDateString() === today.toDateString();
    }

    function isWithinNextWeek(date) {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7); // Set next week date
        return date > today && date <= nextWeek;
    }
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(form); // Create a FormData object from the form
        const data = Object.fromEntries(formData.entries()); // Convert FormData to a plain object

        if (!data.eventTitle || !data.eventDate || !data.eventTime || !data.eventLocation || !data.eventDescription) {
            alert("Please fill in all fields before submitting the form.");
            return;
        }
        const eventData = {
            title: data.eventTitle,
            date: data.eventDate,
            time: data.eventTime,
            location: data.eventLocation,
            description: data.eventDescription,
            category: data.eventCategory,
        };
        const existingEvents = JSON.parse(localStorage.getItem("events")) || []; // Retrieve existing events from localStorage
        existingEvents.push(eventData); // Add the new event to the array
        localStorage.setItem("events", JSON.stringify(existingEvents));

        alert("Event added successfully!"); // Show a success message

        form.reset(); // Reset the form fields
        window.location.href = "eventsCalender.html"; // Redirect to the events page
    });
});
    function isWithinNextMonth(date) {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        return date > today && date <= nextMonth;
    }

    function isWithinThisYear(date) {
        return date.getFullYear() === today.getFullYear();
    }
    function isPrevious(date) {
        return date < today; // Check if the event date is in the past
    }
    events.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Normalize to midnight
        if (isPrevious(eventDate)) {
            previousEvents.push(event);
        }else if (isToday(eventDate)) {
            todayEvents.push(event);
        } else if (isWithinNextWeek(eventDate)) {
            nextWeekEvents.push(event);
        } else if (isWithinNextMonth(eventDate)) {
            nextMonthEvents.push(event);
        } else if (isWithinThisYear(eventDate)) {
            thisYearEvents.push(event);
        }
    });

    function createEventCard(event) {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
      

            <div class="event-card">
                <div class="event-date">${new Date(event.date).toDateString()}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">
                    ${event.description} ${event.time ? `at ${event.time}` : ""} in ${event.location}.
                </div>

                <!-- Comment Icon -->
                <div class="mt-2">
                 <button class="btn btn-sm btn-outline-secondary toggle-comment-btn">
                 💬 Comments
                 </button>
                </div>

                <!-- Hidden comment section -->
                 <div class="comment-section mt-3" style="display: none;">
                  <textarea class="form-control comment-input" rows="2" placeholder="Write a comment..."></textarea>
                 <button class="btn btn-sm btn-primary mt-2 submit-comment-btn">Submit</button>
                 <ul class="comment-list mt-3"></ul>
               </div>


              <div class="EditButton">
             <button type="button" class="btn btn-primary btn-sm" data-index="${events.findIndex(e => e.title === event.title && e.date === event.date)}">Edit</button>
             <button type="button" class="btn btn-danger btn-sm">Delete</button>
</div>

            </div>
        `;
          const commentList = col.querySelector(".comment-list");
        const key = `comments_${event.title}_${new Date(event.date).toDateString()}`;
        const savedComments = JSON.parse(localStorage.getItem(key)) || [];
        savedComments.forEach(text => {
         const li = document.createElement("li");
         li.textContent = text;
  commentList.appendChild(li);
});
        return col;
    }
    const searchTextInput = document.getElementById("searchText");
const searchDateInput = document.getElementById("searchDate");
const upcomingContainer = document.getElementById("upcoming-events");

function renderSearchResults() {
    const keyword = searchTextInput.value.toLowerCase().trim();
    const selectedDate = searchDateInput.value;
    const filteredEvents = allEvents.filter(event => {
        const matchesText = event.title.toLowerCase().includes(keyword) || event.description.toLowerCase().includes(keyword);
        const matchesDate = selectedDate ? event.date === selectedDate : true;
        return matchesText && matchesDate;
    });

    // Clear and rebuild
    upcomingContainer.innerHTML = "";

    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-center mb-4";
    header.innerHTML = `
        <h2 class="h5 mb-0">Search Results</h2>
        <a href="addEvents.html" class="btn btn-primary">➕ Add New Event</a>
    `;
    upcomingContainer.appendChild(header);

    const resultsRow = document.createElement("div");
    resultsRow.className = "row row-cols-1 g-4";

    if (filteredEvents.length === 0) {
        const msg = document.createElement("div");
        msg.className = "no-events-message";
        msg.textContent = "No events match your search.";
        resultsRow.appendChild(msg);
    } else {
        filteredEvents.forEach(event => {
            const card = createEventCard(event);
            resultsRow.appendChild(card);
        });
    }

    upcomingContainer.appendChild(resultsRow);

    if (!keyword && !selectedDate) {
        window.location.reload();
    }
}

// Trigger search as user types or picks a date
searchTextInput.addEventListener("input", renderSearchResults);
searchDateInput.addEventListener("change", renderSearchResults);


    function sortEvents(eventsArray) {
        eventsArray.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
        });
    }
    
    sortEvents(todayEvents);
    sortEvents(nextWeekEvents);
    sortEvents(nextMonthEvents);
    sortEvents(thisYearEvents);
    

    function appendEvents(eventsArray, sectionId , label) {
        const section = document.getElementById(sectionId);
        const row = section.querySelector(".row");
        if(eventsArray.length === 0) {
            const noEventsMessage = document.createElement("div");
            noEventsMessage.className = "no-events-message";
            noEventsMessage.textContent = `No events ${label}.`;
            row.appendChild(noEventsMessage);
        }
        eventsArray.forEach(event => {
            const eventCard = createEventCard(event);
            row.appendChild(eventCard);
        });
    }

    // Call appendEvents for each category
    appendEvents(todayEvents, "today-events" , "for today");
    appendEvents(nextWeekEvents, "next-week-events" , "for this week");
    appendEvents(nextMonthEvents, "this-month-events" , "for this month");
    appendEvents(thisYearEvents, "this-year-events" , "for this year");
    appendEvents(previousEvents, "previous-events-container", "from the past");

});
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-danger")) {
        const card = e.target.closest(".event-card");
        const eventTitle = card.querySelector(".event-title").textContent;
        const eventDate = card.querySelector(".event-date").textContent;

        const confirmation = confirm(`Are you sure you want to delete the event "${eventTitle}" scheduled on ${eventDate}?`);
        if (confirmation) {
            let events = JSON.parse(localStorage.getItem("events")) || []; // Retrieve existing events from localStorage
            const index = events.findIndex(event => event.title === eventTitle && new Date(event.date).toDateString() === eventDate);
            if (index !== -1) {
                events.splice(index, 1); // Remove the event from the array
                localStorage.setItem("events", JSON.stringify(events)); // Update localStorage
                card.remove(); // Remove the card from the DOM
                alert("Event deleted successfully!");
            }
        }
    }
    // Ensure the Edit button click event stores event data and redirects
    if (e.target.classList.contains("btn-primary")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        let events = JSON.parse(localStorage.getItem("events")) || [];
      
        if (!isNaN(index) && events[index]) {
          localStorage.setItem("editEvent", JSON.stringify(events[index]));
          localStorage.setItem("editIndex", index);
          window.location.href = "../Event%20Calender/addEvents.html";
        }
      }
      
});
document.addEventListener("DOMContentLoaded", function () {

  const checkbox = document.getElementById('btn');
  checkbox.addEventListener('change', () => {
    document.body.classList.toggle('menu-open', checkbox.checked);
  });


});
let previousVisible = false;

function togglePreviousEvents() {
    const previousEvents = document.getElementById("previous-events");
    const toggleButton = document.getElementById("toggle-previous-btn");

    if (previousEvents.style.display === "none" || previousEvents.style.display === "") {
        previousEvents.style.display = "block";
        toggleButton.textContent = "Hide Previous Events";
    } else {
        previousEvents.style.display = "none";
        toggleButton.textContent = "Previous Events";
    }
}

document.getElementById("toggle-previous-btn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    togglePreviousEvents();
});
document.addEventListener("DOMContentLoaded", function () {
    const searchText = document.getElementById("searchText");
    const searchDate = document.getElementById("searchDate");
    const clearSearchText = document.getElementById("clearSearchText");
    const clearSearchDate = document.getElementById("clearSearchDate");
    const sections = {
        "today-events": "Today",
        "next-week-events": "This Week",
        "this-month-events": "This Month",
        "this-year-events": "This Year",
        "previous-events": "Previous Events"
    };

    function filterEvents() {
        const text = searchText.value.toLowerCase().trim();
        const date = searchDate.value;

        const allEventCards = document.querySelectorAll(".event-card");
        let hasResults = false;
        let visibleSection = null;

        allEventCards.forEach(card => {
            const title = card.querySelector(".event-title").textContent.toLowerCase();
            const description = card.querySelector(".event-description").textContent.toLowerCase();
            const eventDateElement = card.querySelector(".event-date");
            const eventDate = eventDateElement ? new Date(eventDateElement.textContent).toISOString().split("T")[0] : "";

            const matchesText = text === "" || title.includes(text) || description.includes(text);
            const matchesDate = date === "" || eventDate === date;

            if (matchesText && matchesDate) {
                card.parentElement.style.display = "block"; // Show the card
                hasResults = true;

                // Determine which section to show based on the card's parent section
                for (const sectionId in sections) {
                    if (card.closest(`#${sectionId}`)) {
                        visibleSection = sectionId;
                        break;
                    }
                }
            } else {
                card.parentElement.style.display = "none"; // Hide the card
            }
        });

        // Show only the relevant section and hide the rest
        for (const sectionId in sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = sectionId === visibleSection ? "block" : "none";
            }
        }

        // Show a message if no results are found
        const noResultsMessage = document.getElementById("no-results-message");
        if (!hasResults && (text || date)) {
            if (!noResultsMessage) {
                const message = document.createElement("div");
                message.id = "no-results-message";
                message.className = "no-events-message";
                message.textContent = "No events match your search.";
                document.getElementById("upcoming-events").appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }

        // Reset to default if both fields are empty
        if (text === "" && date === "") {
            resetSearch();
        }
    }

    function resetSearch() {
        searchText.value = "";
        searchDate.value = "";

        // Reset all sections to visible
        for (const sectionId in sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = "block";
            }
        }

        // Show all event cards
        const allEventCards = document.querySelectorAll(".event-card");
        allEventCards.forEach(card => {
            card.parentElement.style.display = "block";
        });

        // Remove the no results message if it exists
        const noResultsMessage = document.getElementById("no-results-message");
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    searchText.addEventListener("input", filterEvents);
    searchDate.addEventListener("input", filterEvents);
    clearSearchText.addEventListener("click", resetSearch);
    clearSearchDate.addEventListener("click", resetSearch);
});
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-comment-btn")) {
    const commentSection = e.target.closest(".event-card").querySelector(".comment-section");
    commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
  }

  if (e.target.classList.contains("submit-comment-btn")) {
    const card = e.target.closest(".event-card");
    const title = card.querySelector(".event-title").innerText;
    const date = card.querySelector(".event-date").innerText;
    const commentInput = card.querySelector(".comment-input");
    const commentList = card.querySelector(".comment-list");

    const commentText = commentInput.value.trim();
    if (commentText !== "") {
      const key = `comments_${title}_${date}`;
      const existingComments = JSON.parse(localStorage.getItem(key)) || [];
      existingComments.push(commentText);
      localStorage.setItem(key, JSON.stringify(existingComments));

      const li = document.createElement("li");
      li.textContent = commentText;
      commentList.appendChild(li);
      commentInput.value = "";
    }
  }
});

