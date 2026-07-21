import { IsIn } from 'class-validator';
import { TASK_STATUS_VALUES } from '../../common/enums';

export class UpdateTaskStatusDto {
  @IsIn(TASK_STATUS_VALUES)
  status: string;
}
