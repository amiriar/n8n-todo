import { Module } from '@nestjs/common';
import { TodosService } from './admin-todos.service';
import { TodosController } from './admin-todos.controller';
import { DocumentTodoPersistenceModule } from './inferastructure/persistence/document/document-persistence.module';
import { FilesModule } from '../../files/files.module';

const infrastructurePersistenceModule = DocumentTodoPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class AdminTodosModule {}
