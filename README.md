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

## Caching

In order to reduce stress on the original website the data is cached locally and only updated every `8 hours`
