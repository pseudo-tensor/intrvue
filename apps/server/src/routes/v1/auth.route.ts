// WARN: THIS IS TOO FUCKING LARGE, MOVE MORE FUNCTIONS TO SERVICES AND COMPRESS SIGNIN WITH REFRESH ROUTE BY USING COMMON UTILITIES

import express, { Router } from 'express';
import { checkAccessToken, checkRefreshToken } from '../../middlewares/authMiddleware';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prisma';
import { authResponse, TokenStatus } from '@repo/types/restEnums';
import { createAccessToken, createRefreshToken } from '../../services/jwtTokenManager';

const router: Router = express.Router();

router.post('/signin/token', checkAccessToken, async (req, res) => {
  if (!config.jwtSecret) {
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    });
    throw Error("JWT Secret missing");
  }

  let receivedJWT: string | JwtPayload ;
  try {
    receivedJWT = jwt.verify(
      req.cookies['accessToken'],
      config.jwtSecret,
      config.signAlgo,
    );
  } catch(err) {
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    });
    throw Error("Error while decoding JWT in /signin route");
  }

  if (typeof receivedJWT === "string") {
    res.status(401).json({
      enum: TokenStatus.UNAUTHORIZED
    })
    return;
  }

  const userId = receivedJWT.userId;
  const usernameSearchRes = await prisma.user.findUnique({
    where: { user_id: userId }
  });

  if (!usernameSearchRes) {
    res.status(404).json({
      enum: authResponse.USER_NOT_FOUND
    });
    return;
  } else {
    const newAccessToken = createAccessToken(userId);
    if (!newAccessToken) {
      res.status(500).json({
        enum: authResponse.INTERNAL_SERVER_ERROR
      });
      return;
    }
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).json({
      userId: usernameSearchRes.user_id,
      username: usernameSearchRes.username,
      name: usernameSearchRes.name,
      email: usernameSearchRes.email
    });
    return;
  }
});

router.post('/signin/legacy', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({
      enum: authResponse.BAD_REQUEST
    });
    return;
  }

  const userSearchResult = await prisma.user.findUnique({
    where: {
      username: username
    }
  })

  if (!userSearchResult) {
    res.status(401).json({
      enum: authResponse.USER_NOT_FOUND
    })
    return;
  }

  const hashCheckResult = await bcrypt.compare(password, userSearchResult.password);

  if (hashCheckResult) {
    const newAccessToken = createAccessToken(userSearchResult.user_id);
    const newRefreshToken = createRefreshToken(userSearchResult.user_id);
    if (!newAccessToken || !newRefreshToken) {
      res.status(500).json({
        enum: authResponse.INTERNAL_SERVER_ERROR
      });
      return;
    }
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).json({
      userId: userSearchResult.user_id,
      username: userSearchResult.username,
      name: userSearchResult.name,
      email: userSearchResult.email

    })
  } else {
    console.log("password ", password);
    res.status(401).json({
      enum: authResponse.PASSWORD_INCORRECT
    })
    return;
  }
})

router.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (!username || !password) {
    res.status(400).json({
      enum: authResponse.BAD_REQUEST
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userSearchResult = await prisma.user.findUnique({
    where: {
      username: username
    }
  })
  if (userSearchResult) {
    res.status(401).json({
      enum: authResponse.USER_ALREADY_EXISTS
    })
    return;
  }

  try {
    const userCreationResult = await prisma.user.create({
      data: {
        email: email,
        username: username,
        name: name,
        password: hashedPassword,
      }
    })

    const newAccessToken = createAccessToken(userCreationResult.user_id);
    const newRefreshToken = createRefreshToken(userCreationResult.user_id);
    if (!newAccessToken || !newRefreshToken) {
      res.status(500).json({
        enum: authResponse.INTERNAL_SERVER_ERROR
      });
      return;
    }
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).json({
      userId: userCreationResult.user_id,
      username: userCreationResult.username,
      name: userCreationResult.name,
      email: userCreationResult.email
    })

  } catch(err) {
    console.error("Error while creating new user");
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    })
  }
})

router.post('/refresh', checkRefreshToken, async (req, res) => {
  if (!config.jwtSecret) {
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    });
    throw Error("JWT Secret missing");
  }

  let receivedJWT: string | JwtPayload ;
  try {
    receivedJWT = jwt.verify(
      req.cookies['refreshToken'],
      config.jwtSecret,
      config.signAlgo,
    );
  } catch(err) {
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    });
    throw Error("Error while decoding JWT in /refresh route");
  }

  if (typeof receivedJWT === "string") {
    res.status(401).json({
      enum: TokenStatus.UNAUTHORIZED
    })
    return;
  }
 
  const usernameSearchRes = await prisma.user.findUnique({
    where: { user_id: receivedJWT.userId }
  });

  if (!usernameSearchRes) {
    res.status(404).json({
      enum: authResponse.USER_NOT_FOUND
    });
    return;
  }

  const newAccessToken = createAccessToken(receivedJWT.userId);
  const newRefreshToken = createRefreshToken(receivedJWT.userId);
  if (!newAccessToken || !newRefreshToken) {
    res.status(500).json({
      enum: authResponse.INTERNAL_SERVER_ERROR
    });
    return;
  }
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    sameSite: 'strict',
  });
  res.status(200).json({
    userId: usernameSearchRes.user_id,
    username: usernameSearchRes.username,
    name: usernameSearchRes.name,
    email: usernameSearchRes.email
  });

  return;
})

export default router;
