const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const PORT = 8000;

// Define Mongoose Schema and Model
const expenseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    info: { type: String, required: true },
    date: { type: Date, required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Async function to connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/MoneyList', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database");
    } catch (err) {
        console.error("Error in connecting to the Database", err);
    }
}

// Call the async function to connect to MongoDB
connectDB();

// POST endpoint to add expense
app.post("/add", async (req, res) => {
    const { category_select, amount_input, info, date_input } = req.body;

    // Create a new expense
    const expense = new Expense({
        category: category_select,
        amount: parseFloat(amount_input),
        info: info,
        date: new Date(date_input)
    });

    try {
        await expense.save();
        console.log("Record Inserted Successfully");
        res.status(200).send("Record Inserted Successfully");
    } catch (err) {
        console.error("Error inserting record", err);
        res.status(500).send("Error inserting record");
    }
});

// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
