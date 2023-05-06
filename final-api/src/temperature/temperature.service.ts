import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Temperature } from './Entity/temperature.entity';
import { Repository } from 'typeorm';
import CreateTemperatureDto from './Dto/createTemperature.dto';
import { Cron } from '@nestjs/schedule';

/**
 * Service de gestion des temperatures
 */
@Injectable()
export class TemperatureService {
    constructor(
        @InjectRepository(Temperature)
        private readonly temperatureRepository: Repository<Temperature>,
    ) { }

    /**
     * Trouve toutes les temperatures en ordre de date décroissante
     * @returns Toutes les temperatures en ordre de date décroissante
     */
    async findAll(): Promise<Temperature[]> {
        return await this.temperatureRepository.find({
            order: {
                date: "DESC"
            }
        });
    }

    /**
     * Insère une temperature
     * @param temperature 
     * @returns 
     */
    async create(temperature: CreateTemperatureDto): Promise<Temperature> {
        return this.temperatureRepository.save(temperature);
    }

    /**
     * Insère plusieurs temperatures en une seule requête
     * @param temperatures Un tableau de données à insérer
     * @returns 
     */
    async createBulk(temperatures: CreateTemperatureDto[]): Promise<Temperature[]> {
        return this.temperatureRepository.save(temperatures);
    }

    /**
     * Supprime les données de plus de 7 jours pour éviter d'avoir trop de données
     */
    @Cron('0 0 0 * * *')
    async deleteOld(): Promise<void> {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        await this.temperatureRepository.delete({
            date: date
        });
    }
}
