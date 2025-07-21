import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TodoMapper } from '../mappers/todo.mapper';
import { TodoRepository } from '../../todo.repository';
import { TodoSchemaClass } from '../entities/todo.schema';
import { FilterTodoDto, SortTodoDto } from '../../../../dto/query-todo.dto';
import { UsersService } from '../../../../../../users/users.service';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Todo } from '../../../../../../todos/domain/todo';

@Injectable()
export class TodosDocumentRepository implements TodoRepository {
  constructor(
    @InjectModel(TodoSchemaClass.name)
    private readonly TodosModel: Model<TodoSchemaClass>,
    private readonly userService: UsersService,
  ) {}

  async findManyWithPagination({
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
    const where: FilterQuery<TodoSchemaClass> = {};

    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    where.userId = userId;

    // Handle sorting
    const sort: Record<string, 1 | -1> = {};
    if (sortOptions?.length) {
      for (const s of sortOptions) {
        sort[s.orderBy === 'id' ? '_id' : s.orderBy] =
          s.order.toUpperCase() === 'ASC' ? 1 : -1;
      }
    }

    // Query
    const todoDocs = await this.TodosModel.find(where)
      .sort(sort)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return todoDocs.map((doc) => TodoMapper.toDomain(doc));
  }

  async findById(id: Todo['id']): Promise<NullableType<Todo>> {
    const TodoObject = await this.TodosModel.findById(id);
    return TodoObject ? TodoMapper.toDomain(TodoObject) : null;
  }

  async findByIds(ids: Todo['id'][]): Promise<Todo[]> {
    const TodoObjects = await this.TodosModel.find({ _id: { $in: ids } });
    return TodoObjects.map((TodoObject) => TodoMapper.toDomain(TodoObject));
  }

  async remove(id: Todo['id']): Promise<boolean> {
    await this.TodosModel.deleteOne({
      _id: id.toString(),
    });

    return true;
  }
}
