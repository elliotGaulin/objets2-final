export default class Temperature {
    constructor(
        public id: number | undefined,
        public temperature: number,
        public humidity: number,
        public date: Date
    ) { }
}