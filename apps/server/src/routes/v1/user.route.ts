import express, { Router } from 'express';
import { checkAccessToken } from '../../middlewares/authMiddleware';
import prisma from '../../prisma/prisma';

const router: Router = express.Router();
router.use(checkAccessToken);

router.post('/hosted', async (req, res) => {
  const body = req.body;
  if (!body.userId) {
    res.status(400).json({});
    return;
  }

  try {
    const searchResult = await prisma.session.findMany({
      where: {
        host_id: body.userId
      },
      include: {
        participant: {
          select: { username: true }
        },
      }
    });
    res.status(200).json(searchResult);
  } catch (err) {
    res.status(500).json({});
  };
})

router.post('/participated', async (req, res) => {
  const body = req.body;
  if (!body.userId) {
    res.status(400).json({});
    return;
  }

  console.log(body.userId);
  try {
    const searchResult = await prisma.session.findMany({
      where: {
        participant_id: body.userId
      },
      include: {
        host: {
          select: { username: true }
        },
      }
    });

    res.status(200).json(searchResult);
  } catch (err) {
    res.status(500).json({});
  };

})

export default router;

