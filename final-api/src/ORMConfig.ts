import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';
import { ConfigService } from '@nestjs/config';

type Entity = string | Function | EntitySchema<any>;

// Basé sur https://stackoverflow.com/questions/55717089/test-nestjs-service-against-actual-database
const ormConfig = (
    entities: Entity[],
    configService: ConfigService,
): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: entities,
    synchronize: true,
});

export default ormConfig;
