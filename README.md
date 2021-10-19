# Arhived, this repository was splitted in multiple projects.

Projects: https://github.com/js-dos/

## Dos.Zone cross-platform application

[Try it](https://dos.zone)

## Development

```
yarn start
```

## Web deployment

```
cd build
PUBLIC_URL=/app yarn build && aws s3 sync . s3://dos.zone/app --delete
```

## Android deployment 

```
yarn build && ./node_modules/.bin/cap copy android
```

## Assembling Backend

```
cd sls
sls deploy
```

