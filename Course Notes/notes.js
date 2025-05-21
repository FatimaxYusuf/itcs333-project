console.log("✅ notes.js loaded");

// Fetch subjects and display them
function loadSubjects() {
  fetch("https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-subjects.php")
    .then(res => res.json())
    .then(data => {
      const subjectList = document.getElementById('subjectList');
      subjectList.innerHTML = '';

      if (!data.success || !data.subjects || data.subjects.length === 0) {
        subjectList.innerHTML = '<div class="alert alert-info">No subjects found.</div>';
        return;
      }

      data.subjects.forEach(subj => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">${subj.subject_code} - ${subj.subject_name}</span>
            <button class="btn btn-sm btn-primary" data-id="${subj.id}">View Notes</button>
          </div>
        `;
        card.querySelector('button').onclick = () => showNotes(subj.id, `${subj.subject_code} - ${subj.subject_name}`);
        subjectList.appendChild(card);
      });
    })
    .catch(() => {
      const subjectList = document.getElementById('subjectList');
      subjectList.innerHTML = '<div class="alert alert-danger">Failed to load subjects.</div>';
    });
}

// Show notes for a subject
function showNotes(subjectId, subjectName) {
  document.getElementById('subjectList').style.display = 'none';
  document.getElementById('notesSection').style.display = '';
  document.getElementById('subjectTitle').textContent = subjectName;
  loadNotes(subjectId);

  // Store subjectId for upload
  document.getElementById('uploadForm').dataset.subjectId = subjectId;
}

// Back to subject list
function backToSubjects() {
  document.getElementById('notesSection').style.display = 'none';
  document.getElementById('subjectList').style.display = '';
  document.getElementById('notesList').innerHTML = '';
  document.getElementById('uploadStatus').innerHTML = '';
}

// Load notes for a subject
function loadNotes(subjectId) {
  fetch('https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-notes.php?subject_id=' + encodeURIComponent(subjectId))
    .then(res => res.json())
    .then(data => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = '';

      if (!data.success || !data.notes || data.notes.length === 0) {
        notesList.innerHTML = '<div class="alert alert-warning">No notes uploaded yet.</div>';
        return;
      }

      data.notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-card';
        noteDiv.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">${note.note_title}</div>
              <div class="text-muted small">${note.description || ''}</div>
            </div>
            <a href="${note.file_url}" class="btn btn-sm btn-success" target="_blank"><i class="fa fa-download"></i> Download</a>
          </div>
        `;
        notesList.appendChild(noteDiv);
      });
    })
    .catch(() => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = '<div class="alert alert-danger">Failed to load notes.</div>';
    });
}

// Upload note
document.addEventListener('DOMContentLoaded', function () {
  loadSubjects();

  document.getElementById('uploadForm').onsubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const subjectId = form.dataset.subjectId;
    if (!subjectId) {
      document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-danger">No subject selected.</div>';
      return;
    }
    const formData = new FormData(form);
    formData.append('subject_id', subjectId);

    fetch('https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-note.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-success">Note uploaded successfully!</div>';
        form.reset();
        loadNotes(subjectId);
      } else {
        document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-danger">' + (result.error || 'Upload failed.') + '</div>';
      }
    })
    .catch(() => {
      document.getElementById('uploadStatus').innerHTML = '<div class="alert alert-danger">Network error.</div>';
    });
  };
});
