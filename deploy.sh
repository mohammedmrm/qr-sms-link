#!/bin/bash

function die {
    echo $*
    exit 1
}

STAGE="$1"

if [ -z "${STAGE}" ]
then
    die "Missing required argument stage: test|staging|prod"
fi


if [ ${STAGE} == test ] ; then
    DEST=root@store.almalkexpress.com:/var/www/html/qr
elif [ ${STAGE} == prod ] ; then
    DEST=root@store.almalkexpress.com:/var/www/html/qr
else
    die unknown stage ${STAGE}
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use v20

npm_version=$(npm -v)
# Get the first 2 numbers of the npm version
first_two_numbers=$(echo "$npm_version" | cut -d. -f1,2)

desired_version="10.5"

if [[ "$first_two_numbers" != "$desired_version" ]]; then
    die "npm 8.19 is required"
fi

npm i || die "npm i failed"
npm run build:${STAGE} || die "build failed"

rsync -avz --delete dist/ ${DEST} || die "rsync failed"

if [ -z "$(git status --porcelain)" ] ; then

    git tag -a -m "deploy on ${STAGE} made by $(git config user.name)/$(git config user.email)" deploy-${STAGE}-$(date +%Y-%m-%d-%H-%M)
    git push origin $(git tag)

else

    die "deploy complete. Cannot tag thought, due to uncommitted changes"

fi
