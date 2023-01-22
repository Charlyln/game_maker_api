const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');

// const streamItemRoutes = require('./db/routes/streamItem.route');
// require('./db/models/associations');

const { default: axios } = require('axios');
const getTimecode = require('./timecode');

// const db = require('./db');
// const sequelize = require('./sequelize');

async function main() {
  const httpServer = http.createServer();

  const app = express();
  httpServer.on('request', app);

  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));

  // app.use(streamItemRoutes);

  // (async () => {
  //   await db.connect();
  //   await sequelize.connect();
  // })();

  const scores = [{ name: 'charly', score: '03:25' }];

  app.get('/version', (req, res) => {
    res.status(200).json({ version: '0.0.1' });
  });

  app.get('/scores', (req, res) => {
    const sorted = scores.sort((a, b) => b.score - a.score);
    res.status(200).json({ scores: sorted });
  });

  app.post('/name/:name/score/:score', (req, res) => {
    try {
      console.log(req.params.name);
      console.log(req.params.score);

      const index = scores.findIndex(
        (obj) => obj.name.toLowerCase() === req.params.name.toLowerCase()
      );

      if (index !== -1) {
        if (parseInt(req.params.score) < scores[index].score) {
          const newScore = getTimecode(parseInt(req.params.score));
          scores[index].score = newScore;
        }

        res.status(200).json(scores[index]);
      } else {
        const newScore = getTimecode(parseInt(req.params.score));
        const newscore = {
          name: req.params.name,
          score: newScore,
        };

        scores.push(newscore);
        res.status(200).json(newscore);
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  app.get('/', (req, res) => {
    res.status(200).send('GAME MAKER API');
  });

  httpServer.listen(process.env.PORT || 8080, () => {
    console.log(`App listening at port:${process.env.PORT || 8080}`);
  });
}

main();
