import initFetchProducts from './initFetchProducts.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('#header-search-form');
  
    searchForm.addEventListener('submit', function(event) {
      // If you want to prevent the default form submission uncomment the next line
      event.preventDefault();
  
      const searchInput = searchForm.querySelector('input[name="q"]');
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        // console.log("Search for:", searchTerm);
        window.location.href = '/product?keyword=' + encodeURIComponent(searchTerm);
      } else {
        // console.log("Please enter a search term.");
        // // Handle the case where the search term is empty
      }
    });
  });
  