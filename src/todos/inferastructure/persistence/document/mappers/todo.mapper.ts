import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { Todo } from '../../../../domain/todo';
import { TodoSchemaClass } from '../entities/todo.schema';

export class TodoMapper {
  static toDomain(raw: TodoSchemaClass): Todo {
    const domainEntity = new Todo();
    domainEntity.id = raw._id.toString();
    domainEntity.title = raw.title;
    if (raw.description) domainEntity.description = raw.description;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    } else if (raw.photo === null) {
      domainEntity.photo = null;
    }

    domainEntity.userId = raw.userId;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Todo): TodoSchemaClass {
    let photo: FileSchemaClass | undefined = undefined;

    if (domainEntity.photo) {
      photo = new FileSchemaClass();
      photo._id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    }

    const persistenceSchema = new TodoSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.title = domainEntity.title;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.photo = photo;
    persistenceSchema.userId = domainEntity.userId;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
