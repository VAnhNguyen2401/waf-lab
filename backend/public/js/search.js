const searchForm =
  document.getElementById("searchForm");

const resetSearch =
  document.getElementById("resetSearch");

const searchStatus =
  document.getElementById("searchStatus");


if (searchForm) {
  searchForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const input =
        document.getElementById("searchInput");

      const keyword =
        input.value.trim();

      try {
        const response =
          await fetch(
            `/api/search?q=${encodeURIComponent(keyword)}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Search failed"
          );
        }

        renderProducts(data.products);

        if (searchStatus) {
          /*
           * INTENTIONALLY VULNERABLE
           * Reflected XSS lab.
           */
          searchStatus.innerHTML =
            `Search results for: ${data.keyword} (${data.count})`;
        }

      } catch (error) {
        console.error(error);

        if (searchStatus) {
          searchStatus.textContent =
            "Search failed.";
        }
      }
    }
  );
}


if (resetSearch) {
  resetSearch.addEventListener(
    "click",
    () => {

      document
        .getElementById("searchInput")
        .value = "";

      if (searchStatus) {
        searchStatus.textContent = "";
      }

      loadProducts();
    }
  );
}