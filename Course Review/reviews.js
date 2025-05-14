const apiUrl = 'https://1b5b9e95-a129-4bd3-9f96-4210d4c9a495-00-uw4tvn1owecu.pike.replit.dev/api.php';
let allReviews = [];
let currentPage = 1;
const reviewsPerPage = 5;

window.onload = function() {
    loadReviews();
    
    
    document.getElementById("reviewForm").addEventListener("submit", handleFormSubmit);
    
    
    document.getElementById("searchForm").addEventListener("submit", function(e) {
        e.preventDefault();
        currentPage = 1;
        loadReviews();
    });
    
    document.getElementById("filterSelect").addEventListener("change", function() {
        currentPage = 1;
        loadReviews();
    });
    
    document.getElementById("sortSelect").addEventListener("change", function() {
        currentPage = 1;
        loadReviews();
    });
};

async function loadReviews() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "block";
    document.getElementById("reviewsContainer").innerHTML = "";
    
    try {
        const search = document.getElementById("searchInput").value;
        const filter = document.getElementById("filterSelect").value;
        const sort = document.getElementById("sortSelect").value;
        
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (filter !== 'all') params.append('filter', filter);
        params.append('sort', sort);
        params.append('page', currentPage);
        params.append('limit', reviewsPerPage);
        
        const response = await fetch(`${apiUrl}?${params.toString()}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || "Unknown error occurred");
        }
        
        allReviews = data.data;
        renderReviews(allReviews, data.pagination);
    } catch (error) {
        console.error("Error loading reviews:", error);
        alert("Failed to load reviews: " + error.message);
    } finally {
        loadingIndicator.style.display = "none";
    }
}

function getApiSortValue(uiSortValue) {
    switch (uiSortValue) {
        case 'highest rated': return 'highest';
        case 'lowest rated': return 'lowest';
        case 'old to new': return 'oldest';
        case 'new to old': return 'newest';
        default: return 'newest';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const course = document.getElementById("courseName").value.trim();
    const instructor = document.getElementById("instructorName").value.trim();
    const rating = document.getElementById("rating").value.trim();
    const comment = document.getElementById("comment").value.trim();
    
    
    if (!course || !instructor || !rating || !comment) {
        alert("Please fill in all fields");
        return;
    }
    
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        alert("Rating must be a number between 1 and 5");
        return;
    }
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                course_name: course,
                instructor_name: instructor,
                rating: ratingNum,
                comment: comment
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || "Review submission failed");
        }
        
        alert("Review submitted successfully!");
        document.getElementById("reviewForm").reset();
        
        
        const collapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
            toggle: false
        });
        collapse.hide();
        
       
        loadReviews();
    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review: " + error.message);
    }
}

function renderReviews(reviews, pagination) {
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = "";
    
    if (reviews.length === 0) {
        container.innerHTML = "<p class='text-center'>No reviews found</p>";
        return;
    }
    
    reviews.forEach(review => {
        const reviewCard = document.createElement("div");
        reviewCard.className = "container p-4";
        reviewCard.innerHTML = `
            <div class="card bg-dark text-white" style="background-color: var(--nav-bg)!important;">
                <div class="card-header">
                    <h5 class="mb-0 text-wrap">${review.course_name}</h5>
                </div>
                <div class="card-body">
                    <h6 class="card-title text-wrap">Instructor: ${review.instructor_name}</h6>
                    <p class="card-text text-wrap">
                        <strong>Rating:</strong> ${'★'.repeat(review.rating)} (${review.rating}/5)<br><br>
                        ${review.comment}
                    </p>
                    <p class="text-muted">Posted on: ${new Date(review.created_at).toLocaleDateString()}</p>
                    <div class="buttons">
                        <button class="btn btn-primary btn-lg comment-btn" style="background-color: var(--bg-light) !important; color: var(--text-dark);">
                            <i class="fa-solid fa-comments"></i>
                        </button>
                        <button class="btn btn-primary btn-lg delete-btn" style="background-color: var(--bg-light) !important; color: var(--text-dark);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="btn btn-primary btn-lg edit-btn" style="background-color: var(--bg-light) !important; color: var(--text-dark);">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
      
        reviewCard.querySelector('.delete-btn').addEventListener('click', () => deleteReview(review.id));
        reviewCard.querySelector('.edit-btn').addEventListener('click', () => editReview(review));
        reviewCard.querySelector('.comment-btn').addEventListener('click', () => viewComments(review));
        
        container.appendChild(reviewCard);
    });
    
    renderPagination(pagination);
}

async function deleteReview(id) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
        const response = await fetch(`${apiUrl}?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || "Failed to delete review");
        }
        
        alert("Review deleted successfully");
        loadReviews();
    } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review: " + error.message);
    }
}

function editReview(review) {
 
    document.getElementById("courseName").value = review.course_name;
    document.getElementById("instructorName").value = review.instructor_name;
    document.getElementById("rating").value = review.rating;
    document.getElementById("comment").value = review.comment;
    

    const collapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
        toggle: true
    });
    collapse.show();
    

    const form = document.getElementById("reviewForm");
    form.removeEventListener("submit", handleFormSubmit);
    form.addEventListener("submit", async function updateHandler(e) {
        e.preventDefault();
        
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    id: review.id,
                    course_name: document.getElementById("courseName").value.trim(),
                    instructor_name: document.getElementById("instructorName").value.trim(),
                    rating: parseInt(document.getElementById("rating").value.trim()),
                    comment: document.getElementById("comment").value.trim()
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || "Failed to update review");
            }
            
            alert("Review updated successfully!");
            form.reset();
            
            
            collapse.hide();
            
            
            loadReviews();
            

            form.removeEventListener("submit", updateHandler);
            form.addEventListener("submit", handleFormSubmit);
        } catch (error) {
            console.error("Error updating review:", error);
            alert("Failed to update review: " + error.message);
        }
    });
}

function viewComments(review) {
    const params = new URLSearchParams({
        review_id: review.id,
        course_name: review.course_name,
        instructor_name: review.instructor_name,
        rating: review.rating,
        comment: review.comment
    });
    window.location.href = `commnt.html?${params.toString()}`;
}




function renderPagination(pagination) {
    const container = document.querySelector(".custom-pagination");
    if (!container || !pagination || pagination.totalPages <= 1) {
        container.innerHTML = "";
        return;
    }
    
    container.innerHTML = "";
    
    
    const prevItem = document.createElement("li");
    prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadReviews();
        }
    });
    container.appendChild(prevItem);
    

    for (let i = 1; i <= pagination.totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            loadReviews();
        });
        container.appendChild(pageItem);
    }
    
    
    const nextItem = document.createElement("li");
    nextItem.className = `page-item ${currentPage === pagination.totalPages ? "disabled" : ""}`;
    nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < pagination.totalPages) {
            currentPage++;
            loadReviews();
        }
    });
    container.appendChild(nextItem);
}