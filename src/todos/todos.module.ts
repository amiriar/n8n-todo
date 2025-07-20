import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { FilesModule } from '../files/files.module';
import { DocumentTodoPersistenceModule } from './inferastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = DocumentTodoPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {}
