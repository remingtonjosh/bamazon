var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Fearless01!",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "viewOrExit",
            type: "list",
            message: "Would you like to [VIEW] our products or [Exit] our online store?",
            choices: ["VIEW", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.viewOrExit === "VIEW") {
                products();
            } else {
                connection.end();
            }
        });
};

function products() {

    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        console.log("----- Please remember your product ID you'd like to purchase -----\n");
        selectProduct(res);
    });
}

var selectProduct = function (res) {
    inquirer
        .prompt([{
            type: 'input',
            name: 'choice',
            message: "Would product ID did you want to purchase?"
        }])
        .then(function (answer) {
            var correct = false;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.choice) {
                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    inquirer.prompt({
                        type: "input",
                        name: "quant",
                        message: "How many would you like to buy?",
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        if ((res[id].stock_quantity - answer.quant) > 0) {
                            connection.query("UPDATE products SET stock_quantity=' " + (res[id].stock_quantity - answer.quant) + "' WHERE product_name = '" + products + "'", function (err, res2) { console.log("Product Bought!"); })
                        }
                    })
                }

            }

        })
};