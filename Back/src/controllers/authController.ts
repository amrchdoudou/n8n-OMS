
import type { Request, Response } from "express";
import { GenerateJwtToken , GenerateRefreshToken } from "../Services/Common.js";
import { CheckUserPassword } from "../db/User_Db.js";
import jwt from "jsonwebtoken";



//add user exists check


export const create = async (
  req: Request,
    res: Response

) => {
  const { email, password } = req.body;
  try {
    const user = await CheckUserPassword(email, password);
    if (!user ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT token

    if(!user.email || !user.id){
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = GenerateJwtToken(user.id, user.email);
    const refreshToken = GenerateRefreshToken(user.id, user.email);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.log("we got an error");
    
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const refreshToken = async (req: Request ,
    res: Response
) => {

  const token  = req.body.refreshToken; 
  if (!token) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(token, (process.env.JWT_SECRET!) ) as { userId: number; email: string; type: string , expiresIn: number};
    
    if (decoded.type !== 'refresh' || Date.now() >= decoded.expiresIn * 1000) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const accessToken = GenerateJwtToken(decoded.userId, decoded.email);
    const newRefreshToken = GenerateRefreshToken(decoded.userId, decoded.email);
    return res.status(200).json({ accessToken: accessToken , refreshToken: newRefreshToken } );
  }
  catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  } 
};
   

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.status(200).json({ valid: true });
  }
  catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


