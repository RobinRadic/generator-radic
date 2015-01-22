#!/bin/sh

sdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $sdir
cd ..
rdir=$PWD

git submodule add https://github.com/robinradic/shared-gh-pages _includes
#git submodule update --init --remote --force --recursive _includes
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
