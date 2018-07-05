#!/bin/bash -x

DEBUG=${DEBUG:-"false"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

# Build base alpine-node:latest image
$build_cmd \
  --rm \
  -t ipfs-dev \
  --file Dockerfile \
  .
