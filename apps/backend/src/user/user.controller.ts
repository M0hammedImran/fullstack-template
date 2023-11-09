import { Controller, Delete, Get, Inject, Param, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './entities';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('user')
export class UserController {
    @Inject()
    private readonly userService: UserService;

    @Get()
    @ApiResponse({ type: User, isArray: true })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiResponse({ type: User })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(Number(id));
    }

    @Patch(':id')
    @ApiResponse({ type: User })
    update(@Param('id') id: string) {
        return this.userService.update(Number(id));
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(Number(id));
    }
}
