import Intrusion from "../Entities/intrusion.entity";

/**
 * Service de gestion des intrusions
 */
export default class IntrusionService {
    /**
     * Trouve toutes les intrusions en ordre de date décroissante
     * @returns Toutes les intrusions en ordre de date décroissante
     * @throws Error si la requête échoue
     */
    public static async getAll(): Promise<Intrusion[]> {
        const response = await fetch(process.env.REACT_APP_BASE_API_URL! + "/intrusion")
        const json = await response.json();
        if (!response.ok) {
            console.log(response)
            console.log(json);
            throw new Error(json.message ?? response.statusText)
        }
        return json as Intrusion[];
    }
}