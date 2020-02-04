import Hapi from 'hapi';
import authorRoutes from './routes/author.routes';
import articleRoutes from './routes/article.routes';
import websiteRoutes from './routes/website.routes';

const init = async () => {

  // in Prod, this is taken from config
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: true,
    },
  });

  // routes
  server.route(authorRoutes);
  server.route(articleRoutes);
  server.route(websiteRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
  throw (err);
});

init();
