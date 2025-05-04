document.addEventListener("DOMContentLoaded", function () {
    const events = JSON.parse(localStorage.getItem("events")) || []; // Retrieve existing events from localStorage
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Normalize the time to midnight for accurate comparison

    const todayEvents = [];
    const nextWeekEvents = [];
    const nextMonthEvents = [];
    const thisYearEvents = [];

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

    events.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Normalize to midnight

        if (isToday(eventDate)) {
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
                <div class="EditButton">
                    <button type="button" class="btn btn-primary btn-sm">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>
        `;
        return col;
    }

    function appendEvents(eventsArray, sectionId) {
        const section = document.getElementById(sectionId);
        const row = section.querySelector(".row");
        eventsArray.forEach(event => {
            const eventCard = createEventCard(event);
            row.appendChild(eventCard);
        });
    }

    // Call appendEvents for each category
    appendEvents(todayEvents, "today-events");
    appendEvents(nextWeekEvents, "next-week-events");
    appendEvents(nextMonthEvents, "this-month-events");
    appendEvents(thisYearEvents, "this-year-events");
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
            } else {
                alert("Event not found!");
            }
        }
    }
    if (e.target.classList.contains("btn-primary")) {
        const card = e.target.closest(".event-card");
        const title = card.querySelector(".event-title").textContent;
        const date = new Date(card.querySelector(".event-date").textContent).toISOString().split("T")[0];

        let events = JSON.parse(localStorage.getItem("events")) || [];
        const index = events.findIndex(event => event.title === title && event.date === date);
        if (index !== -1) {
            localStorage.setItem("editIndex", index);
            window.location.href = "addEvents.html";
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {

  const checkbox = document.getElementById('btn');
  checkbox.addEventListener('change', () => {
    document.body.classList.toggle('menu-open', checkbox.checked);
  });


});