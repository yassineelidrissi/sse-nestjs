import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(255)
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    @MinLength(96)
    email: string;
}