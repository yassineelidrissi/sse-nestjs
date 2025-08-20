import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserProvider {

    private readonly logger = new Logger(CreateUserProvider.name);
    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}


    public async createUser(createUserDto: CreateUserDto) {

        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        try {
            const user = this.userRepository.create({
                fullName: createUserDto.fullName,
                email: createUserDto.email
            });

            const savedUser = await this.userRepository.save(user);
            this.logger.log(`User created successfully with ID: ${savedUser.id}`);

            return savedUser;

        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            throw error;
        }

    }



}
