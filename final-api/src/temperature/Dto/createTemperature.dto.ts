/**
 * Data transfer object (DTO) avec les propriétés à envoyer lors de la création d'une température
 */
export default class CreateTemperatureDto {
    temperature: number;
    humidity: number;
    date: Date;
}