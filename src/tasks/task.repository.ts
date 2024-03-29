import { getTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(
            filterDto: getTaskFilterDTO,
            user:User,
        ): Promise<Task[]> {
        const {status, search} = filterDto; 
        const query = this.createQueryBuilder('task');
        
        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }

        const tasks = await query.getMany();
        return tasks;
    }
 
    async createTask(
        createTaskDto: CreateTaskDTO,
        user: User,
        ): Promise<Task> {
        const {title, description} = createTaskDto;
        console.log(user)
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        
        // delete task.user;
            
        return task;
    }

    deleteTask(
    ){

    }
}