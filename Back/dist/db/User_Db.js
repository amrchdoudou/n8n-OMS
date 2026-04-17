import { prisma, HashPassword } from "../Services/Common.js";
const CreateUser = async (username, storeName, email, password) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                username: username,
                storeName: storeName,
                email: email,
                password: HashPassword(password),
            },
        });
        return newUser;
    }
    catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};
const CheckUserPassword = async (email, password) => {
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
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
const updateUserInfo = async (userId, Email, Password, number, storeName, apiKey) => {
    try {
        const updatedUser = await prisma.user.update({
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
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
const UpdateContactInfoInfo = async (userId, number, storeName, apiKey, deliveryProvider) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(number ? { whatsappNumber: number } : {}),
                ...(storeName ? { storeName: storeName } : {}),
                ...(apiKey ? { apiKey: apiKey } : {}),
                ...(deliveryProvider ? { deliveryProvider: deliveryProvider } : {}),
            },
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
export { CreateUser, CheckUserPassword, updateUserInfo, UpdateContactInfoInfo };
//# sourceMappingURL=User_Db.js.map