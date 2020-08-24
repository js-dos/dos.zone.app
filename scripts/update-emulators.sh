#!/bin/bash

yarn add emulators emulators-ui js-dos@beta
rm -rf public/js-dos/*
cp -r node_modules/js-dos/dist/* public/js-dos/
cp -r node_modules/emulators/dist/wlibzip* public/js-dos/
