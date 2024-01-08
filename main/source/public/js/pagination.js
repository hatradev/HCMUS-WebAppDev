const pagination = document.querySelector(".pagination");
if (numberOfItems === 0) pagination.classList.add("d-none");
else {
  const numPages = Math.ceil(numberOfItems / limit);
  const initPagination = () => {
    pagination.innerHTML = `<li class='pagination-item col-2 text-center'>
      <a class='pagination-link' href='#' aria-label='Previous all'>
        <i class='fa-regular fa-chevrons-left'></i>
      </a>
    </li>
    <li class='pagination-item col text-center'>
      <a class='pagination-link' href='#' aria-label='Previous'>
        <i class='fa-regular fa-chevron-left'></i>
      </a>
    </li>`;
    for (
      let i = leftMost;
      i < Math.min(leftMost + Math.min(numPages, 3), numPages + 1);
      i++
    ) {
      pagination.insertAdjacentHTML(
        "beforeend",
        `<li class="pagination-item col text-center">
          <a class="pagination-link" href="#">
            ${i}
          </a>
        </li>`
      );
    }
    pagination.insertAdjacentHTML(
      "beforeend",
      `<li class='pagination-item col text-center'>
        <a class='pagination-link' href='#' aria-label='Next'>
          <i class='fa-regular fa-chevron-right'></i>
        </a>
      </li>
      <li class='pagination-item col-2 text-center'>
        <a class='pagination-link' href='#' aria-label='Next all'>
          <i class='fa-regular fa-chevrons-right'></i>
        </a>
      </li>`
    );
  };
  initPagination();
  const paginationLinks = document.querySelectorAll(".pagination-link");
  const paginationDesc = document.querySelector(".pagination-description");

  const disableCurrentPage = () => {
    paginationLinks[currentPage - leftMost + 2].classList.remove(
      "pagination-active"
    );
  };

  const updateDescription = () => {
    paginationDesc.textContent = `${(currentPage - 1) * limit + 1} - ${Math.min(
      currentPage * limit,
      numberOfItems
    )} of ${numberOfItems} items`;
  };

  const updatePages = () => {
    for (let i = 2; i < paginationLinks.length - 2; i++) {
      paginationLinks[i].textContent = `${leftMost + i - 2}`;
    }
  };

  const moveToPage = (page) => {
    disableCurrentPage();
    if (page < leftMost) {
      leftMost = page;
      updatePages();
    } else if (page > leftMost + 2) {
      leftMost = page - 2;
      updatePages();
    }
    currentPage = page;
    paginationLinks[page - leftMost + 2].classList.add("pagination-active");
    updateDescription();
  };

  paginationLinks[2 + currentPage - leftMost].classList.add(
    "pagination-active"
  );
  updateDescription();
  paginationLinks.forEach((paginationLink, idx) => {
    paginationLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (idx === 0) {
        moveToPage(1);
      } else if (idx === 1) {
        moveToPage(Math.max(1, currentPage - 1));
      } else if (idx === paginationLinks.length - 1) {
        moveToPage(numPages);
      } else if (idx === paginationLinks.length - 2) {
        moveToPage(Math.min(currentPage + 1, numPages));
      } else {
        moveToPage(Number(this.textContent));
      }
      // Xử lí tạo đường dẫn mới chỉ thay ?page=currentPage
      let newUrl = window.location.href;
      newUrl = newUrl.split("page=");
      if (newUrl[1]) {
        newUrl[1] = newUrl[1].slice(String(numPages).length);
        newUrl = newUrl[0] + `page=${currentPage}` + newUrl[1];
      } else {
        if (newUrl[0]?.includes("?") || newUrl[1]?.includes("?")) {
          newUrl =
            newUrl[0] + `&page=${currentPage}` + (newUrl[1] ? newUrl[1] : "");
        } else newUrl = newUrl[0] + `?page=${currentPage}`;
      }
      fetch(newUrl, {
        method: "GET",
        redirect: "follow",
      })
        .then((res) => {
          window.location.href = res.url;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}
