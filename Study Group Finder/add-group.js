document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
  title: document.getElementById("groupName").value,
  subject: document.getElementById("subject").value,
  meeting_day: document.getElementById("meetingDay").value,
  meeting_time: document.getElementById("time").value,
  location: document.getElementById("location").value,
  capacity: document.getElementById("capacity").value,
  description: document.getElementById("description").value
};

    const response = await fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-group.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      alert("Group created successfully!");
      window.location.href = "studyGroup.html";
    } else {
      alert("Failed to create group: " + result.error);
    }
  });
});
