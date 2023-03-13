import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ItemsService } from 'src/items/items.service';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports:[ConfigModule, UsersModule, ItemsModule]
})
export class SeedModule {}
