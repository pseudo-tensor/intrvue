import express, { Router } from 'express';
import testRoute from './test.route';
import authRoute from './auth.route'
import interviewRoute from './interview.route';

const router: Router = express.Router();
const defaultRoutes = [
  {
    path: '/test/',
    route: testRoute,
  },
  {
    path: '/auth/',
    route: authRoute,
  },
  {
    path: '/interview/',
    route: interviewRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
