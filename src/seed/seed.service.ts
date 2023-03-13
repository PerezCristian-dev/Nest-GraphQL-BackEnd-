import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import { ItemsService } from '../items/items.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async execute(): Promise<boolean> {
    await this.deleteDB();
    const user = await this.createUsers();
    await this.createItems(user);
    return true;
  }

  async deleteDB() {
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  async createUsers(): Promise<User> {
    const users = [];

    for (let user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }
  async createItems(user: User) {
    const items = [];

    for (let item of SEED_ITEMS) {
      items.push(await this.itemsService.create(item, user));
    }

    await Promise.all(items);
  }
}
