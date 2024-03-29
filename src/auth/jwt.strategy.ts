import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userService: UserRepository,
        ) {
        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Presinexaka1',
        });
    }
    
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        console.log(payload);
        
        const user = await this.userService.findOne({ username });      
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }


}
