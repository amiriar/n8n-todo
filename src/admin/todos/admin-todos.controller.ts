import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TodosService } from './admin-todos.service';

import { QueryTodoDto } from './dto/query-todo.dto';
import { Request } from 'express';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { NullableType } from '../../utils/types/nullable.type';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { Todo } from '../../todos/domain/todo';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Admin - Todos')
@Controller({
  path: 'admin/todo',
  version: '1',
})
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

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

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Todo['id']): Promise<boolean> {
    return this.todoService.remove(id);
  }
}
