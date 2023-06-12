//Import necessary modules
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Create an instance of the express application
const app = express();

// Set the view engine to EJS
app.set('views', './templates');

// Load the data from the JSON file using command line argument
const jsonFile = process.argv[2];
const jsonData = fs.readFileSync(jsonFile);
const items = JSON.parse(jsonData).itemsList;

app.get('/', (req, res) => {
  // Render index page
  ejs.renderFile('./templates/index.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

app.get('/catalog', (req, res) => {
  // Read items list from JSON file
  const jsonData = fs.readFileSync(jsonFile);
  const items = JSON.parse(jsonData).itemsList;

  // Render catalog page with items list
  ejs.renderFile('./templates/displayItems.ejs', { itemsList: items }, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

app.get('/order', (req, res) => {
  // Read items list from JSON file
  fs.readFile('./itemsList.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const items = JSON.parse(data);
    // Render order page with items list
    ejs.renderFile('./templates/placeOrder.ejs', { items }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });
  });
});

// Define a route to process the submission of the place order form
app.post('/order', bodyParser.urlencoded({ extended: true }), (req, res) => {
const orderItems = Object.keys(req.body).filter(item => req.body[item] !== "");
const order = items.filter(item => orderItems.includes(item.itemCode)).map(item => {
return {
itemName: item.itemName,
quantity: req.body[item.itemCode],
itemPrice: item.itemPrice,
totalPrice: item.itemPrice * req.body[item.itemCode]
}
});
const orderTotal = order.reduce((total, item) => total + item.totalPrice, 0);
res.render('orderConfirmation', { pageTitle: 'Order Confirmation', order, orderTotal });
});







// Start the server on port 5000
const server = app.listen(5000, () => {
console.log('Server started at http://localhost:5000/');
});






// Implement the command line interpreter
const readline = require('readline').createInterface({
input: process.stdin,
output: process.stdout
});

readline.setPrompt('Type itemsList or stop to shutdown the server: ');
readline.prompt();

readline.on('line', (input) => {
if (input === 'stop') {
console.log('Shutting down the server');
server.close(() => {
process.exit(0);
});
} else if (input === 'itemsList') {
console.log(items);
} else {
console.log("Invalid command ${input}");
}

readline.prompt();
});

// Display usage message if incorrect number of command line arguments are provided
if (process.argv.length !== 3) {
console.log('Usage: node supermarketServer.js jsonFile');
process.exit(1);
}