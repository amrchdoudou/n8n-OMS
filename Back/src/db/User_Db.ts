// src/db/User_Db.ts
import type { User } from "../generated/prisma/client.js";
import { prisma, HashPassword } from "../Services/Common.js";


const CreateUser = async (username: string, storeName: string, email: string, password: string) => {
    try {
        const newUser: User = await prisma.user.create({
            data: {
                username: username,
                storeName: storeName,
                email: email,
                password: HashPassword(password),
            },
        });

        return newUser;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

const CheckUserPassword = async (email: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true, email: true, password: true },
        });

        if (!user) {
            return null; // User not found
        }
        const pass = HashPassword(password);

        const isPasswordValid = pass === user.password;

        if (!isPasswordValid) {
            return null; // Invalid password
        }

        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

const updateUserInfo = async (userId: number, Email?: string, Password?: string, number?: string, storeName?: string , apiKey?: string) => {
    try {
        const updatedUser: User = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(Email ? { email: Email } : {}),
                ...(Password ? { password: HashPassword(Password) } : {}),
                ...(number ? { whatsappNumber: number } : {}),
                ...(storeName ? { storeName: storeName } : {}),
                ...(apiKey ? { apiKey: apiKey } : {}),

            },
        });

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};


const UpdateContactInfoInfo = async (userId: number, number?: string, storeName?: string , apiKey?: string, deliveryProvider?: string, webhookUrl?: string, webhookStock?: string) => {
    try {
        const updatedUser: User = await prisma.user.update({
            where: { id: userId },
            data: {
               
                ...(number ? { whatsappNumber: number } : {}),
                ...(storeName ? { storeName: storeName } : {}),
                ...(apiKey ? { apiKey: apiKey } : {}),
                ...(deliveryProvider ? { deliveryProvider: deliveryProvider } : {}),
                ...(webhookUrl ? { webhookUrl: webhookUrl } : {}),
                ...(webhookStock ? { webhookStock: webhookStock } : {}),

            },
        });

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export { CreateUser, CheckUserPassword, updateUserInfo , UpdateContactInfoInfo };