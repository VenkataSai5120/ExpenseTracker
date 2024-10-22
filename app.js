const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

modeSwitch.addEventListener("click" , () =>{
    body.classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        modeText.innerText = "Light mode";
    }else{
        modeText.innerText = "Dark mode";
        
    }
});

// Example data (you can replace this with your localStorage retrieval)
let budget = 1000; // Set your total budget here
let expenses = [
    { title: "Groceries", amount: 150, category: "Groceries" },
    { title: "Fuel", amount: 50, category: "Fuel" },
    { title: "Utilities", amount: 100, category: "Personal Expenses" }
];

// Function to calculate totals
function calculateTotals() {
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    // Calculate total left
    const totalLeft = budget - totalExpenses;

    // Update the dashboard cards
    document.getElementById("budget-amount").innerText = `$${budget}`;
    document.getElementById("expenses-amount").innerText = `$${totalExpenses}`;
    document.getElementById("left-amount").innerText = `$${totalLeft}`;

    // Calculate budget usage by category
    const categoryUsage = {};
    expenses.forEach(expense => {
        if (!categoryUsage[expense.category]) {
            categoryUsage[expense.category] = 0;
        }
        categoryUsage[expense.category] += expense.amount;
    });

    // Create chart for budget usage (you can use Chart.js or similar)
    const ctx = document.getElementById('budget-chart').getContext('2d');
    const chartData = {
        labels: Object.keys(categoryUsage),
        datasets: [{
            label: 'Budget Usage by Category',
            data: Object.values(categoryUsage),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Customize colors as needed
            borderColor: '#fff',
            borderWidth: 1
        }]
    };

    // Create chart using Chart.js (make sure to include Chart.js library)
    new Chart(ctx, {
        type: 'pie', // or 'bar', 'line', etc.
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true,
                }
            }
        }
    });
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    calculateTotals();
});

// Existing code...

const expenseForm = document.getElementById("expense-form");
const expensesTableBody = document.getElementById("expenses-table").querySelector("tbody");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// Function to add expense
function addExpense(expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${expense.title}</td>
        <td>$${expense.amount.toFixed(2)}</td>
        <td>${new Date(expense.date).toLocaleDateString()}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
    `;
    expensesTableBody.appendChild(row);
}

// Event listener for form submission
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission

    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    // Create expense object
    const expense = {
        title,
        amount,
        date,
        category,
        description,
    };

    // Add expense to the table
    addExpense(expense);

    // Reset the form
    expenseForm.reset();
    calculateTotals(); // Recalculate totals after adding expense
});

// Search functionality
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = expensesTableBody.querySelectorAll("tr");

    rows.forEach(row => {
        const title = row.children[0].textContent.toLowerCase();
        const description = row.children[4].textContent.toLowerCase();
        row.style.display = (title.includes(searchTerm) || description.includes(searchTerm)) ? "" : "none";
    });
});

// Sort functionality
sortSelect.addEventListener("change", () => {
    const rows = Array.from(expensesTableBody.querySelectorAll("tr"));
    const isAscending = sortSelect.value === "asc";

    rows.sort((a, b) => {
        const dateA = new Date(a.children[2].textContent);
        const dateB = new Date(b.children[2].textContent);
        return isAscending ? dateA - dateB : dateB - dateA;
    });

    // Clear table and append sorted rows
    expensesTableBody.innerHTML = "";
    rows.forEach(row => expensesTableBody.appendChild(row));
});
