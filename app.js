const mockData = {
    "budgetLimits": {
        personal: 1000,
        professional: 1200,
        fuel: 500,
        groceries: 500
    }, 
    "expensesDetails": 
        [
            { title: "Electricity Bill", amount: "100 USD", date: "01-10-2023", category: "Personal Expenses", description: "Monthly electricity bill" },
            { title: "Office Supplies", amount: "150 USD", date: "05-10-2023", category: "Professional Expenses", description: "Fuel expenses" },
            { title: "Fuel for car", amount: "$60", date: "07-10-2023", category: "Fuel", description: "Regular car refueling" },
            { title: "Grocery Shopping", amount: "200 USD", date: "10-10-2023", category: "Groceries", description: "Weekly groceries for family" },
            { title: "Dinner with clients", amount: 90, date: "12-10-2023", category: "Professional Expenses", description: "Business dinner with clients" }
        ]
}

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
let budget = 10000; // Set your total budget here
let personal = mockData.budgetLimits.personal;
let professional = mockData.budgetLimits.professional;
let fuel = mockData.budgetLimits.fuel;
let groceries = mockData.budgetLimits.groceries;
let expenses = [];

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

function loadExpensesData() {
    if (expenses.length === 0) {
        setLoading(true); // Show loading indicator

        fetchMockApiData().then((data) => {
            expenses = data; // Populate the expenses array with the fetched data
            setLoading(false); // Hide loading indicator
            calculateTotals(); // Update totals
            renderExpenses(); // Render the expenses table
        });
    } else {
        calculateTotals(); // Directly calculate totals if expenses list is not empty
        renderExpenses(); // Render the expenses table
    }
}

function setLoading(loading) {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loading) {
        loadingIndicator.style.display = "block";
    } else {
        loadingIndicator.style.display = "none";
    }
}

function cleanAmount(amount) {
    // Remove any non-numeric characters (like $, USD, etc.)
    const cleanedAmount = amount.toString().replace(/[^0-9.]/g, "");
    return parseInt(cleanedAmount); // Convert to int
}


function fetchMockApiData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock data with string amounts
            const data = mockData.expensesDetails;
            // Clean the amounts before resolving
            const cleanedData = data.map(expense => ({
                ...expense,
                amount: cleanAmount(expense.amount) // Clean the amount
            }));
            resolve(cleanedData);
        }, 3000); // Simulate a 3-second API call
    });
}

// Function to display/hide loading indicator
function setLoading(loading) {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loading) {
        loadingIndicator.style.display = "block";
    } else {
        loadingIndicator.style.display = "none";
    }
}

function loadExpensesData() {
    if (expenses.length === 0) {
        setLoading(true); // Show loading indicator

        fetchMockApiData().then((data) => {
            expenses = data; // Populate the expenses array with the fetched data
            setLoading(false); // Hide loading indicator
            calculateTotals(); // Update totals
            renderExpenses(); // Render the expenses table
        });
    } else {
        calculateTotals(); // Directly calculate totals if expenses list is not empty
        renderExpenses(); // Render the expenses table
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadExpensesData(); // Load mock API data only if the expenses list is empty
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
    calculateTotals();
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

const budgetForm = document.getElementById("budget-form");

budgetForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const category = document.getElementById("budget-category").value;
    const newAmount = parseInt(document.getElementById("new-budget-amount").value);

    // Update the budget limit based on category
    if (category === "personal") {
        mockData.budgetLimits.personal = newAmount;
        document.getElementById("personal-budget").innerText = `$${newAmount}`;
    } else if (category === "professional") {
        mockData.budgetLimits.professional = newAmount;
        document.getElementById("professional-budget").innerText = `$${newAmount}`;
    } else if (category === "fuel") {
        mockData.budgetLimits.fuel = newAmount;
        document.getElementById("fuel-budget").innerText = `$${newAmount}`;
    } else if (category === "groceries") {
        mockData.budgetLimits.groceries = newAmount;
        document.getElementById("groceries-budget").innerText = `$${newAmount}`;
    }

    // Reset the form
    budgetForm.reset();
});

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
