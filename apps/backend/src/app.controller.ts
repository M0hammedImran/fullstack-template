import { Controller, Get, Headers } from '@nestjs/common';

import { ResponseUtility } from './shared/utilities';

@Controller()
export class AppController {
    @Get('health')
    getHealth(@Headers() headers: Record<string, unknown>) {
        return ResponseUtility.Ok(headers);
    }
}
