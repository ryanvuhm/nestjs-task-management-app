import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO {

    @IsString()
    @MinLength(4)
    @MaxLength(20 , {message:'too long dude'})
    username: string;

    nickname: string;

    @IsString()
    @MaxLength(20)
    // @Matches()
    password: string;

}