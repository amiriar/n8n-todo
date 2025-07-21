import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './domain/todo';
import { FileType } from '../files/domain/file';
import { FilterTodoDto, SortTodoDto } from './dto/query-todo.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoRepository } from './inferastructure/persistence/todo.repository';
import { title } from 'process';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodoRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    // Do not remove comment below.
    // <creating-property />

    let photo: FileType | null | undefined = undefined;

    if (createTodoDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createTodoDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createTodoDto.photo === null) {
      photo = null;
    }
    return this.todosRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      photo,
      title: createTodoDto.title,
      description: createTodoDto.description ?? '',
      userId,
    });
  }

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

  findById(id: Todo['id']): Promise<NullableType<Todo>> {
    return this.todosRepository.findById(id);
  }

  findByIds(ids: Todo['id'][]): Promise<Todo[]> {
    return this.todosRepository.findByIds(ids);
  }

  async update(
    id: Todo['id'],
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<Todo | null> {
    // Do not remove comment below.
    // <updating-property />

    const todo = await this.todosRepository.findById(id);
    if (!todo || todo.userId !== userId) throw new NotFoundException();

    let photo: FileType | null | undefined = undefined;

    if (updateTodoDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateTodoDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateTodoDto.photo === null) {
      photo = null;
    }

    return this.todosRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      title: updateTodoDto.title,
      description: updateTodoDto.description ?? '',
    });
  }

  async remove(id: Todo['id'], userId: string): Promise<void> {
    const todo = await this.todosRepository.findById(id);
    if (!todo || todo.userId !== userId) throw new NotFoundException();

    await this.todosRepository.remove(id);
  }
}
