import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilterTodoDto, SortTodoDto } from './dto/query-todo.dto';
import { TodoRepository } from './inferastructure/persistence/todo.repository';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { NullableType } from '../../utils/types/nullable.type';
import { Todo } from '../../todos/domain/todo';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodoRepository) {}

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterTodoDto | null;
    sortOptions?: SortTodoDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Todo[]> {
    return this.todosRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      userId,
    });
  }

  async findById(id: Todo['id']): Promise<NullableType<Todo>> {
    return await this.todosRepository.findById(id);
  }

  async remove(id: Todo['id']): Promise<boolean> {
    return await this.todosRepository.remove(id);
  }
}
