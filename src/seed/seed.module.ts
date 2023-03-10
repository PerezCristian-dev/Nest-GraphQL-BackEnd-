import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SeedResolver, SeedService],
  imports:[ConfigModule]
})
export class SeedModule {}
