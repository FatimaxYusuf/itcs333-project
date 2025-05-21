// subject-notes.js

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subject_id');
  const subjectName = urlParams.get('subject_name');
  const subjectTitle = document.getElementById('subjectTitle');
  const notesList = document.getElementById('notesList');
  const uploadForm = document.getElementById('uploadForm');
  const uploadStatus = document.getElementById('uploadStatus');
  const searchInput = document.getElementById('searchNotesInput');
  let allNotes = [];

  if (subjectName) subjectTitle.textContent = subjectName + ' Notes';

  function renderNotes(notes) {
    notesList.innerHTML = '';
    if (notes.length > 0) {
      notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
          <div class="fw-bold">${note.note_title}</div>
          <div class="text-muted mb-2">${note.description || ''}</div>
          <a href="${note.file_url || note.filename}" target="_blank" class="btn btn-outline-primary btn-sm">Download/View</a>
        `;
        notesList.appendChild(card);
      });
    } else {
      notesList.innerHTML = '<div class="alert alert-info">No notes found for this subject.</div>';
    }
  }

  function loadNotes() {
    notesList.innerHTML = 'Loading...';
    fetch(`https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-notes.php?subject_id=${subjectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          allNotes = data.notes;
          renderNotes(allNotes);
        } else {
          notesList.innerHTML = '<div class="alert alert-danger">Failed to load notes.</div>';
        }
      });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        renderNotes(allNotes);
        return;
      }
      const filtered = allNotes.filter(note =>
        (note.note_title && note.note_title.toLowerCase().includes(q)) ||
        (note.description && note.description.toLowerCase().includes(q))
      );
      renderNotes(filtered);
    });
  }

  loadNotes();

  // Upload note
  if (uploadForm) {
    uploadForm.onsubmit = function (e) {
      e.preventDefault();
      uploadStatus.textContent = 'Uploading...';
      const formData = new FormData(uploadForm);
      formData.append('subject_id', subjectId);
      // Validate file type before uploading
      const fileInput = uploadForm.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      if (file) {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/gif'
        ];
        if (!allowedTypes.includes(file.type)) {
          uploadStatus.textContent = 'Only PDF, Word, PowerPoint, Excel, text, and image files are allowed.';
          return;
        }
      }
      fetch('https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-note.php', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            uploadStatus.textContent = 'Note uploaded!';
            uploadForm.reset();
            loadNotes();
            setTimeout(() => uploadStatus.textContent = '', 1000);
          } else {
            uploadStatus.textContent = data.error || 'Error uploading note.';
          }
        })
        .catch(() => {
          uploadStatus.textContent = 'Error uploading note.';
        });
    };
  }
});
