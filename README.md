# bc-ipfs
A generic ipfs client to talk to different blockchain e.g. ethereum, etc. via plugins and modules.
The purpose for this started to simply provide a module to integrate with blockchain for any IPFS
related applications. Block chain is not limited to Ethereum, but also refer to others if applicable
in the sense to integrate with IPFS.

# How to Build and Run
To build the docker images locally, run the following 2 in sequence.
```
./build-alpine-go-node.sh
./build.sh
```

To run the image `bc-ipfs`, just invoke `run.sh`
```
./run.sh
```
or to kick off the dev image `bc-ipfs-dev`, just invoke `run-dev.sh`.
```
run-dev.sh
```
This kicks off a container that `mount` the directory `bc-ipfs-example`
into the container if you want to dynamically make changes and verify
it from the browser directly without re-building a release image. This
is designed for development and convinience. However, this expose a risk
since you may be installing random libraries and npm modules into the container
and running them. Make sure your container is not being exploited and
ensure you are only running the container as a non-privilege user.
e.g. `USER $IPFS_UID` when you launch the container. This is the default
user created along with the image.

Within the container, invoke the following command:
* `npm` installation
```
cd bc-ipfs-example
npm install
```
* `ipfs` init and start
```
ipfs init
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
# See https://github.com/ipfs/js-ipfs-api#cors for more refining policies on
# acceptable URLs (CORS = Cross Origin Resource Sharing)
# The following policy creates SECURITY BREACH!!!!!!!!!!
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs daemon &
```
* `npm` start to kick off webpack and react, etc. and open your browser to access
`localhost:3000`.
```
npm start
```
