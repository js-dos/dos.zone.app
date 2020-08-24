# Dos.Zone cross-platform application

[Try it](https://dos.zone)

## Assembling App

yarn build
./node_modules/.bin/cap copy android
cd build
aws s3 sync . s3://dos.zone
