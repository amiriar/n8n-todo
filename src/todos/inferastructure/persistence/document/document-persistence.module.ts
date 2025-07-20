import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosDocumentRepository } from './repositories/todo.repository';
import { TodoRepository } from '../todo.repository';
import { TodoSchema, TodoSchemaClass } from './entities/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoSchemaClass.name, schema: TodoSchema },
    ]),
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
