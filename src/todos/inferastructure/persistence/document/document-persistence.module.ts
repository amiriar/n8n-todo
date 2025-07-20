import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosDocumentRepository } from './repositories/todo.repository';
import { TodoRepository } from '../todo.repository';
import { TodoSchema, TodoSchemaClass } from './entities/todo.schema';
import { UserRepository } from '../../../../users/infrastructure/persistence/user.repository';
import { UsersDocumentRepository } from '../../../../users/infrastructure/persistence/document/repositories/user.repository';
import {
  UserSchema,
  UserSchemaClass,
} from '../../../../users/infrastructure/persistence/document/entities/user.schema';
import { UsersService } from '../../../../users/users.service';
import { UsersModule } from '../../../../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoSchemaClass.name, schema: TodoSchema },
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  providers: [
    {
      provide: TodoRepository,
      useClass: TodosDocumentRepository,
    },
  ],
  exports: [TodoRepository],
})
export class DocumentTodoPersistenceModule {}
