import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [TypeOrmModule.forFeature([Item])],
})
export class ItemsModule {}
