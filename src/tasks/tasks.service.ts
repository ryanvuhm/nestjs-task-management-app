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
    
    async getTaskByID(@Param('id', ParseIntPipe) id:number): Promise<Task> {
            const found = await this.taskRepository.findOne(id);

            if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
            }
            return found;
        }

    async createTask(
        createTaskDto: CreateTaskDTO,
        user: User,    
        ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    } 

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        // console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

    }

    async updateTaskStatus(id: number, status: TaskStatus) {
        const task = await this.getTaskByID(id);
        task.status = status;
        await task.save();
        return task;
    }

}
