# Dos.Zone cross-platform application

[Try it](https://dos.zone)

## Development

```
yarn start
```

## Web deployment

```
yarn build
cd build
aws s3 sync . s3://dos.zone --delete
```

## Android deployment 

```
yarn build
./node_modules/.bin/cap copy android
```

## Assembling Backend

```
cd sls
sls deploy
```

