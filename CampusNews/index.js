document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://569f349a-c435-4938-8611-4e95a25163bb-00-2c4h5lj6mxr6l.pike.replit.dev/project333/api/news" 
  const newsList = document.querySelector(".news-list")
  const searchInput = document.querySelector('input[type="text"]')
  const collegeFilter = document.querySelector(".form-select:nth-of-type(1)")
  const sortFilter = document.querySelector(".form-select:nth-of-type(2)")
  const paginationButtons = document.querySelector(".pagination")
  const loadingIndicator = document.createElement("div")
  loadingIndicator.textContent = "Loading..."
  loadingIndicator.style.textAlign = "center"

  let newsData = []
  let currentPage = 1
  const itemsPerPage = 3

  async function fetchNews() {
    newsList.innerHTML = ""
    newsList.appendChild(loadingIndicator)

    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch news data")
      const data = await response.json()
      newsData = data
      renderNews()
    } catch (error) {
      newsList.innerHTML = `<p style="color: red; text-align: center;">Error: ${error.message}</p>`
    }
  }

  function renderNews() {
    newsList.innerHTML = ""
    const filteredNews = applyFilters()
    const paginatedNews = paginate(filteredNews)

    if (paginatedNews.length === 0) {
      newsList.innerHTML = "<p style='text-align: center;'>No news found.</p>"
      return
    }

    paginatedNews.forEach((news) => {
      const newsCard = document.createElement("div")
      newsCard.className = "news-card active"
      newsCard.innerHTML = `
        <img src="${news.image || 'https://via.placeholder.com/200'}" alt="News">
        <div class="news-content">
          <div class="news-title">${news.title}</div>
          <div class="news-summary">${news.summary}</div>
          <div class="news-meta">
            <span>${news.date} • ${news.college}</span>
            <a href="read-more.html?id=${news.id}">Read More</a>
          </div>
        </div>
      `
      newsList.appendChild(newsCard)
    })

    renderPagination(filteredNews.length)
  }

  function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase()
    const selectedCollege = collegeFilter.value
    const sortOption = sortFilter.value

    let filtered = newsData.filter((news) =>
      news.title.toLowerCase().includes(searchQuery) &&
      (selectedCollege === "All Colleges" || news.college === selectedCollege)
    )

    if (sortOption === "Oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return filtered
  }

  function paginate(data) {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }

  function renderPagination(totalItems) {
    paginationButtons.innerHTML = ""
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const prevButton = document.createElement("button")
    prevButton.className = "btn btn-outline-secondary"
    prevButton.textContent = "« Prev"
    prevButton.disabled = currentPage === 1
    prevButton.addEventListener("click", () => {
      currentPage--
      renderNews()
    })
    paginationButtons.appendChild(prevButton)

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button")
      pageButton.className = "btn btn-outline-secondary"
      pageButton.textContent = i
      if (i === currentPage) pageButton.classList.add("active")
      pageButton.addEventListener("click", () => {
        currentPage = i
        renderNews()
      })
      paginationButtons.appendChild(pageButton)
    }

    const nextButton = document.createElement("button")
    nextButton.className = "btn btn-outline-secondary"
    nextButton.textContent = "Next »"
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => {
      currentPage++
      renderNews()
    })
    paginationButtons.appendChild(nextButton)
  }

  searchInput.addEventListener("input", renderNews)
  collegeFilter.addEventListener("change", renderNews)
  sortFilter.addEventListener("change", renderNews)

  fetchNews()
})
