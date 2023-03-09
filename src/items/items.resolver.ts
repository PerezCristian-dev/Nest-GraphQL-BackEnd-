import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { RemoveType } from './types/remove.type';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return await this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'getItems' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'getItem' })
  findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput):Promise<Item> {
    return await this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  async removeItem(@Args('id', { type: () => ID, nullable: true}) id: string):Promise<Item> {
    return await this.itemsService.remove(id);
  }
}
