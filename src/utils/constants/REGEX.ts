export class REG {
  static search = /^([a-z]*[-_]?[a-z]*[-_]?[a-z]*[,]?\s?){1,3}$/i
  static convert =
    /^(([0-1]|\d|[0-1]\d|[2][0-3]):?(\d|[0-5]\d)?|([0-1]|\d|[0-1]\d|[2][0-3])?:(\d|[0-5]\d))$/

  static commaToSlash = /(, )+/g
  static slashToCommaAndSpace = /[/]+/g
  static invalidChars = /[^a-z_-]/gi
}
