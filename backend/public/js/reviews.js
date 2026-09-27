const params =
  new URLSearchParams(
    window.location.search
  );

const productId =
  params.get("id");


async function loadProductDetail() {
  const container =
    document.getElementById(
      "productDetail"
    );

  if (!productId) {
    container.textContent =
      "Missing product ID.";

    return;
  }

  try {
    const response =
      await fetch(
        `/api/products/${encodeURIComponent(productId)}`
      );

    const product =
      await response.json();

    if (!response.ok) {
      container.textContent =
        product.error || "Product not found";

      return;
    }

    container.innerHTML = "";

    const name =
      document.createElement("h2");

    name.textContent =
      product.name;

    const brand =
      document.createElement("p");

    brand.textContent =
      `Brand: ${product.brand}`;

    const category =
      document.createElement("p");

    category.textContent =
      `Category: ${product.category}`;

    const price =
      document.createElement("p");

    price.textContent =
      `Price: $${product.price}`;

    const stock =
      document.createElement("p");

    stock.textContent =
      `Stock: ${product.stock}`;

    const description =
      document.createElement("p");

    description.textContent =
      `Description: ${product.description}`;

    container.append(
      name,
      brand,
      category,
      price,
      stock,
      description
    );

  } catch (error) {
    console.error(error);

    container.textContent =
      "Failed to load product.";
  }
}


async function loadReviews() {
  const container =
    document.getElementById("reviews");

  try {
    const response =
      await fetch(
        `/api/products/${encodeURIComponent(productId)}/reviews`
      );

    const data =
      await response.json();

    if (!response.ok) {
      container.textContent =
        data.error || "Failed to load reviews";

      return;
    }

    container.innerHTML = "";

    if (data.reviews.length === 0) {
      container.textContent =
        "No reviews yet.";

      return;
    }

    data.reviews.forEach((review) => {

      const div =
        document.createElement("div");

      div.className = "review";

      const username =
        document.createElement("strong");

      /*
       * Username vẫn render an toàn.
       */
      username.textContent =
        review.username;

      const content =
        document.createElement("p");

      /*
       * INTENTIONALLY VULNERABLE
       * Stored XSS research lab.
       *
       * review.content được lấy từ database
       * và render trực tiếp dưới dạng HTML.
       */
      content.innerHTML =
        review.content;

      const date =
        document.createElement("small");

      date.textContent =
        new Date(
          review.created_at
        ).toLocaleString();

      div.append(
        username,
        content,
        date
      );

      container.appendChild(div);
    });

  } catch (error) {
    console.error(error);

    container.textContent =
      "Failed to load reviews.";
  }
}


const reviewForm =
  document.getElementById("reviewForm");

if (reviewForm) {
  reviewForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const username =
        document
          .getElementById("reviewUsername")
          .value
          .trim();

      const content =
        document
          .getElementById("reviewContent")
          .value
          .trim();

      const message =
        document.getElementById(
          "reviewMessage"
        );

      try {
        const response =
          await fetch(
            `/api/products/${encodeURIComponent(productId)}/reviews`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username,
                content,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          message.textContent =
            data.error ||
            "Failed to submit review";

          message.className =
            "error";

          return;
        }

        message.textContent =
          "Review submitted successfully.";

        message.className =
          "success";

        reviewForm.reset();

        /*
         * Sau khi submit, load lại review.
         * Nếu content chứa HTML nguy hiểm và
         * backend đã lưu nguyên nội dung,
         * nó sẽ quay lại qua loadReviews().
         */
        await loadReviews();

      } catch (error) {
        console.error(error);

        message.textContent =
          "Review request failed.";

        message.className =
          "error";
      }
    }
  );
}


loadProductDetail();
loadReviews();