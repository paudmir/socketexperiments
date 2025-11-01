const path = require('node:path');
const express = require('express');
const Datastore = require('@seald-io/nedb');
const querystring = require('node:querystring');
require('dotenv').config();


// An array of different song IDs 
const songs = [102249,123068,45620,2315135];

const app = express();
const port = Number(process.env.PORT || 3000);
const server = app.listen(port);

console.log(`Server is listening on port ${port}`);

// use this file as the database
const dbOptions = {
  filename: 'database.db'
};
const database = new Datastore(dbOptions);
database.loadDatabase();

app.use(express.static(path.join(__dirname, 'public')));

// this prevents people from spamming our server with excessively
// long responses
app.use(express.json({limit: '1mb'}));

/* when we receive a POST request, the user is sending us data */
app.post('/wish', (request, response) => {
  console.log("POST Request Received");
  
  const data = request.body;
  
  // add a time stamp along with the data we received
  const timestamp = Date.now();
  data.timestamp = timestamp;

  // save the data in the database
  database.insert(data);
  
  // send a response to the client
  response.json({
    status: 'success',
    wish: data.wish,
    timestamp: data.timestamp
  });
});

/* GET requests: server sends the client all the wishes from
 * the database
 */
app.get('/wish', (request, response) => {
  // grab all the data (since it's not too much!) and then 
  // sort it by timestamp in reverse chronological order
  // (newest first).
  console.log("in wish");
  database.find({}).sort({timestamp: -1}).exec((error, data) => {
    if (error) {
      response.end();
      return;
    }
    response.json(data);
  })
});


// Getting the lyrics from Genius API

app.post('/external-data', async (req, res) => {
  const opt = req.body;
  console.log("This is what we got from the client:");
  console.log(opt);

  console.log('-----getting data here');
  const urlson = 'https://api.genius.com/songs/123068';
  const url = 'https://api.genius.com/referents?song_id=2315135';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ATOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('-----We tried and got a response...maybe?');
    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});
