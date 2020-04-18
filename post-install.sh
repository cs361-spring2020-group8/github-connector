#!/bin/bash

rm -rf dist && \
npm install --prefix back-end && \
npm install --prefix front-end && \
npm run build --prefix front-end && \
mv front-end/build dist