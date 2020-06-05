#!/bin/bash

yarn add emulators@latest emulators-ui@latest
rm -rf public/emulators/* public/emulators-ui/*
cp -r node_modules/emulators-ui/dist/* public/emulators-ui/
cp -r node_modules/emulators/dist/* public/emulators/
