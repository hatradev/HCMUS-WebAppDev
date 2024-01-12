function updatePagination(total, currentPage, totalPages) {
    const paginationUl = document.querySelector('.pagination');
    paginationUl.innerHTML = ''; // Clear existing pagination controls

    // Function to create a page item
    function createPageItem(page, isActive = false) {
        const li = document.createElement('li');
        li.className = `page-item ${isActive ? 'active' : ''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = page;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            fetchProducts(page); // Assuming you have a fetchProducts function to load products
        });
        li.appendChild(a);
        return li;
    }

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = 'Previous';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) fetchProducts(currentPage - 1);
    });
    prevLi.appendChild(prevLink);
    paginationUl.appendChild(prevLi);

    // Page numbers
    for (let page = 1; page <= totalPages; page++) {
        const pageLi = createPageItem(page, page === currentPage);
        paginationUl.appendChild(pageLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = 'Next';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) fetchProducts(currentPage + 1);
    });
    nextLi.appendChild(nextLink);
    paginationUl.appendChild(nextLi);
}

export default updatePagination;