import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';

export class CreateTodoDto {
  @ApiProperty({ example: 'title', type: String })
  @IsNotEmpty()
  title: string | null;

  @ApiProperty({ example: 'description', type: String })
  @IsNotEmpty()
  description: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;
}
