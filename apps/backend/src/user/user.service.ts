import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    @InjectRepository(User) readonly userRepository: Repository<User>;

    create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);

        return this.userRepository.save(user);
    }

    findAll() {
        return this.userRepository.find({});
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
