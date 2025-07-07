import app from './app';
import config from './config';
import prisma from './prisma/prisma';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as number from 'lib0/number'
import wsserver from './ywebsock/server';

const host: string = config.host || 'localhost'
const port: number = number.parseInt(config.wsport || '8081')

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
prisma.$connect().then(() => {
  console.info('Connected to postgres db');
  server = app.listen(config.port, () => {
    console.info(`Listening to port ${config.port}`)
  })
  wsserver.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`)
  })
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);


process.on('SIGTERM', async () => {
  console.info('SIGTERM received');

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.info('HTTP server closed');
    }

    if (wsserver && typeof wsserver.close === 'function') {
      await new Promise((resolve) => wsserver.close(resolve));
      console.info('WebSocket server closed');
    }

    await prisma.$disconnect();
    console.info('Disconnected from DB');

    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
});

