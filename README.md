# Dos.Zone cross-platform application

[Try it](https://dos.zone)

## Assembling Frontend

```
dz db eject

yarn build
./node_modules/.bin/cap copy android
cd build
aws s3 sync . s3://dos.zone --delete
```

## Assembling Backend

```
cd sls
sls deploy
```

