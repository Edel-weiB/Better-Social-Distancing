//_______________________________________________________________________
//
//                          initialise
//_______________________________________________________________________
// Import npm packages
const fs = require('fs');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Create Express app
const app = express()

// Load Credenti
const credentials = JSON.parse(fs.readFileSync('ATLAS_credendials.json', 'utf8'));

//_______________________________________________________________________
//
//                          Hello World
//_______________________________________________________________________
// To test the server, go to your localhost:3000
// you should see Hello World!
app.get('/', (req, res) => res.send('Hello World!'))

//_______________________________________________________________________
//
//                          Functions
//_______________________________________________________________________
connect_2_db = (credentials) => {
    const ATLAS_connection_string = "mongodb+srv://" + credentials.username + ":" + credentials.password + credentials.hostName + "/" + credentials.cluster + "?retryWrites=true&w=majority";
    const uri = ATLAS_connection_string + "&useNewUrlParser=true&useUnifiedTopology=true";
    const client = new MongoClient(uri);
    return client;
}
sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}




//_______________________________________________________________________
//
//                          Routings
//_______________________________________________________________________

//-------------- Map -------------------
// Add new map points
app.get('/map/add', (req, res) => {
    const x = req.query.pointx;
    const y = req.query.pointy;

    // Main Run 
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        await collection.insertOne({
            "x": x,
            "y": y,
        });
        client.close()
        // send done signal
        await res.send("done");
    })();
})


//_______________________________________________________________________
//
//                          Server
//_______________________________________________________________________

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'))