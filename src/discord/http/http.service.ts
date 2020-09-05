import { Injectable, HttpService, Inject } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  DiscordModuleConfig,
  DISCORD_MODULE_CONFIG,
} from '../interfaces/DiscordModuleConfig';

@Injectable()
export class HttpClient {
  constructor(
    private httpService: HttpService,
    @Inject(DISCORD_MODULE_CONFIG) private config: DiscordModuleConfig
  ) {}

  post(path: string, data: any): Observable<any> {
    return this.httpService
      .post('https://discord.com/api/' + path, data, {
        headers: { Authorization: 'Bot ' + this.config.token },
      })
      .pipe(map((res) => res.data));
  }

  patch(path: string, data: any): Observable<any> {
    return this.httpService
      .patch('https://discord.com/api/' + path, data, {
        headers: {
          Authorization: 'Bot ' + this.config.token,
        },
      })
      .pipe(map((res) => res.data));
  }
}
