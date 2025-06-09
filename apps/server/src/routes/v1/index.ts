import express, { Router } from 'express';
import testRoute from './test.route';

const router: Router = express.Router();
const defaultRoutes = [
  {
    path: '/test/',
    route: testRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
