const dgram = require('dgram');
const { Buffer } = require('node:buffer');

const server = dgram.createSocket('udp4');

let clients = [
  // {
  //   id: '82C9BEA0-7E3A-473F-9B47-3CE91BCD8C78',
  //   x: 1000,
  //   y: 100,
  //   port: 64768,
  //   address: '192.168.1.137',
  // },
];

server.on('message', (msg, info) => {
  const parsedMsg = JSON.parse(msg);

  const { id, event, ...data } = parsedMsg;

  console.log(`receive event [${event}] from client [${id}] data:`, data);

  let messageEvent;
  let message;
  let buffer;

  switch (event) {
    case 'connect':
      clients.push({
        id,
        x: data.x,
        y: data.y,
        name: data.name,
        color: data.color,
        port: info.port,
        address: info.address,
      });

      messageEvent = 'connect';

      message = { event: messageEvent, players: clients };
      buffer = Buffer.from(JSON.stringify(message));

      console.log(clients);

      clients.forEach((client) => {
        server.send(buffer, client.port, client.address);
      });

      break;

    case 'move':
      // clients[0].x = data.x;
      // clients[0].y = data.y;

      messageEvent = 'move';

      const moveIndex = clients.findIndex((client) => client.id === id);

      console.log(moveIndex);
      clients[moveIndex].x = data.x;
      clients[moveIndex].y = data.y;
      console.log(clients);

      message = { event: messageEvent, player: clients[moveIndex] };
      buffer = Buffer.from(JSON.stringify(message));

      clients.forEach((client) => {
        server.send(buffer, client.port, client.address);
      });

      break;

    case 'disconnect':
      const index = clients.findIndex((client) => client.id === id);

      messageEvent = 'disconnect';

      message = { event: messageEvent, index, player: clients[index] };
      buffer = Buffer.from(JSON.stringify(message));

      if (index > -1) {
        // only splice array when item is found
        clients.splice(index, 1); // 2nd parameter means remove one item only
      }

      console.log(clients);

      clients.forEach((client) => {
        server.send(buffer, client.port, client.address);
      });

      break;

    default:
      console.log('received unknow event', parsedMsg);
      break;
  }
});

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.PORT || 8080);

// //Prep the server
// const WebSocketServer = require('ws');
// const http = require('http');
// const https = require('https');
// const fs = require('fs');
// var express = require('express');
// var app = express();

// const secure = true;

// //Launch the server up
// var port = process.env.PORT || 8080;
// app.use(express.static(__dirname + '/'));
// if (!secure) {
//   var httpserver = http.createServer(app);
// } else {
//   var options = {
//     cert: fs.readFileSync('ssl/server.crt'),
//     key: fs.readFileSync('ssl/server.key'),
//   };
//   var httpserver = https.createServer(options, app);
// }
// httpserver.listen(port, () => {
//   console.log('listening...', port);
// });
// var server = new WebSocketServer.Server({ server: httpserver });

// //Create the client sockets on connection
// server.on('connection', (socket) => {
//   //Execute on connection
//   console.log(`Player Connected!`);
//   // this.player = undefined;

//   //Execute when recieving data
//   socket.on('message', (raw_data) => {
//     console.log(`Received: ${raw_data}`);

//     try {
//       const string = raw_data.toString();

//       var mySubString = string.substring(
//         string.indexOf('{'),
//         string.lastIndexOf('}') + 1
//       );

//       let data = JSON.parse(mySubString);
//       console.log(`parsed:`, data);
//     } catch (error) {

//     }

//     //Parse the data, execute the event.
//     // let data = JSON.parse(raw_data);
//     // console.log(`parsed:`, data);
//     // let event = new Event(data.type, socket, data);
//     // event.Execute();
//   });

//   //Execute on disconnect
//   socket.on('close', () => {
//     console.log('Player disconnected!');

//     // //Disconnect the player
//     // if (socket.player != undefined) {
//     //   socket.player.Disconnect();
//     // }
//   });

//   //Execute on error
//   socket.onerror = (error) => {
//     console.log('Client Error: ${error}');
//   };
// });
