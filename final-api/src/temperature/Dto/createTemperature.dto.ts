import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

/**
 * Data transfer object (DTO) avec les propriétés à envoyer lors de la création d'une température
 */
export default class CreateTemperatureDto {
    @IsNumber()
    temperature: number;
    @IsNumber()
    humidity: number;
}