document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const newsCards = document.querySelectorAll('.news-card');
    const prevButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');
    const pageButtons = document.querySelectorAll('.pagination button:not(:first-child):not(:last-child)');
    const searchInput = document.querySelector('input[type="text"]');
    const collegeFilter = document.querySelector('select:nth-of-type(1)');
    const sortSelect = document.querySelector('select:nth-of-type(2)');
  
    // State
    let currentPage = 1;
    let filteredCards = Array.from(newsCards);
    const cardsPerPage = 1; // 1 card per page
  
    // Initialize
    function initPagination() {
      updateDisplay();
  
      // Event listeners
      prevButton.addEventListener('click', goToPrevPage);
      nextButton.addEventListener('click', goToNextPage);
      pageButtons.forEach((button, index) => {
        button.addEventListener('click', () => goToPage(index + 1));
      });
  
      // Search functionality
      searchInput.addEventListener('input', filterCards);
  
      // College filter
      collegeFilter.addEventListener('change', filterCards);
  
      // Sort functionality
      sortSelect.addEventListener('change', sortCards);
    }
  
    // Filter and search cards
    function filterCards() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCollege = collegeFilter.value;
  
      filteredCards = Array.from(newsCards).filter(card => {
        const title = card.querySelector('.news-title').textContent.toLowerCase();
        const summary = card.querySelector('.news-summary').textContent.toLowerCase();
        const meta = card.querySelector('.news-meta span').textContent.toLowerCase();
        const matchesSearch = title.includes(searchTerm) || summary.includes(searchTerm);
        
        const collegeMatch = selectedCollege === 'All Colleges' || 
          meta.includes(selectedCollege.toLowerCase());
  
        return matchesSearch && collegeMatch;
      });
  
      sortCards();
    }
  
    // Sort cards
    function sortCards() {
      const sortOption = sortSelect.value;
  
      filteredCards.sort((a, b) => {
        const dateA = parseDate(a.querySelector('.news-meta span').textContent);
        const dateB = parseDate(b.querySelector('.news-meta span').textContent);
  
        if (sortOption.includes('Newest')) {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  
      currentPage = 1;
      updateDisplay();
    }
  
    // Helper function to parse dates from cards
    function parseDate(dateText) {
      const dateStr = dateText.split('•')[0].trim();
      return new Date(dateStr);
    }
  
    // Navigation
    function goToPage(page) {
      currentPage = page;
      updateDisplay();
    }
  
    function goToPrevPage() {
      if (currentPage > 1) goToPage(currentPage - 1);
    }
  
    function goToNextPage() {
      if (currentPage < getTotalPages()) goToPage(currentPage + 1);
    }
  
    // Calculate total pages based on filtered results
    function getTotalPages() {
      return Math.ceil(filteredCards.length / cardsPerPage);
    }
  
    // UI Updates
    function updateDisplay() {
      // Hide all cards first
      newsCards.forEach(card => {
        card.style.display = 'none';
      });
  
      // Calculate which cards to show
      const startIndex = (currentPage - 1) * cardsPerPage;
      const endIndex = Math.min(startIndex + cardsPerPage, filteredCards.length);
  
      // Display only the cards for current page
      for (let i = startIndex; i < endIndex; i++) {
        filteredCards[i].style.display = 'flex';
      }
  
      // Update pagination
      updatePaginationUI();
    }
  
    function updatePaginationUI() {
      const totalPages = getTotalPages();
      
      // Update Prev/Next states
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages || totalPages === 0;
  
      // Hide or show page buttons based on total pages
      pageButtons.forEach((button, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
          button.style.display = 'inline-block';
          const isActive = pageNum === currentPage;
          button.classList.toggle('btn-primary', isActive);
          button.classList.toggle('btn-outline-secondary', !isActive);
        } else {
          button.style.display = 'none';
        }
      });
  
      // Show a message if no results
      if (filteredCards.length === 0) {
        const newsContainer = document.querySelector('.news-list');
        const existingMessage = document.querySelector('.no-results-message');
        
        if (!existingMessage) {
          const message = document.createElement('div');
          message.className = 'no-results-message';
          message.style.width = '100%';
          message.style.padding = '20px';
          message.style.textAlign = 'center';
          message.style.backgroundColor = 'white';
          message.style.borderRadius = '16px';
          message.textContent = 'No news items match your search criteria.';
          newsContainer.appendChild(message);
        }
      } else {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
          existingMessage.remove();
        }
      }
    }
  
    initPagination();
  });