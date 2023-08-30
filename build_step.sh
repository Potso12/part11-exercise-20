#!/bin/bash

echo "Build script"


npm install
cd bloglist-frontend
npm install
npm run build

echo "Build ready"
