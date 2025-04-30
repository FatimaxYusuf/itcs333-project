document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.querySelector(".news-list");
  const searchInput = document.querySelector('input[type="text"]');
  const collegeFilter = document.querySelector(".form-select:nth-of-type(1)");
  const sortFilter = document.querySelector(".form-select:nth-of-type(2)");
  const paginationButtons = document.querySelector(".pagination");
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading...";
  loadingIndicator.style.textAlign = "center";

  let newsData = [];
  let currentPage = 1;
  const itemsPerPage = 3;

  // List of colleges
  const colleges = [
    "College of Engineering",
    "College of Arts",
    "College of Information Technology",
    "College of Business Administration",
    "College of Health & Sports Sciences",
    "Deanship of Admission & Registration",
    "Library",
  ];

  // Generate random dates within the past year
  function generateRandomDate() {
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() - 1);
    const randomDate = new Date(start.getTime() - Math.random() * (start.getTime() - end.getTime()));
    return randomDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  // Fetch data from a mock API
  async function fetchNews() {
    newsList.innerHTML = "";
    newsList.appendChild(loadingIndicator);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Failed to fetch news data");
      const data = await response.json();

      // Simulate news data structure with random colleges and dates
      newsData = data.slice(0, 15).map((item, index) => ({
        id: item.id,
        title: `News Title ${index + 1}`,
        summary: item.body,
        date: generateRandomDate(),
        college: colleges[Math.floor(Math.random() * colleges.length)],
      }));

      renderNews();
    } catch (error) {
      newsList.innerHTML = `<p style="color: red; text-align: center;">Error: ${error.message}</p>`;
    }
  }

  // Render news items dynamically
  function renderNews() {
    newsList.innerHTML = "";

    const filteredNews = applyFilters();
    const paginatedNews = paginate(filteredNews);

    if (paginatedNews.length === 0) {
      newsList.innerHTML = "<p style='text-align: center;'>No news found.</p>";
      return;
    }

    paginatedNews.forEach((news) => {
      const newsCard = document.createElement("div");
      newsCard.className = "news-card active";
      newsCard.innerHTML = `
        <img src="https://via.placeholder.com/200" alt="News">
        <div class="news-content">
          <div class="news-title">${news.title}</div>
          <div class="news-summary">${news.summary}</div>
          <div class="news-meta">
            <span>${news.date} • ${news.college}</span>
            <a href="readmore.html">Read More</a>
          </div>
        </div>
      `;
      newsList.appendChild(newsCard);
    });

    renderPagination(filteredNews.length);
  }

  // Apply search and filter
  function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedCollege = collegeFilter.value;
    const sortOption = sortFilter.value;

    let filtered = newsData.filter((news) =>
      news.title.toLowerCase().includes(searchQuery) &&
      (selectedCollege === "All Colleges" || news.college === selectedCollege)
    );

    if (sortOption === "Oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered;
  }

  // Paginate news items
  function paginate(data) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }

  // Render pagination buttons
  function renderPagination(totalItems) {
    paginationButtons.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevButton = document.createElement("button");
    prevButton.className = "btn btn-outline-secondary";
    prevButton.textContent = "« Prev";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      currentPage--;
      renderNews();
    });
    paginationButtons.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.className = "btn btn-outline-secondary";
      pageButton.textContent = i;
      if (i === currentPage) pageButton.classList.add("active");
      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderNews();
      });
      paginationButtons.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.className = "btn btn-outline-secondary";
    nextButton.textContent = "Next »";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      currentPage++;
      renderNews();
    });
    paginationButtons.appendChild(nextButton);
  }

  // Event listeners
  searchInput.addEventListener("input", renderNews);
  collegeFilter.addEventListener("change", renderNews);
  sortFilter.addEventListener("change", renderNews);

  // Fetch news on page load
  fetchNews();
});