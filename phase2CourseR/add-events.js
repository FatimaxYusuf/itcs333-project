// scripts.js - Improved Version for Add/Edit Event Form

// ===== Helper Functions =====
function getStoredEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
}

function setStoredEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function validateEventData(data) {
    return data.eventTitle && data.eventDate && data.eventTime && data.eventLocation && data.eventDescription;
}

function buildEventObject(data) {
    return {
        title: data.eventTitle,
        date: data.eventDate,
        time: data.eventTime,
        location: data.eventLocation,
        description: data.eventDescription,
        category: data.eventCategory || "Other"
    };
}

function prefillForm(form, event) {
    form.eventTitle.value = event.title;
    form.eventDate.value = event.date;
    form.eventTime.value = event.time;
    form.eventLocation.value = event.location;
    form.eventDescription.value = event.description;
    if (form.eventCategory) form.eventCategory.value = event.category;
}

function redirectToCalendar() {
    window.location.href = "eventsCalender.html";
}

// ===== Main Handler =====
document.addEventListener("DOMContentLoaded", function () {
    // Ensure form pre-fills correctly when editEvent data is present
    const editEvent = JSON.parse(localStorage.getItem("editEvent"));
    if (editEvent) {
        document.getElementById("eventTitle").value = editEvent.title;
        document.getElementById("eventDate").value = editEvent.date;
        document.getElementById("eventTime").value = editEvent.time || "";
        document.getElementById("eventLocation").value = editEvent.location;
        document.getElementById("eventCategory").value = editEvent.category || "";
        document.getElementById("eventDescription").value = editEvent.description || "";
    }

    const form = document.getElementById("eventForm");

    const editIndex = localStorage.getItem("editIndex");
    const events = getStoredEvents();

    // Prefill if editing
    if (editIndex !== null && events[editIndex]) {
        prefillForm(form, events[editIndex]);
    }

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!validateEventData(data)) {
            alert("Please fill in all fields before submitting the form.");
            return;
        }

        const eventData = buildEventObject(data);

        if (editIndex !== null && events[editIndex]) {
            events[editIndex] = eventData;
            localStorage.removeItem("editIndex");
            alert("Event updated successfully!");
        } else {
            events.push(eventData);
            alert("Event added successfully!");
        }

        setStoredEvents(events);
        form.reset();
        redirectToCalendar();
    });
});
