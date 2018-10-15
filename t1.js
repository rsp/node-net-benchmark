const net = require('net');

const { env } = process;

const port = env.PORT || 3301;
const host = env.HOST || '127.0.0.1';

const length = env.LENGTH || 100;
const number = env.NUMBER || 100;

const connections = env.CONNECTIONS || 100;

const concurrent = !!env.CONCURRENT;
const verify = !!env.VERIFY;

const debug = !!env.DEBUG;

let connection = 0;

log('Creating server');
const server = net.createServer((socket) => {
	socket.pipe(socket);
});

server.listen(port, host, () => {
  log('Server listening');
  main();
});

const one = () => new Promise((resolve, reject) => {
  const current = ++connection;
  log(`Starting connection ${current}`);
  const message = 'x'.repeat(length - 2) + '\r\n';
  const client = new net.Socket();
  let sent = '';
  let received = '';
  client.on('data', (data) => {
    log(`Data recieved on connection ${current}`);
    if (verify) {
      received += data;
    }
  });
  client.on('close', () => {
    log(`Closed connection ${current}`);
    if (!verify || received === sent) {
      resolve();
    } else {
      reject();
    }
  });
  client.on('error', () => {
    log(`Error connection ${current}`);
    reject();
  });
  client.connect(port, host, () => {
    log(`Connected connection ${current}`);
    for (let i = 0; i < number; i++) {
      log(`Sending data to connection ${current}`);
      if (verify) {
        sent += message;
      }
      client.write(message);
    }
    log(`Ending connection ${current}`);
    client.end();
  });
});

async function serial() {
  for (let i = 0; i < connections; i++) {
    await one();
  }
}

async function parallel() {
  const results = [];
  for (let i = 0; i < connections; i++) {
    results.push(one());
  }
  await Promise.all(results);
}

async function main() {
  const start = +new Date();
  if (concurrent) {
    log(`Starting ${connections} parallel connections`);
    await parallel();
  } else {
    log(`Starting ${connections} serial connections`);
    await serial();
  }
  const end = +new Date();
  console.log(end - start);
  server.close();
}

function log(...args) {
  if (debug) {
    console.log(...args);
  }
}
