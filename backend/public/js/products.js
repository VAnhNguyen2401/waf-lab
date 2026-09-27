async function loadProducts() {
  try {
    const response = await fetch("/api/products");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load products");
    }

    renderProducts(data.products);

  } catch (error) {
    console.error(error);

    const container =
      document.getElementById("products");

    if (container) {
      container.textContent =
        "Failed to load products.";
    }
  }
}

function renderProducts(products) {
  const container =
    document.getElementById("products");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.textContent =
      "No products found.";

    return;
  }

  products.forEach((product) => {
    const div =
      document.createElement("div");

    div.className = "product";

    const name =
      document.createElement("h3");

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

    const link =
      document.createElement("a");

    link.href =
      `/product-detail.html?id=${product.id}`;

    link.textContent =
      "View Product";

    div.append(
      name,
      brand,
      category,
      price,
      stock,
      link
    );

    container.appendChild(div);
  });
}

loadProducts();