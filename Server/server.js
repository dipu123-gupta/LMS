const app = require('./app.js');
const connectionToDB = require('./config/dbConnection.js');


const PORT = process.env.PORT || 5000;


connectionToDB().then(async () => {
    app.listen(PORT, () => {
        console.log(`App running at http:localhost:${PORT}`);

    })
}).catch(error => console.log(error));

