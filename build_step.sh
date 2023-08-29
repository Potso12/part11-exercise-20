#!/bin/bash

echo "Build script"


npm install
cd blog-frontend
npm run build

echo "Build ready"
