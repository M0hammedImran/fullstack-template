import { Injectable } from '@nestjs/common';

import type { EmailProps } from '@/shared/interfaces/email.interface';

@Injectable()
export class NotificationService {
    async email(_props: EmailProps) {
        return Promise.reject(new Error('Implementation pending'));
    }
}
