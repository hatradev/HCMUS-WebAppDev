import fetchProducts from './fetchProducts.js';

function updatePagination(paginationData) {
    const paginationContainer = document.querySelector('.pagination');

    if (!paginationContainer) {
      return; // Exit if no container is found
    }

    if (!paginationData.pages || paginationData.pages.length === 0) {
        paginationContainer.style.display = 'none'; // Hide the container if no pages
        return;
    } else {
        paginationContainer.style.display = ''; // Remove 'display: none' to show the container
    }

    // if (!paginationContainer || !paginationData.pages || paginationData.pages.length === 0) {
    //     return; // Exit if no container or no pages
    // }

    // Clear existing pagination links
    paginationContainer.innerHTML = '';

    // Add 'Previous' link
    const prevItem = document.createElement('li');
    prevItem.className = 'page-item' + (paginationData.hasPreviousPage ? '' : ' disabled');
    prevItem.innerHTML = `<a class="page-link" href="#" data-page="${paginationData.previousPage}">Previous</a>`;
    paginationContainer.appendChild(prevItem);

    // Add page number links
    paginationData.pages.forEach(page => {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (page.isCurrent ? ' active' : '');
        pageItem.innerHTML = `<a class="page-link" href="#" data-page="${page.number}">${page.number}</a>`;
        paginationContainer.appendChild(pageItem);
    });

    // Add 'Next' link
    const nextItem = document.createElement('li');
    nextItem.className = 'page-item' + (paginationData.hasNextPage ? '' : ' disabled');
    nextItem.innerHTML = `<a class="page-link" href="#" data-page="${paginationData.nextPage}">Next</a>`;
    paginationContainer.appendChild(nextItem);

    // Re-setup event listeners for the new pagination links
    setupPaginationEventListeners();
}

// Assuming you have a function like this to handle pagination link clicks
function setupPaginationEventListeners() {
  document.querySelectorAll('.pagination a.page-link').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      if (!this.parentNode.classList.contains('disabled')) {
        currentState.page = this.dataset.page;
        fetchProducts();
      }
    });
  });
}

// function updatePagination(total, currentPage, totalPages) {
//     const paginationUl = document.querySelector('.pagination');
//     paginationUl.innerHTML = ''; // Clear existing pagination controls

//     // Function to create a page item
//     function createPageItem(page, isActive = false) {
//         const li = document.createElement('li');
//         li.className = `page-item ${isActive ? 'active' : ''}`;
//         const a = document.createElement('a');
//         a.className = 'page-link';
//         a.href = '#';
//         a.textContent = page;
//         a.addEventListener('click', (e) => {
//             e.preventDefault();
//             fetchProducts(page); // Assuming you have a fetchProducts function to load products
//         });
//         li.appendChild(a);
//         return li;
//     }

//     // Previous button
//     const prevLi = document.createElement('li');
//     prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
//     const prevLink = document.createElement('a');
//     prevLink.className = 'page-link';
//     prevLink.href = '#';
//     prevLink.textContent = 'Previous';
//     prevLink.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (currentPage > 1) fetchProducts(currentPage - 1);
//     });
//     prevLi.appendChild(prevLink);
//     paginationUl.appendChild(prevLi);

//     // Page numbers
//     for (let page = 1; page <= totalPages; page++) {
//         const pageLi = createPageItem(page, page === currentPage);
//         paginationUl.appendChild(pageLi);
//     }

//     // Next button
//     const nextLi = document.createElement('li');
//     nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
//     const nextLink = document.createElement('a');
//     nextLink.className = 'page-link';
//     nextLink.href = '#';
//     nextLink.textContent = 'Next';
//     nextLink.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (currentPage < totalPages) fetchProducts(currentPage + 1);
//     });
//     nextLi.appendChild(nextLink);
//     paginationUl.appendChild(nextLi);
// }

export default updatePagination;