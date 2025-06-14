import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    msg: "healthy"
  })
});

router.post('/', async (req, res) => {
  const payloadBody = await req.body;
  const payloadHeaders = req.headers;

  res.status(200).json({
    msg: "healthy",
    recievedHeaders: payloadHeaders,
    recievedBody: payloadBody
  })
})

export default router;
