import express, { Router } from 'express';
import testRoute from './test.route';
import authRoute from './auth.route'

const router: Router = express.Router();
const defaultRoutes = [
  {
    path: '/test/',
    route: testRoute,
  },
  {
    path: '/auth/',
    route: authRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
