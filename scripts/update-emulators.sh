#!/bin/bash

yarn add js-dos@beta emulators
rm -rf public/js-dos/*
cp -r node_modules/js-dos/dist/* public/js-dos/
cp -r node_modules/emulators/dist/wlibzip* public/js-dos/
