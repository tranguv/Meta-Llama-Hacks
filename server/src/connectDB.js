const { MongoClient } = require('mongodb');

// Replace the uri string with your connection string.
const uri =
  'mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
