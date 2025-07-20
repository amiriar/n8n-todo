import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { IsOptional } from 'class-validator';

export type TodoSchemaDocument = HydratedDocument<TodoSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TodoSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  title: string | null;

  @Prop({
    type: String,
  })
  @IsOptional()
  description: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  photo?: FileSchemaClass | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(TodoSchemaClass);

TodoSchema.index({ 'role._id': 1 });
