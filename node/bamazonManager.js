var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");
require("console.table")

var key = "";

//create a mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: key,
    database: "bamazon"
});
//open a mysql connection 
connection.connect(function (err) {
    if (err) throw err;
    //call selection options to get user input
    displayInquirer();
});

function displayInquirer() {

    inquirer.prompt(
        {
            name: "choosen",
            type: 'list',
            message: "What would like to do? ",
            choices: [
                "View inventory",
                "View low quantity products",
                "Add a item to the existing product line",
                "Add a new product line"
            ]
        }).then(function (answers) {

            switch (answers.choosen) {
                case "View inventory":
                    viewInventory();
                    console.log("connection succes");
                    break;
                case "View low quantity products":
                    viewLowQuantity();
                    break;

                case "Add a item to the existing product line":
                    addToInventory();
                    break;


                case "Add a new product line":
                    //addNewProduct();
                    break;
            }
        })
}

//create a function that displays full inventory 
function viewInventory() {
    var query = "SELECT * FROM bamazon.products";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);

    });

};


//create a function that displays low quantity  
function viewLowQuantity() {
    inquirer.prompt([
        {
            name: "quantity",
            type: "input",
            message: "Enter an amount to filter products: ",

        }
    ]).then(function (answer) {
        var query = "SELECT product_id, product_name, stock_quantity FROM bamazon.products";
        connection.query(query, function (err, res) {

            //loop all the products quantities to determine low quantity ones
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < answer.quantity) {
                    console.table(res[i].product_name + res[i].stock_quantity);
                }


            }

        })
    })

};







//create a function that adds product to an existing item  
function addToInventory() {
    //display product list for manager to select an item 
    var query = "SELECT * FROM bamazon.products"

    connection.query(query, function (err, res) {

        if (err) throw err;
        console.table(res);
        callInq(); 
    });
    function callInq() {
        inquirer.prompt([
            {
                name: "productId",
                type: "input",
                message: "Enter product ID: "
            },
            {
                name: "add_quantity",
                type: "input",
                message: "Enter new amount for product ID: "
            }
        ]).then(function (answer) {

            connection.query("SELECT stock_quantity FROM bamazon.products WHERE ?", { product_id: parseInt(answer.productId) }, function (err, res) {
                if (err) throw err;

                var total_quantity = res[0].stock_quantity + parseInt(answer.add_quantity);

                //update mySQL with entered data
                var query = "UPDATE products FROM bamazon.products SET ? WHERE ?"

                var id = parseInt(answer.productId);
                connection.query(query, [{ stock_quantity: total_quantity }, { product_id: id }], function (err, res) {

                    console.log("res[0].stock_quantity");
                })
            })
        })
    }
};






// //create a function that adds a new product line to an inventory 
// function addNewProduct() {

//     inquirer.prompt([
//         {
//             name: "d_name",
//             type: "input",
//             message: "Enter Product Name: "
//         },
//         {
//             name: "department_name",
//             type: "input",
//             message: "Enter Product Department: "
//         },
//         {
//             name: "price",
//             type: "input",
//             message: "Enter Product Sell Price: "
//         },
//         {
//             name: "",
//             type: "input",
//             message: "Enter Product Sell Price: "
//         },


// }