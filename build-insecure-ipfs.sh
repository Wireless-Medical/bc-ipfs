#!/bin/bash -x

DEBUG=${DEBUG:-"false"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

# Build base alblockmed/alpine-node:latest image
$build_cmd \
  --rm \
  -t alblockmed/go-ipfs-insecure \
  --file Dockerfile.ipfs-insecure \
  .
