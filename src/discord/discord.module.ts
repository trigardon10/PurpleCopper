import { Module, DynamicModule } from '@nestjs/common';
import { DiscordService } from './discord.service';
import {
  DiscordModuleConfig,
  DISCORD_MODULE_CONFIG,
} from './interfaces/DiscordModuleConfig';
import { HttpClient } from './http/http.service';
import { WsService } from './ws/ws.service';

@Module({})
export class DiscordModule {
  static forRoot(config: DiscordModuleConfig): DynamicModule {
    return {
      module: DiscordModule,
      providers: [
        DiscordService,
        { provide: DISCORD_MODULE_CONFIG, useValue: config },
        HttpClient,
        WsService,
      ],
      exports: [DiscordService],
    };
  }
}
