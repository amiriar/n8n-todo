import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './domain/todo';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Request } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Todos')
@Controller({
  path: 'todo',
  version: '1',
})
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @ApiCreatedResponse({
    type: Todo,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.id);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Todo),
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryTodoDto,
    @Req() req: Request,
  ): Promise<InfinityPaginationResponseDto<Todo>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.todoService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: { page, limit },
        userId: req.user.id,
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Todo,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Todo['id']): Promise<NullableType<Todo>> {
    return this.todoService.findById(id);
  }

  @ApiOkResponse({
    type: Todo,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Todo['id'],
    @Body() updateProfileDto: UpdateTodoDto,
  ): Promise<Todo | null> {
    return this.todoService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Todo['id']): Promise<void> {
    return this.todoService.remove(id);
  }
}
