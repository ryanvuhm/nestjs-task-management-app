import { Injectable, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { getTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    // Return the array Task
    async getTasks(
            filterDto:getTaskFilterDTO,
            user: User,
        ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }
    
    async getTaskByID(
        id:number,
        user: User,
    ): Promise<Task> {
            const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

            if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
            }
            console.log(found)
            return found;
        }

    async createTask(
        createTaskDto: CreateTaskDTO,
        user: User,    
        ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    } 

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        console.log(result)
        // console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User) {
        const task = await this.getTaskByID(id, user);
        task.status = status;
        await task.save();
        return task;
    }

}
