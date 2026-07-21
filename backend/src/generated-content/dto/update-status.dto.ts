import { IsIn } from 'class-validator';
import { CONTENT_STATUS_VALUES } from '../../common/enums';

export class UpdateStatusDto {
  @IsIn(CONTENT_STATUS_VALUES)
  status: string;
}
