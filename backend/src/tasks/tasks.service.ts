import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.workflowTask.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.workflowTask.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const task = await this.prisma.workflowTask.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`WorkflowTask with id ${id} not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.workflowTask.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto) {
    await this.findOne(id);
    return this.prisma.workflowTask.update({ where: { id }, data: { status: dto.status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.workflowTask.delete({ where: { id } });
  }
}
