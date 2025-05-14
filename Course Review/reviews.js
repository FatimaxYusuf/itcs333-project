let allReviews = [];
let currentPage = 1;
const reviewsPerPage = 5;

window.onload = function () {
  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "block";
//
  fetch("reviews.json")
    .then((response) => response.json())
    .then((reviews) => {
      allReviews = reviews;
      renderReviews(allReviews);
    })
    .catch((error) => console.error("Error fetching reviews:", error))
    .finally(() => {
      loadingIndicator.style.display = "none";
    });
};

function renderReviews(reviews) {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";

  if (reviews.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No reviews to display";
    container.appendChild(message);
    return;
  }

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const reviewsToDisplay = reviews.slice(startIndex, endIndex);

  reviewsToDisplay.forEach(addReviewToPage);
  renderPaginationControls(reviews.length);
}

document.getElementById("reviewForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const course = document.getElementById("courseName").value.trim();
  const instructor = document.getElementById("instructorName").value.trim();
  const rating = document.getElementById("rating").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!course || !instructor || !rating || !comment) {
    alert("❌ Please fill in all fields!");
    return;
  }

  const ratingNumber = Number(rating);
  if (ratingNumber < 1 || ratingNumber > 5) {
    alert("❌ Rating must be between 1 and 5!");
    return;
  }

  const newReview = {
    course,
    instructor,
    rating: ratingNumber,
    comment
  };

  saveReview(newReview);
  allReviews.unshift(newReview);
  renderReviews(allReviews);
  alert("✅ Review submitted successfully!");
  this.reset();
});

function saveReview(review) {
  console.log("Simulated saving:", review);
}

function addReviewToPage(review) {
  const reviewsContainer = document.getElementById("reviewsContainer");
  const reviewCard = document.createElement("div");
  reviewCard.classList.add("container", "p-4");

  reviewCard.innerHTML = `
    <div class="card bg-dark text-white" style="background-color: var(--nav-bg)!important;">
      <div class="card-header">
        <h5 class="mb-0 text-wrap">${review.course}</h5>
      </div>
      <div class="card-body">
        <h6 class="card-title text-wrap">Instructor: ${review.instructor}</h6>
        <p class="card-text text-wrap">
          <strong>Rating:</strong> ${"★".repeat(review.rating)} (${review.rating}/5)<br><br>
          ${review.comment}
        </p>
        <div class="buttons"></div>
      </div>
    </div>
  `;


  const buttonsDiv = reviewCard.querySelector(".buttons");

  const commentBtn = document.createElement("button");
  commentBtn.className = "btn btn-primary btn-lg";
  commentBtn.style = "background-color: var(--bg-light) !important; color: var(--text-dark);";
  commentBtn.innerHTML = '<i class="fa-solid fa-comments"></i> ';
  commentBtn.addEventListener("click", function () {
    const path = window.location.origin + "/Course Review/commnt.html";

    window.location.href = `${path}?course=${encodeURIComponent(review.course)}&instructor=${encodeURIComponent(review.instructor)}&rating=${review.rating}&comment=${encodeURIComponent(review.comment)}`;
  });
  
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-primary btn-lg";
  deleteBtn.style = "background-color: var(--bg-light) !important; color: var(--text-dark);";
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener("click", function () {
    if (confirm(`Are you sure you want to delete the review for ${review.course}?`)) {
      allReviews = allReviews.filter((r) => r !== review);
      renderReviews(allReviews);
    }
  });

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary btn-lg";
  editBtn.style = "background-color: var(--bg-light) !important; color: var(--text-dark);";
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';


  buttonsDiv.appendChild(commentBtn);
  buttonsDiv.appendChild(deleteBtn);
  buttonsDiv.appendChild(editBtn);

  reviewsContainer.prepend(reviewCard);
}

function showReviewDetails(review) {
  alert(`Details for ${review.course}:\nInstructor: ${review.instructor}\nRating: ${review.rating}\nComment: ${review.comment}`);
}


document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allReviews.filter((r) =>
    r.course.toLowerCase().includes(keyword)
  );
  renderReviews(filtered);
});

document.getElementById("filterSelect").addEventListener("change", function () {
  const value = this.value;
  let filtered = [...allReviews];

  if (value !== "all" && value !== "Filter") {
    filtered = filtered.filter((r) => r.rating == value);
  }

  renderReviews(filtered);
});


document.getElementById("sortSelect").addEventListener("change", function () {
  const value = this.value;
  let sorted = [...allReviews];

  if (value === "highest rated") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (value === "lowest rated") {
    sorted.sort((a, b) => a.rating - b.rating);
  } else if (value === "old to new") {
    sorted.reverse();
  }

  renderReviews(sorted);
});


function renderPaginationControls(totalReviews) {
  const paginationContainer = document.querySelector(".custom-pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  if (totalPages <= 1) return;

 
  const prevItem = document.createElement("li");
  prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevItem.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderReviews(allReviews);
    }
  });
  paginationContainer.appendChild(prevItem);

  
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderReviews(allReviews);
    });
    paginationContainer.appendChild(pageItem);
  }

  const nextItem = document.createElement("li");
  nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextItem.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderReviews(allReviews);
    }
  });
  paginationContainer.appendChild(nextItem);
}
//