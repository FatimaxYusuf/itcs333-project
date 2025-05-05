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
        }
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
             <button type="button" class="btn btn-primary btn-sm" data-index="${events.findIndex(e => e.title === event.title && e.date === event.date)}">Edit</button>
             <button type="button" class="btn btn-danger btn-sm">Delete</button>
</div>

            </div>
        `;
        return col;
    }

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
