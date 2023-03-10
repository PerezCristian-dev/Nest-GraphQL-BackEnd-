import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(private readonly configService: ConfigService) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async execute(): Promise<true> {
    return true;
  }
}
