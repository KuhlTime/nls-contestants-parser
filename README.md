# nls-contestants-parser

Data attribution: [nuerburgring-langstrecken-serie.de](https://www.nuerburgring-langstrecken-serie.de/de/nls-teilnehmer-2022/)

## API Rate Limiter

Rate limiter is set to `100` request per `15 minutes`.

## Routes

- `/`: Returns all data as an JSON array of objects
- `/classes`: Returns a sorted JSON array of all classes
  - `/classes/count`: Returns the number of contenders in each class
- `/cars`: Returns a sorted JSON array of all car names
  - `/cars/count`: Returns the number of contenders that drive the same car
- `/drivers`: Returns an array of all driver names
  - `/drivers/count`: Returns the number of contenders
- `/teams`: Returns an array of all team names (CAREFUL: Not all cars belong to a team!)
  - `/teams/count`: Return the number of teams there are

## Caching

In order to reduce stress on the original website the data is cached locally and only updated every `8 hours`
