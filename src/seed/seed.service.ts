import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios, { AxiosInstance } from 'axios';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }
  
  async executeSeed() {

    await this.pokemonModel.deleteMany({}); //! delete * from pokemon's;

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, pokemonNumber: number }[] = [];

    data.results.forEach(({ name, url }) => {

      const pokemonNumber = Number(url.split('/').at(-2));
      
      pokemonToInsert.push({name, pokemonNumber});
      
    });

    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed Executed';
  }

}


/* Forma de insertar múltiples datos de forma simultanea
async executeSeed() {

    await this.pokemonModel.deleteMany({}); //! delete * from pokemon's;
    
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const insertPromisesArray:Promise<Pokemon>[] = [];

    data.results.forEach(({ name, url }) => {

      const pokemonNumber = Number(url.split('/').at(-2));
      
      insertPromisesArray.push(
        this.pokemonModel.create({ name, pokemonNumber })
      );
      
    });

    await Promise.all( insertPromisesArray );

    return 'Seed Executed';
  }
*/
