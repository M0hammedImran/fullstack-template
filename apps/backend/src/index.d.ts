import type { User as MyUser } from '@/user/entities';

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends MyUser {}
    }
}
