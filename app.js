const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");
let budgetChart;
let editIndex = null;

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
    { title: "Groceries", amount: 150, date: new Date(), category: "Groceries", description: "Grocery shopping" },
    { title: "Fuel", amount: 50, date: new Date(),category: "Fuel", description: "Fuel expenses" },
    { title: "Utilities", amount: 100, date: new Date(), category: "Personal Expenses", description: "Electricity, water, internet" },
    { title: "Utilities", amount: 100, date: new Date(), category: "Professional Expenses", description: "Electricity, water, internet" }
];

// Function to calculate totals
function calculateTotals() {
    // Calculate total expenses

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    // Calculate total left
    const totalLeft = budget - totalExpenses;
    console.log(document.getElementById("budget-amount"));
    // Update the dashboard cards
    document.getElementById("budget-amount").innerText = `$${budget}`;
    document.getElementById("expenses-amount").innerText = `$${totalExpenses}`;
    document.getElementById("left-amount").innerText = `$${totalLeft}`;

    // Calculate budget usage by category
    const categoryUsage = {};
    console.log(expenses)
    expenses.forEach(expense => {
        if (!categoryUsage[expense.category]) {
            categoryUsage[expense.category] = 0;
        }
        categoryUsage[expense.category] += expense.amount;
    });

    // Create chart for budget usage (you can use Chart.js or similar)
    const ctx = document.getElementById('budget-chart').getContext('2d');
    if (budgetChart) {
        budgetChart.destroy();
    }

    // Create the chart
    budgetChart = new Chart(ctx, {
        type: 'pie', // or 'bar', 'line', etc.
        data: {
            labels: Object.keys(categoryUsage),
            datasets: [{
                label: 'Budget Usage by Category',
                data: Object.values(categoryUsage),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Customize colors as needed
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
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
    renderExpenses();
});

const expenseForm = document.getElementById("expense-form");
const expensesBody = document.getElementById("expenses-body");
const searchInput = document.getElementById("search-input");
const sortOption = document.getElementById("sort-options");

// Function to render expenses in the table
function renderExpenses(filterText = "") {
    expensesBody.innerHTML = "";
    console.log("Adding to table")
    console.log(filterText); // Clear existing rows

    // Filter expenses based on search text
    const filteredExpenses = expenses.filter(expense => 
        String(expense.title).toLowerCase().includes(String(filterText).toLowerCase()) || 
        String(expense.description).toLowerCase().includes(String(filterText).toLowerCase())
    );

    const sortOption = document.getElementById('sort-options').value;

    var sortedExpenses = [...filteredExpenses];

    if (sortOption === 'asc') {
        sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'desc') {
        sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Add each expense to the table
    sortedExpenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.title}</td>
            <td>$${expense.amount}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td><button onclick="editExpense(${index})" >Edit</button></td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expensesBody.appendChild(row);
    });
}

// Event listener for the expense form submission
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get values from the form
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
        description
    };

    // Add expense to the array and re-render
    if (editIndex === null) {
        // Add new expense
        expenses.push(expense);
    } else {
        // Update existing expense
        expenses[editIndex] = expense;
        editIndex = null; // Reset edit index
        document.getElementById('submit-btn').textContent = "Add Expense"; // Reset button text
    }
    calculateTotals();
    renderExpenses();

    // Clear the form
    expenseForm.reset();
});

// Event listener for search input
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value;
    renderExpenses(searchText);
});

sortOption.addEventListener("change", () => {
    renderExpenses();
})

function deleteExpense(index) {
    expenses.splice(index, 1); // Remove the expense from the array
    renderExpenses(); // Re-render the table
}

// Function to edit an expense
function editExpense(index) {
    const expense = expenses[index];
    
    // Populate form with expense data
    document.getElementById('title').value = expense.title;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('date').value = expense.date;
    document.getElementById('category').value = expense.category;
    document.getElementById('description').value = expense.description;

    editIndex = index; // Set the edit index
    document.getElementById('submit-btn').textContent = "Save Changes"; // Change button text
}

function showSection(givenSection) {
  if (givenSection === "dashboard") {
    document.getElementById("expenses").style.display = "none";

    document.getElementById("budget").style.display = "none";

    document.getElementById("dashboard").style.display = "block";
  } else if (givenSection === "expenses") {
    document.getElementById("dashboard").style.display = "none";

    document.getElementById("budget").style.display = "none";

    document.getElementById("expenses").style.display = "block";
  } else {
    document.getElementById("dashboard").style.display = "none";

    document.getElementById("budget").style.display = "block";
    document.getElementById("expenses").style.display = "none";
  }
}
