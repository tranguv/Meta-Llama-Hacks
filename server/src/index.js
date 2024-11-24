// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 2700;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());

// POST route to send data to the API
app.post('/send-to-api', async (req, res) => {
  try {
      const { question } = req.body;
      const response = await axios.post('http://195.242.13.143:8000/ask-all/', question);

      res.status(200).json(response.data);
  } catch (error) {
      console.error('Error posting to API:', error.message);
      res.status(500).json({ error: 'Failed to send data to the API.' });
  }
});

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
