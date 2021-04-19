import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt"
import { Task } from "src/tasks/task.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async signUp(authCredentialsDTO: AuthCredentialsDTO) {
        const { username, nickname ,password } = authCredentialsDTO;

        const user = new User();
        user.username = username;
        user.nickname = nickname;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        console.log(user.password);


        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('User name already exist!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validationUserPassword(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
        const {username, password} = authCredentialsDTO;
        const user = await this.findOne({username})

        if (user && await user.validationUserPassword(password)) {
            return user.username;
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
    

}