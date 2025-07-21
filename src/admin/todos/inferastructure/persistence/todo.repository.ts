import { Todo } from '../../../../todos/domain/todo';
import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { FilterTodoDto, SortTodoDto } from '../../dto/query-todo.dto';

export abstract class TodoRepository {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterTodoDto | null;
    sortOptions?: SortTodoDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Todo[]>;

  abstract findById(id: Todo['id']): Promise<NullableType<Todo>>;
  abstract findByIds(ids: Todo['id'][]): Promise<Todo[]>;
  abstract remove(id: Todo['id']): Promise<boolean>;
}
