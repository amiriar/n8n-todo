import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Todo } from '../../../todos/domain/todo';

export class FilterTodoDto {
  @IsOptional()
  @ValidateNested({ each: true })
  title?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  userId?: string;
}

export class SortTodoDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Todo;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryTodoDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterTodoDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterTodoDto)
  filters?: FilterTodoDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortTodoDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortTodoDto)
  sort?: SortTodoDto[] | null;
}
