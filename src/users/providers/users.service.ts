import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CreateUserProvider } from 'src/users/providers/create-user.provider';
import { GetUserProvider } from 'src/users/providers/get-user.provider';

@Injectable()
export class UsersService {

    constructor(
        private readonly createUserProvider: CreateUserProvider,
        private readonly getUserProvider: GetUserProvider
    ) {}


    public async createUser(createUserDto: CreateUserDto) {
        return await this.createUserProvider.createUser(createUserDto);
    }

    public async getUserById(userId: number) {
        return await this.getUserProvider.getUserById(userId);
    }


}
