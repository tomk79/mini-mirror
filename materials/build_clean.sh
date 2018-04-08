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
echo "temporary dir = ~/${TMP_DIR_PREFIX}${TMP_DIR_NAME}/"
echo "repository = ${REPOSITORY_URL}"
echo "branch name = ${BRANCH_NAME}"
echo $(date '+%Y/%m/%d %H:%M:%S');

sleep 1s; echo ""; echo "=-=-=-=-=-=-=-=-=-= making build directory";
mkdir ~/${TMP_DIR_PREFIX}${TMP_DIR_NAME};
cd ~/${TMP_DIR_PREFIX}${TMP_DIR_NAME}/;
pwd

sleep 1s; echo ""; echo "=-=-=-=-=-=-=-=-=-= git clone";
git clone --depth 1 -b ${BRANCH_NAME} ${REPOSITORY_URL} ./;
git submodule update --init --recursive --force;

sleep 1s; echo ""; echo "=-=-=-=-=-=-=-=-=-= npm install";
npm install;

sleep 1s; echo ""; echo "=-=-=-=-=-=-=-=-=-= npm run build";
npm run build;

sleep 1s; echo "";
sleep 1s; echo "";
sleep 1s; echo "";
echo "-------------------------";
echo "build completed!";
pwd
echo $(date '+%Y/%m/%d %H:%M:%S');
echo "-------------------------";
exit;
