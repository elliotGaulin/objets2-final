import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureController } from './temperature/temperature.controller';
import { TemperatureService } from './temperature/temperature.service';
import { Temperature } from './temperature/Entity/temperature.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LightController } from './light/light.controller';
import { IntrusionController } from './intrusion/intrusion.controller';
import { IntrusionService } from './intrusion/intrusion.service';
import { Intrusion } from './intrusion/Entity/intrusion.entity';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Temperature, Intrusion]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Temperature, Intrusion],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController, TemperatureController, LightController, IntrusionController],
  providers: [AppService, TemperatureService, IntrusionService],
})
export class AppModule { }
