import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { TemperatureService } from './temperature.service';
import CreateTemperatureDto from './Dto/createTemperature.dto';

@Controller('temperature')
export class TemperatureController {

    constructor(
        private readonly temperatureService: TemperatureService,
    ) { }


    /**
     * Trouve toutes les temperatures en ordre de date décroissante
     * @returns Toutes les temperatures en ordre de date décroissante
     */
    @Get()
    async findAll() {
        return this.temperatureService.findAll();
    }

    /**
     * Insère plusieurs temperatures en une seule requête
     * @param createTemperatureDtos les données à insérer
     * @returns 
     */
    @Post()
    async create(@Body(new ParseArrayPipe({ items: CreateTemperatureDto })) createTemperatureDtos: CreateTemperatureDto[]) {
        console.log(createTemperatureDtos);
        return this.temperatureService.createBulk(createTemperatureDtos);
    }
}
