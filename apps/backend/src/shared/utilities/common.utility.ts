import * as bcrypt from 'bcrypt';

export class CommonUtility {
    public static async checkPassword(newPassword: string, oldPassword: string): Promise<boolean> {
        return bcrypt.compare(newPassword, oldPassword);
    }

    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, await bcrypt.genSalt());
    }
}
