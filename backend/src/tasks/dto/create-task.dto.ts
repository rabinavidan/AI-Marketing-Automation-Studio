import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from '../../common/enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @IsOptional()
  @IsIn(TASK_STATUS_VALUES)
  status?: string;

  @IsOptional()
  @IsIn(TASK_PRIORITY_VALUES)
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
