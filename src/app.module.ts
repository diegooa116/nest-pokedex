import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoinValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ //* Para variables de entorno
      load: [ EnvConfiguration ],
      validationSchema: JoinValidationSchema
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    MongooseModule.forRoot(process.env.MONGODB!,{
      dbName: 'pokemonsdb' //* Se puede agregar a una variable de entorno
    }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule { }
