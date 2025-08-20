import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { GetUserProvider } from './providers/get-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider, GetUserProvider],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
