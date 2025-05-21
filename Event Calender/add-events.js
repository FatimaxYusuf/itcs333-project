document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("eventForm");

  const editEvent = JSON.parse(localStorage.getItem("editEvent"));
  const isEditing = editEvent !== null;

  if (isEditing) {
    form.eventTitle.value = editEvent.title;
    form.eventDate.value = editEvent.date;
    form.eventTime.value = editEvent.time || "";
    form.eventLocation.value = editEvent.location;
    form.eventCategory.value = editEvent.category || "";
    form.eventDescription.value = editEvent.description || "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
      category: data.eventCategory || "Other"
    };

    if (isEditing && editEvent) {
      fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/update-event.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: editEvent.id, // send the event ID instead
          ...eventData
        })
      })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          alert("✅ Event updated successfully!");
          localStorage.removeItem("editEvent");
          window.location.href = "eventsCalender.html";
        } else {
          alert("❌ Failed to update event: " + response.error);
        }
      })
      .catch(error => {
        console.error("❌ Network error:", error);
        alert("Network error while updating the event.");
      });

    } else {
      fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-events.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          alert("✅ Event added successfully!");
          window.location.href = "eventsCalender.html";
        } else {
          alert("❌ Failed to add event: " + response.error);
        }
      })
      .catch(error => {
        console.error("❌ Network error:", error);
        alert("Network error while adding the event.");
      });
    }
  });
});
