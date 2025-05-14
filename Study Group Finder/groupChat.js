document.addEventListener("DOMContentLoaded", function () {
  const groupTitle = document.getElementById("groupTitle");
  const chatBox = document.getElementById("chatBox");
  const messageForm = document.getElementById("messageForm");
  const senderName = document.getElementById("senderName");
  const messageText = document.getElementById("messageText");
  const sendBtn = messageForm.querySelector('button[type="submit"]');

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("id");

  if (!groupId) {
    alert("No group ID provided.");
    window.location.href = "studyGroup.html";
  }

  // Load group info
  fetch(`https://your-replit-url/get-group.php?id=${groupId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const group = data.group;
        groupTitle.textContent = group.title;
        document.getElementById("groupDescription").textContent = group.description;
        document.getElementById("groupLocation").textContent = group.location;
        document.getElementById("groupDay").textContent = group.meeting_day;
        document.getElementById("groupTime").textContent = group.meeting_time;
        document.getElementById("groupCapacity").textContent = `${group.current_members || 0} / ${group.capacity}`;
      }
    });

  // Load messages
  function loadMessages() {
    fetch(`https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-messages.php?group_id=${groupId}`)
      .then(res => res.json())
      .then(messages => {
        chatBox.innerHTML = "";
        messages.forEach(msg => {
          const msgDiv = document.createElement("div");
          msgDiv.className = "chat-message";
          msgDiv.innerHTML = `
            <span class="sender">${msg.sender_name}</span>
            <span class="timestamp">${msg.created_at}</span>
            <div class="text">${msg.message}</div>
          `;
          chatBox.appendChild(msgDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
      });
  }

  loadMessages();
  setInterval(loadMessages, 5000); // refresh every 5 seconds

  // Enable send button only if both fields have text
  function toggleSendBtn() {
    sendBtn.disabled = !(senderName.value.trim() && messageText.value.trim());
    sendBtn.style.display = "block"; // Always show the button
  }
  // Show send button as soon as user types
  senderName.addEventListener("input", toggleSendBtn);
  messageText.addEventListener("input", toggleSendBtn);
  toggleSendBtn();

  // Send message
  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const messageData = {
      group_id: groupId,
      sender_name: senderName.value.trim(),
      message: messageText.value.trim()
    };

    if (!messageData.sender_name || !messageData.message) {
      sendBtn.disabled = true;
      return;
    }

    sendBtn.disabled = true; // Prevent double submit

    fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/send-message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData)
    })
      .then(res => {
        // Check for HTTP errors
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then(result => {
        if (result && result.success) {
          messageText.value = "";
          toggleSendBtn();
          loadMessages();
        } else {
          alert("Error sending message: " + (result && result.error ? result.error : "Unknown error"));
          toggleSendBtn();
        }
      })
      .catch((err) => {
        alert("Network error while sending message: " + err.message);
        toggleSendBtn();
      });
  });

  // Allow Enter to send (without Shift)
  messageText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) {
        messageForm.requestSubmit();
      }
    }
  });
});

