#!/bin/bash

TMP_DIR_PREFIX="_tmp_build_minimirror_";
TMP_DIR_NAME=$(date '+%Y%m%d_%H%M%S');
REPOSITORY_URL="https://github.com/tomk79/mini-mirror.git";
BRANCH_NAME=$1;
if [ ! $1 ]; then
    BRANCH_NAME="develop";
fi

echo "-------------------------";
echo "build Start!";
echo $(date '+%Y/%m/%d %H:%M:%S');

mkdir ~/${TMP_DIR_PREFIX}${TMP_DIR_NAME};
cd ~/${TMP_DIR_PREFIX}${TMP_DIR_NAME}/;
git clone -b ${BRANCH_NAME} ${REPOSITORY_URL} ./;
git submodule update --init --recursive --force;
composer install;
npm install;
#gulp;
npm run build;

echo "-------------------------";
echo "build completed!";
echo $(date '+%Y/%m/%d %H:%M:%S');
echo "-------------------------";
exit;
