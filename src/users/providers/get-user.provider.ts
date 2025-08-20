import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}


    public async getUserById(userId: number) {

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if(!user) throw new ConflictException('No user found with that ID ' + userId);

        return user;

    }

}
