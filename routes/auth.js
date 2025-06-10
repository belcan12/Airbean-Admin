import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getUser, registerUser } from "../services/users.js";

const router = Router();

// GET logout
router.get("/logout", (req, res) => {
  global.user = null;
  res.json({
    success: true,
    message: "User logged out successfully",
  });
});

// POST login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await getUser(username);
    if (user) {
      if (user.password === password) {
        global.user = user;
        res.json({
          success: true,
          message: "User logged in successfully",
        });
      } else {
        next({
          status: 400,
          message: "Username or password are incorrect",
        });
      }
    } else {
      next({
        status: 400,
        message: "No User found",
      });
    }
  } else {
    next({
      status: 400,
      message: "Both username and password are required",
    });
  }
});

// POST register 
router.post("/register", async (req, res, next) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return next({
      status: 400,
      message: "Username, password och role är obligatoriska",
    });
  }
  if (role !== "User" && role !== "admin") {
    return next({
      status: 400,
      message: 'Role måste vara antingen "User" eller "admin"',
    });
  }
  try {
    const result = await registerUser({
      username,
      password,
      role,
      userId: `user-${uuid().substring(0, 5)}`,
    });
    if (result) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } else {
      next({
        status: 400,
        message: "User could not be created.",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
