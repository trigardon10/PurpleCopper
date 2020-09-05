import { Injectable, Inject } from '@nestjs/common';
import { Subject, interval, Observable } from 'rxjs';
import {
  DiscordModuleConfig,
  DISCORD_MODULE_CONFIG,
} from '../interfaces/DiscordModuleConfig';
import ws from 'ws';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class WsService {
  websocket: ws;
  connected: Promise<void>;
  events = new Subject<{ t: string; d: any }>();

  constructor(
    @Inject(DISCORD_MODULE_CONFIG) private config: DiscordModuleConfig
  ) {}

  connect() {
    this.websocket = new ws('wss://gateway.discord.gg/?v=6&encoding=json');

    this.websocket.on('open', () => {
      return;
    });
    this.websocket.on('message', (mes) => this.handleMessage(mes));
    this.websocket.on('close', (code, desc) => console.log(desc));
    this.websocket.on('error', (_) => console.log('WS error'));
  }

  private handleMessage(message: any) {
    console.log('DATA:', message);
    const data = JSON.parse(message.utf8Data);

    let seq = 0;

    if (data.op === 10) {
      interval(data.d.heartbeat_interval).subscribe((_) =>
        this.websocket.send(JSON.stringify({ op: 1, d: seq++ }))
      );
      this.websocket.send(
        JSON.stringify({
          op: 2,
          d: {
            token: this.config.token,
            properties: {
              $os: 'windows',
              $browser: 'my_library',
              $device: 'my_library',
            },
          },
        })
      );
    }

    if (data.op === 0) {
      this.events.next(data);
    }
  }

  on(event: string): Observable<any> {
    return this.events.pipe(
      filter((ev) => ev.t === event),
      map((ev) => ev.d)
    );
  }
}
