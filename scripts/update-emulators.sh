#!/bin/bash

yarn add emulators
rm -rf public/emulators/*
cp -r node_modules/emulators/dist/* public/emulators/
