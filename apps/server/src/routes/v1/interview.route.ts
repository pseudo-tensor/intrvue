import express, { Router } from 'express';
import prisma from '../../prisma/prisma';
import { createSessionZodType, fetchInterviewDetailsZodType } from '@repo/types/userTypes';
import { sessionModifiers } from '@repo/types/restEnums';
import { SessionStatus } from '@prisma/client';
import { defaultInitState } from '@repo/store/stores/textStore';
import { checkAccessToken } from '../../middlewares/authMiddleware';

const router: Router = express.Router();
router.use(checkAccessToken);

router.post('/new', async (req, res) => {
  console.log(req.body);
  const user = createSessionZodType.safeParse(req.body);
  if (!user.success) {
    console.log("payload failure");
    res.status(400).json({});
    return;
  }

  console.log("payload success");
  let pId: string | undefined = undefined;
  if (user.data.pUsername) {
    try {
      const searchResult = await prisma.user.findUnique({
        where: {
          username: user.data.pUsername
        }
      })
      pId = searchResult?.user_id;
    } catch(err) {
      console.error("error while finding username");
      res.json(500).json({});
    }
  }

  console.log("username found");
  try {
    const createResult = await prisma.session.create({
      data: {
        host: {
          connect: { user_id: user.data.id }
        },
        ...(user.data.pUsername && {
          participant: {
            connect: { user_id: pId }
          }
        }),
        code_data: "",
        text_data: defaultInitState,
        date: user.data.date //optional
      }
    })
    res.status(200).json(createResult);
  } catch (err) {
    console.error("error while creating new session");
    res.status(500).json({});
  }
})

router.post('/modify', async (req, res) => {
  const body = fetchInterviewDetailsZodType.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({});
    return;
  }

  let pId: string | undefined = undefined;
  if (body.data.modificationPayload.pUsername) {
    try {
      const searchResult = await prisma.user.findUnique({
        where: {
          username: body.data.modificationPayload.pUsername
        }
      })
      pId = searchResult?.user_id;
    } catch(err) {
      console.error("error while finding username");
      res.json(500).json({});
    }
  }

  if (
    body.data.enum === sessionModifiers.SET_PARTICIPANT ||
    body.data.enum === sessionModifiers.REMOVE_PARTICIPANT
  ) {
  try {
    const updateResult = await prisma.session.update({
      where: {
        session_id: body.data.id
      },
      data: {
        ...(pId
          ? {
              participant: {
                connect: { user_id: pId }
              }
            }
          : {
              participant: {
                disconnect: true
              }
            })
      }
    });

    res.status(200).json(updateResult);
  } catch (err) {
    console.error("error while editing participant data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  return;
}

  if (body.data.enum == sessionModifiers.CANCEL_INTERVIEW || body.data.enum == sessionModifiers.FINISH_INTERVIEW) {
    try {
      const udpateResult = await prisma.session.update({
        where: {
          session_id: body.data.id
        },
        data: {
          status: (body.data.enum == sessionModifiers.CANCEL_INTERVIEW)? SessionStatus.CANCELLED : SessionStatus.ENDED
        }
      })
      res.status(200).json({});
    } catch (err) {
      console.log("error while update session status");
      res.status(500).json({});
    }
    return;
  }

  if (body.data.enum == sessionModifiers.CHANGE_DATE) {
    try {
      const updateResult = await prisma.session.update({
        where: {
          session_id: body.data.id
        },
        data: {
          date: body.data.modificationPayload.date
        }
      })
      res.status(200).json({});
    } catch (err) {
      console.error("error while changing date of interview");
      res.status(500).json({});
    }
    return;
  }
})

router.post('/fetch', async (req, res) => {
  if (!req.body.id) {
    res.status(400).json({});
    return;
  }
  try {
    const searchResult = await prisma.session.findUnique({
      where: {
        session_id: req.body.id
      }
    })
    res.status(200).json(searchResult);
  } catch (err) {
    res.status(404).json({});
  }
})

export default router;
