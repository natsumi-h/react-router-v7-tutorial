#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute
mkdir -p ./.amplify-hosting/static

# バックエンドのビルド結果をコピー
cp -r ./build/server ./.amplify-hosting/compute/default

# フロントエンドのビルド結果をコピー
cp -r ./build/client ./.amplify-hosting/static/

# node_modulesをコピー
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# deploy-manifest.jsonをコピー
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

# ファイル構造を確認（デバッグ用）
echo "Listing .amplify-hosting/compute/default directory:"
ls -la ./.amplify-hosting/compute/default/

echo "Listing .amplify-hosting/static directory:"
ls -la ./.amplify-hosting/static/

echo "Listing .amplify-hosting/static/assets directory (if exists):"
if [ -d "./.amplify-hosting/static/assets" ]; then
  ls -la ./.amplify-hosting/static/assets/
else
  echo "assets directory does not exist"
fi