import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}
    
    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void>{
        return this.userRepository.signUp(authCredentialsDTO);
    }

    async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise< {accessToken: string} > {
        const  username = await this.userRepository.validationUserPassword(authCredentialsDTO);

        if(!username) {
            throw new UnauthorizedException('Invalid credentials!');          
        }
        console.log(username);


        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        console.log(accessToken);
        console.log(payload);
        return { accessToken };
    }


}
