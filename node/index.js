var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

//mysql key here
var key = "";

//create a mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: key,
    database: "bamazon"
})


connection.connect(function (err) {
    if (err) throw err;
    console.log("connection is established successfully");
    display_Fullstock();


});



var display_Fullstock = function () {

    var query = "SELECT * from bamazon.products";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);

        shopping();
    });

};


//remember here that I dont need to use for loop for id matching instead you can use "WHERE"
function shopping() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please enter iten ID: " //4
    },
    {
        name: "quantity",
        type: "input",
        message: "Please enter Quantity: " //5
    }
    ]).then(function (answer) {
        var temp = "SELECT price,stock_quantity FROM products WHERE ?";
        var id = parseInt(answer.id);
        // product_id should match whatever is in the database and replace it ? mark. 
        connection.query(temp, { product_id: id }, function (err, data) {
            if (err) {
                console.log(err);
            }

            if (data[0].stock_quantity >= parseInt(answer.quantity)) {
                //if(79>=5)
                //79-5 = 74
                var q = data[0].stock_quantity - parseInt(answer.quantity);
                //ALways define objects in the sequesnce you want to provide data to the question maarks
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: q }, { product_id: id }], function (err, q_data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("QUantity Updated.");
                  var p = data[0].price * parseInt(answer.quantity);
                    console.log("Total Price: " + p);
                });
            }
            else {
                console.log("Insufficient Quantity!");
            }
            connection.end();
        })
    })

}