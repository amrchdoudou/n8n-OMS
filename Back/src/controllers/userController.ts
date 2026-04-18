// src/controllers/userController.ts
import type { Request, Response } from 'express';
import { updateUserInfo, CreateUser, CheckUserPassword , UpdateContactInfoInfo } from '../db/User_Db.js';
import { prisma } from '../Services/Common.js';

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.storeName || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'username, storeName, telegram, email, and password are required' });
    }
    const newUser = await CreateUser(req.body.username, req.body.storeName, req.body.email, req.body.password);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUserInformation = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user.id;
  if (isNaN(userId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email, number, storeName, apiKey , password} = req.body;
  try {
    const updatedUser = await updateUserInfo(userId, email, password, number, storeName, apiKey);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const UpdateUserPassword = async (
  req: Request,
  res: Response
) => {
  const userEmail = (req as any).user.email;
  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { oldPassword, newPassword } = req.body;
  const verifyUser = await CheckUserPassword(userEmail, oldPassword);
  if (!verifyUser) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  try {
    const updatedUser = await updateUserInfo(verifyUser.id, undefined, newPassword);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const UpdateUserContactInfo = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user.id;
  if (isNaN(userId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { number, storeName, apiKey, deliveryProvider, webhookUrl, webhookStock } = req.body;
  try {
    const updatedUser = await UpdateContactInfoInfo(userId, number, storeName, apiKey, deliveryProvider, webhookUrl, webhookStock);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact info' });
  }

};