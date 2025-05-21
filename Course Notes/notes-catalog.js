// notes-catalog.js

document.addEventListener('DOMContentLoaded', function () {
  const subjectList = document.getElementById('subjectList');
  const addSubjectForm = document.getElementById('addSubjectForm');
  const addSubjectStatus = document.getElementById('addSubjectStatus');

  // Fetch and display subjects
  function loadSubjects() {
    fetch('https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/get-subjects.php')
      .then(res => res.json())
      .then(data => {
        subjectList.innerHTML = '';
        if (data.success && data.subjects.length > 0) {
          data.subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card d-flex align-items-center';
            card.style.cursor = 'pointer';
            card.innerHTML = `
              <i class="fa-solid fa-folder fa-2x me-3" style="color: #7886C7;"></i>
              <div>
                <div class="fw-bold">${subject.subject_name}</div>
                <div class="text-muted">${subject.subject_code}</div>
              </div>
            `;
            card.onclick = () => {
              window.location.href = `subject-notes.html?subject_id=${subject.id}&subject_name=${encodeURIComponent(subject.subject_name)}`;
            };
            subjectList.appendChild(card);
          });
        } else {
          subjectList.innerHTML = '<div class="alert alert-info">No subjects found. Add one!</div>';
        }
      });
  }

  loadSubjects();

  // Add Subject form
  if (addSubjectForm) {
    addSubjectForm.onsubmit = function (e) {
      e.preventDefault();
      addSubjectStatus.textContent = 'Adding...';
      const formData = {
        subject_code: addSubjectForm.subject_code.value,
        subject_name: addSubjectForm.subject_name.value
      };
      fetch('https://d8198667-ff75-455a-b79b-07dd0d479be4-00-r4gn5klvlyu4.pike.replit.dev/add-subjects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            addSubjectStatus.textContent = 'Subject added!';
            addSubjectForm.reset();
            loadSubjects();
            setTimeout(() => {
              addSubjectStatus.textContent = '';
              // Hide modal
              const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addSubjectModal'));
              modal.hide();
            }, 800);
          } else {
            addSubjectStatus.textContent = data.error || 'Error adding subject.';
          }
        })
        .catch(() => {
          addSubjectStatus.textContent = 'Error adding subject.';
        });
    };
  }
});
