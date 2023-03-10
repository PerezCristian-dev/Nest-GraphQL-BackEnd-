import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User): Promise<Item[]> {
    //TODO: filtrar, paginas, por user, etc..
    const items = await this.itemsRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return items;
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!item) throw new NotFoundException(`Item with ${id} does not exist`);

    // item.user = user; --> use lazy property on entity better;

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user); //checking if items belongs to user in case fails won't continue;
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(` Item whit id: ${id} not found`);

    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
