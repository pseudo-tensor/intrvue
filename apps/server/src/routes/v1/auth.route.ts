import express, { Router } from 'express';
import { userAuthZodType } from '@repo/types/userTypes';
import prisma from '../../prisma/prisma';

const router: Router = express.Router();

router.post('/signup', async (req, res) => {
  const receivedPayload = req.body;
  const payload = userAuthZodType.safeParse(receivedPayload);

  if (!payload.success) {
    res.status(500);
    return;
  }

  try {

    /*
    const dbFetchResult = await prisma.user.findUniqueOrThrow({
      where: {
        username: payload.data.username,
        password: payload.data.password
      }
    });
    */

    res.status(200).json({
      id: "a9e86162-d472-11e8-b36c-ca8f07183a4d",
      name: "baller",
      email: "baller@ballersorg.com"
    });

  } catch (err) {
    res.status(204).json({
      msg: "user not found"
    })
  }
    /* DB access using payload 
  
  */
});

export default router;
