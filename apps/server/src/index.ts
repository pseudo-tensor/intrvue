import app from './app';
import config from './config';
import prisma from './prisma/prisma';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as number from 'lib0/number'
import wsserver from './ywebsock/server';

const host: string = config.host || 'localhost'
const port: number = number.parseInt(config.port || '8080') // Use main port, not wsport

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

prisma.$connect().then(() => {
  console.info('Connected to postgres db');
  
  // Create the main HTTP server using your Express app
  server = app.listen(config.port, () => {
    console.info(`HTTP server listening on port ${config.port}`)
  });
  
  // Add WebSocket upgrade handling to the same server
  server.on('upgrade', (request, socket, head) => {
    // Forward WebSocket upgrade requests to your wsserver
    if (wsserver.listeners('upgrade').length > 0) {
      wsserver.emit('upgrade', request, socket, head);
    }
  });
  
  console.log(`Combined server running at '${host}' on port ${config.port}`);
  console.log(`HTTP: http://${host}:${config.port}`);
  console.log(`WebSocket: ws://${host}:${config.port}`);
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
    await prisma.$disconnect();
    console.info('Disconnected from DB');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
});
