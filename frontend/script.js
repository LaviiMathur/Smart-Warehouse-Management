const populateProductTable = () => {
  fetch("/store/products")
    .then((response) => response.json())
    .then((products) => {
      const tableBody = document.getElementById("productTableBody");
      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td class="py-2 px-4 border">${product.name}</td>
                        <td class="py-2 px-4 border">${product.currentStock}</td>
                        <td class="py-2 px-4 border">${product.dailySales}</td>
                        <td class="py-2 px-4 border">${product.leadTime}</td>
                        <td class="py-2 px-4 border">${product.minReorderQty}</td>
                        <td class="py-2 px-4 border">₹${product.costPerUnit}</td>
                    `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      const tableBody = document.getElementById("productTableBody");
      tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="py-2 px-4 border text-center text-red-500">
                            Error loading products: ${error.message}
                        </td>
                    </tr>
                `;
    });
};
populateProductTable();

const form = document.getElementById("addProductForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  fetch("/store/addProducts", {
    method: "POST",
    body: new URLSearchParams(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      const product = data.product;
      const tableBody = document.getElementById("productTableBody");
      const row = document.createElement("tr");
      row.innerHTML = `
  <td class="py-2 px-4 border">${product.name}</td>
  <td class="py-2 px-4 border">${product.currentStock}</td>
  <td class="py-2 px-4 border">${product.dailySales}</td>
  <td class="py-2 px-4 border">${product.leadTime}</td>
  <td class="py-2 px-4 border">${product.minReorderQty}</td>
  <td class="py-2 px-4 border">₹${product.costPerUnit}</td>
`;
      tableBody.appendChild(row);

      e.target.reset();
    })
    .catch((err) => console.error("Error adding product:", err));
});
const btnProduct = document.getElementById("btnAddProduct");
const btnSimulate = document.getElementById("btnSimulateSpike");
const btnReport = document.getElementById("btnReport");

const addProductContainer = document.getElementById("formContainer");
const simulateSpikeContainer = document.getElementById(
  "simulateSpikeContainer"
);
const reportContainer = document.getElementById("reportContainer");

// Toggle Add Product form
btnProduct.addEventListener("click", () => {
  const isHidden = addProductContainer.classList.toggle("hidden");
  btnProduct.textContent = isHidden ? "Add Product" : "Hide Form";
  // Hide other sections
  simulateSpikeContainer.classList.add("hidden");
  reportContainer.classList.add("hidden");
});

// Toggle Report
btnReport.addEventListener("click", () => {
  const isHidden = reportContainer.classList.toggle("hidden");
  btnReport.textContent = isHidden ? "Reorder Report" : "Hide Report";

  // Hide other sections
  addProductContainer.classList.add("hidden");
  simulateSpikeContainer.classList.add("hidden");
  fetchReport();
});

// Toggle Simulate Spike form
btnSimulate.addEventListener("click", () => {
  const isHidden = simulateSpikeContainer.classList.toggle("hidden");
  btnSimulate.textContent = isHidden ? "Simulate Spike" : "Hide Spike";

  // Hide other sections
  addProductContainer.classList.add("hidden");
  reportContainer.classList.add("hidden");

  populateSpikeDropdown();
});

//  Spike Dropdown
const populateSpikeDropdown = () => {
  fetch("/store/products")
    .then((res) => res.json())
    .then((products) => {
      const select = document.getElementById("spikeProductSelect");
      select.innerHTML = "";
      products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("Error fetching products:", err));
};
// Simulate Spike Form
document.getElementById("simulateSpikeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const productId = formData.get("productId");
  const spikeDays = formData.get("spikeDays");
  const multiplier = formData.get("multiplier");

  fetch(`/store/simulate`, {
    method: "POST",
    body: new URLSearchParams({ multiplier, productId, spikeDays }),
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("spikeReportBody");
      tbody.innerHTML = ""; // clear old results

      const row = document.createElement("tr");
      row.innerHTML = `
          <td class="py-2 px-4 border">${data.productName}</td>
          <td class="py-2 px-4 border">${data.originalCurrentStock}</td>
          <td class="py-2 px-4 border">${data.originalDailySales}</td>
          <td class="py-2 px-4 border">${data.spikeMultiplier}</td>
          <td class="py-2 px-4 border">${data.spikeDays}</td>
          <td class="py-2 px-4 border">${data.newDailySales}</td>
          <td class="py-2 px-4 border">${data.newCurrentStock}</td>
        `;
      tbody.appendChild(row);

      document
        .getElementById("spikeReportContainer")
        .classList.remove("hidden");
    })
    .catch((err) => console.error("Error simulating spike:", err));
});

// Fetch render Report
const fetchReport = () => {
  fetch("/store/report")
    .then((res) => res.json())
    .then((report) => {
      const tableBody = document.getElementById("reportTableBody");
      tableBody.innerHTML = "";

      report.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="py-2 px-4 border">${item.productName}</td>
          <td class="py-2 px-4 border">${item.currentStock}</td>
          <td class="py-2 px-4 border">${item.dayRemaining || "-"}</td>
          <td class="py-2 px-4 border">${item.reorderQty || "-"}</td>
          <td class="py-2 px-4 border">₹${item.reorderCost || "-"}</td>
          <td class="py-2 px-4 border">${item.message || "-"}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => console.error("Error fetching report:", err));
};
