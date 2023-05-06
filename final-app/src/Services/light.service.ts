/**
 * Service pour la gestion de la lumière
 */
export default class LightService {

    /**
     * Défini l'état de la lumière
     * @param on l'état de la lumière
     */
    public static async setLight(on: boolean) {
        const response = await fetch(process.env.REACT_APP_BASE_API_URL! + "/light", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ on: on })
        })

        if (!response.ok) {
            console.log(response)
            throw new Error(response.statusText)
        }
    }
}