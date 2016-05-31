#!/bin/bash
set -e

echo "DEPLOYING TO PRODUCTION! ARE YOU SURE? (Press Ctrl-C to cancel)"
#sleep 10

rm build/* -rf

webpack

cd build

git add .
git commit -m "Deploy to openscope.github.io"

git push
