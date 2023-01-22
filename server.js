const dgram = require('dgram');
const { Buffer } = require('node:buffer');

const server = dgram.createSocket('udp4');

const message = Buffer.from('ping');

let clients = [];

server.on('message', (msg, info) => {
  const parsedMsg = JSON.parse(msg);

  const { id, event, ...data } = parsedMsg;

  console.log(`receive event [${event}] from client [${id}] data:`, data);

  switch (event) {
    case 'connect':
      clients.push({ id });
      console.table(clients);
      break;

    case 'move':
      break;

    case 'disconnect':
      const filtered = clients.filter((client) => client.id !== id);
      clients = filtered;
      console.table(clients);

      break;

    default:
      console.log('received unknow event', parsedMsg);
      break;
  }

  server.send(message, info.port, info.address);
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
