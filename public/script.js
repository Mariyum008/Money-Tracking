 // Array to hold expense and income records
 let expenses = [];
 let totalAmount = 0;

 // Get DOM elements
 const categorySelect = document.getElementById("category_select");
 const amountInput = document.getElementById("amount_input");
 const infoInput = document.getElementById("info");
 const dateInput = document.getElementById("date_input");
 const addBtn = document.getElementById("add_btn");
 const expenseTableBody = document.getElementById("expense-table-body");
 const totalAmountCell = document.getElementById("total-amount");

 // Utility function to display an error message
 const showError = (message) => {
     alert(message);
 };

 // Utility function to update the total amount and render the table
 const updateUI = () => {
     totalAmountCell.textContent = totalAmount.toFixed(2);

     // Clear the existing rows
     expenseTableBody.innerHTML = '';

     // Render all expenses
     expenses.forEach(expense => {
         const newRow = expenseTableBody.insertRow();

         const categoryCell = newRow.insertCell();
         const amountCell = newRow.insertCell();
         const infoCell = newRow.insertCell();
         const dateCell = newRow.insertCell();
         const deleteCell = newRow.insertCell();

         categoryCell.textContent = expense.category;
         amountCell.textContent = expense.amount.toFixed(2);
         infoCell.textContent = expense.info;
         dateCell.textContent = expense.date;

         const deleteBtn = document.createElement('button');
         deleteBtn.textContent = 'Delete';
         deleteBtn.classList.add('delete-btn');
         deleteBtn.addEventListener('click', () => {
             // Remove expense from array
             expenses = expenses.filter(e => e !== expense);
             if (expense.category === 'Income') {
                 totalAmount -= expense.amount;
             } else if (expense.category === 'Expense') {
                 totalAmount += expense.amount;
             }
             updateUI(); // Update the UI after deletion
         });

         deleteCell.appendChild(deleteBtn);
     });
 };

 // Utility function to send data to the server
 const saveExpenseToServer = async (expense) => {
     try {
         const response = await fetch("/add", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(expense)
         });

         if (!response.ok) {
             throw new Error("Failed to save the expense");
         }

         const responseData = await response.text();
         console.log(responseData); // "Record Inserted Successfully"
     } catch (error) {
         console.error("Error:", error);
         showError("Failed to save the expense to the server. Please try again.");
     }
 };

 // Add expense or income on button click
 addBtn.addEventListener('click', async (event) => {
     event.preventDefault(); // Prevent form from submitting the traditional way

     const category = categorySelect.value;
     const info = infoInput.value.trim();
     const amount = parseFloat(amountInput.value);
     const date = dateInput.value;

     // Validate inputs
     if (!category) {
         showError('Please select a category');
         return;
     }
     if (isNaN(amount) || amount <= 0) {
         showError('Please enter a valid amount');
         return;
     }
     if (!info) {
         showError('Please enter info');
         return;
     }
     if (!date) {
         showError('Please select a date');
         return;
     }

     // Add new expense to the array
     const newExpense = { category, amount, info, date };
     expenses.push(newExpense);

     // Save expense to the server
     await saveExpenseToServer(newExpense);

     // Update total amount
     if (category === 'Income') {
         totalAmount += amount;
     } else if (category === 'Expense') {
         totalAmount -= amount;
     }

     // Update the UI
     updateUI();

     // Reset form fields
     categorySelect.value = '';
     amountInput.value = '';
     infoInput.value = '';
     dateInput.value = '';
 });
