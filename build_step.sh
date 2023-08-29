#!/bin/bash

echo "Build script"


npm install
cd bloglist-frontend
npm run build

echo "Build ready"
