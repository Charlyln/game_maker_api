const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');

// const streamItemRoutes = require('./db/routes/streamItem.route');
// require('./db/models/associations');

const { default: axios } = require('axios');

// const db = require('./db');
// const sequelize = require('./sequelize');

async function main() {
  const httpServer = http.createServer();

  const app = express();
  httpServer.on('request', app);

  app.use(cors());
  app.use(express.json());
  // app.use(streamItemRoutes);

  // (async () => {
  //   await db.connect();
  //   await sequelize.connect();
  // })();

  app.get('/version', (req, res) => {
    res.status(200).json({ version: '0.0.1' });
  });

  app.post('/name/:name/score/:score', (req, res) => {
    try {
      console.log(req.params.name);
      console.log(req.params.score);

      

      res.status(200).json({ score: req.body });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  app.get('*', (req, res) => {
    res.status(200).send('GAME MAKER API');
  });

  httpServer.listen(5000, () => {
    console.log(`App listening at port:${5000}`);
  });
}

main();
