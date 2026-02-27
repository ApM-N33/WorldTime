export class API_ENDPOINTS {
  static timezones = "/db/timezones.json"
  static isocountries = "/db/isocountries.json"
  static currency = (iSOCode: string) =>
    `https://restcountries.com/v3.1/alpha/${iSOCode}`
}
