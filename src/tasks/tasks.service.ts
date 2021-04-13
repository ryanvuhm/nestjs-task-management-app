import { Injectable, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    async getTasks(filterDto:getTaskFilterDTO): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }
    
    async getTaskByID(@Param('id', ParseIntPipe) id:number): Promise<Task> {
            const found = await this.taskRepository.findOne(id);

            if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
            }
            return found;
        }
    // getTaskID(id: string): Task {
    //     const found =  this.tasks.find(task => task.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" not found`);
    //     }
    //     return found;
    // }

    // createTask(CreateTaskDTO: CreateTaskDTO): Task {

    //     const {title, description} = CreateTaskDTO;

    //     const task: Task = {
    //         id: uuidv4(),
    //         title,
    //         description, 
    //         status: TaskStatus.OPEN,
    //     };
    //     // push the task to the array Task above
    //     this.tasks.push(task);
    //     return task;
    // }
    async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    // deleteTask(id: string): void {
    //     const found = this.getTaskID(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }

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

    // updateTaskStatus(id:string, status: TaskStatus): Task {
    //     const task = this.getTaskID(id);
    //     task.status = status;
    //     return task;
    // }
}
