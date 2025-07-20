import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TodoMapper } from '../mappers/todo.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { TodoRepository } from '../../todo.repository';
import { TodoSchemaClass } from '../entities/todo.schema';
import { Todo } from '../../../../domain/todo';
import { FilterTodoDto, SortTodoDto } from '../../../../dto/query-todo.dto';
import { UsersService } from '../../../../../users/users.service';

@Injectable()
export class TodosDocumentRepository implements TodoRepository {
  constructor(
    @InjectModel(TodoSchemaClass.name)
    private readonly TodosModel: Model<TodoSchemaClass>,
    private readonly userService: UsersService,
  ) {}

  async create(data: Todo): Promise<Todo> {
    const persistenceModel = TodoMapper.toPersistence(data);
    const createdTodo = new this.TodosModel(persistenceModel);
    const TodoObject = await createdTodo.save();
    return TodoMapper.toDomain(TodoObject);
  }

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

  async update(id: Todo['id'], payload: Partial<Todo>): Promise<Todo | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const Todo = await this.TodosModel.findOne(filter);

    if (!Todo) {
      return null;
    }

    const TodoObject = await this.TodosModel.findOneAndUpdate(
      filter,
      TodoMapper.toPersistence({
        ...TodoMapper.toDomain(Todo),
        ...clonedPayload,
      }),
      { new: true },
    );

    return TodoObject ? TodoMapper.toDomain(TodoObject) : null;
  }

  async remove(id: Todo['id']): Promise<void> {
    await this.TodosModel.deleteOne({
      _id: id.toString(),
    });
  }
}
