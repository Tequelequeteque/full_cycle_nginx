require('dotenv').config({silent: true});
express = require('express');
mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


const main = () =>{
    connection.connect();
    connection.query('CREATE TABLE IF NOT EXISTS `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`))');
    connection.query('INSERT INTO `users` (`name`) VALUES (?)', ['John Doe']);
    const app = express();
    const port = process.env.APP_PORT;
    const promise = new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `users`',(err, rows, fields) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
        connection.end()
    });
    app.get('/',async (req, res) => {
        const users = await promise;

        res.send(`<h1>Full Cycle Rocks!</h1><h2>Users:</h2><ul>${users.map(user => `<li>${user.name}</li>`).join('')}</ul>`);
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

main();
