import Temperature from "../Entities/temperature.entity";

/**
 * Service de gestion des temperatures
 */
export default class TemperatureService {

    /**
     * Trouve toutes les temperatures en ordre de date décroissante
     * @returns Toutes les temperatures en ordre de date décroissante
     */
    public static async getAll(): Promise<Temperature[]> {
        const response = await fetch(process.env.REACT_APP_BASE_API_URL! + "/temperature")
        const json = await response.json();
        if (!response.ok) {
            console.log(response)
            console.log(json);
            throw new Error(json.message ?? response.statusText)
        }
        return json as Temperature[];
    }
}