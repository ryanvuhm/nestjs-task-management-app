import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    // Create  a GET request method
    @Get()
    getTasks(@Query() filterDto: getTaskFilterDTO) {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskID( @Param('id') id: number): Promise<Task> {
        return this.tasksService.getTaskByID(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() CreateTaskDTO: CreateTaskDTO
    ): Promise<Task> {
       return this.tasksService.createTask(CreateTaskDTO);
    }

    @Delete('/:id')
    deleteTask( @Param("id") id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }
    


    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
