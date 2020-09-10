//_______________________________________________________________________
//
//                          initialise
//_______________________________________________________________________
// Import npm packages
const fs = require('fs');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// Create Express app
const app = express()

// user bodyParser
app.use(bodyParser.json());

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

// Box Mullet Transform RNG
// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
// ---
// for singapore
// minx = 1.239808
// miny = 103.670679
// maxx = 1.462897
// maxy = 103.972252
// centre_x = 1.289832
// centre_y = 103.845270
random = (n, min_x, min_y, max_x, max_y, centre_x, centre_y) => {
    const sigma = 1;
    const mean = 1;

    const transformConst = 4;
    const transformX = (max_x - min_x) / transformConst;
    const offsetX = (max_x + min_x) / 2;
    const transformY = (max_y - min_y) / transformConst;
    const offsetY = (max_y + min_y) / 2;

    let x = new Array(n);
    let y = new Array(n);

    for (i = 0; i < n; i++) {
        u1 = Math.random();
        u2 = Math.random();

        R = Math.sqrt(-2 * Math.log(u1));
        theta = 2 * Math.PI * u2;

        z1 = R * Math.cos(theta);
        z2 = R * Math.sin(theta);

        x[i] = (z1 * sigma + mean) * transformX + offsetX;
        y[i] = (z2 * sigma + mean) * transformY + offsetY;
    }
    return [x, y];
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
// Get heatmap
app.get('/map', (req, res) => {
    // Main Run 
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        let cursor = await collection.find({});
        let cursor_array = await cursor.toArray();
        //console.log(cursor_array)
        await client.close()
        // send done signal
        req.body = {
            "items": cursor_array
        };
        await res.json(req.body);
    })();
})
//-------------- Location String -------------------
app.put('/location/add/:location', (req, res) => {
    const { location } = req.params;

    // Main Run 
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("location");
        await collection.insertOne({
            "location": location,
        });
        client.close()
        // send done signal
        req.body = { "Ok": true };
        await res.json(req.body);
    })();
})
app.get('/location', (req, res) => {
    // Main Run 
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("location");
        let cursor = await collection.find({});
        let cursor_array = await cursor.toArray();
        //console.log(cursor_array)
        await client.close()
        // send done signal
        req.body = {
            "items": cursor_array
        };
        await res.json(req.body);
    })();
})


//-------------- RNG -------------------
app.get('/rng', (req, res) => {
    const n = 10;

    let numbers = random(n, 1.239808, 103.670679, 1.462897, 103.972252, 1.289832, 103.845270);
    let x = numbers[0];
    let y = numbers[1];

    let temp_array = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
        temp_array[i] = {
            "lat": x[i],
            "long": y[i],
        }
    }
        
    req.body = temp_array;
    res.json(req.body);
})
app.put('/map/add_many/:n', (req, res) => {
    const { n } = req.params;

    let numbers = random(n, 1.239808, 103.670679, 1.462897, 103.972252, 1.289832, 103.845270);
    let x = numbers[0];
    let y = numbers[1];

    let temp_array = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
        temp_array[i] = {
            "lat": x[i],
            "long": y[i],
        }
    }

    // Main Run 
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        await collection.insertMany(
            temp_array,
            {
                ordered: false,
            });
        client.close()
        // send done signal
        req.body = { "Ok": true };
        await res.json(req.body);
    })();
})


//_______________________________________________________________________
//
//                          Server
//_______________________________________________________________________

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'));