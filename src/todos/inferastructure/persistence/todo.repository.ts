import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Todo } from '../../domain/todo';
import { FilterTodoDto, SortTodoDto } from '../../dto/query-todo.dto';
import { TodoDto } from '../../dto/todo.dto';

export abstract class TodoRepository {
  abstract create(
    data: Omit<TodoDto, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Todo>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTodoDto | null;
    sortOptions?: SortTodoDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Todo[]>;

  abstract findById(id: Todo['id']): Promise<NullableType<Todo>>;
  abstract findByIds(ids: Todo['id'][]): Promise<Todo[]>;

  abstract update(
    id: Todo['id'],
    payload: DeepPartial<Todo>,
  ): Promise<Todo | null>;

  abstract remove(id: Todo['id']): Promise<void>;
}
