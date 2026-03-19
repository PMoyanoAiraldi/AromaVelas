import { rolEnum } from "src/user/user.entity";

declare namespace Express {
    interface Request {
    user?: {
        id: string;
        name: string;
        email: string;
        rol: rolEnum;
        state: boolean;
        };
    }
}