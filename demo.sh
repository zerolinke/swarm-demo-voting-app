# create manager node
docker-machine create -d virtualbox manager

# start consul server
eval $(docker-machine env manager)
docker run --restart always -d -p 8400:8400 -p 8500:8500 -p 53:53/udp -h consul-server-node --name consul progrium/consul -server -bootstrap

# start node-1 on env=prod and node-{2,3} on env=stage
docker-machine create -d virtualbox --engine-label env=prod --engine-opt "cluster-advertise=eth1:2376" --engine-opt "cluster-store=consul://`docker-machine ip manager`:8500" node-1
docker-machine create -d virtualbox --engine-label env=stage --engine-opt "cluster-advertise=eth1:2376" --engine-opt "cluster-store=consul://`docker-machine ip manager`:8500" node-2
docker-machine create -d virtualbox --engine-label env=stage --engine-opt "cluster-advertise=eth1:2376" --engine-opt "cluster-store=consul://`docker-machine ip manager`:8500" node-3

# start swarm manager

docker run -d -p 3376:3376 -t -v /var/lib/boot2docker:/certs:ro --name swarm --restart always dockerswarm/swarm:master --debug --experimental manage -H 0.0.0.0:3376 --engine-refresh-min-interval=1s --engine-refresh-max-interval=1s --engine-failure-retry=1 --tlsverify --tlscacert=/certs/ca.pem --tlscert=/certs/server.pem --tlskey=/certs/server-key.pem --discovery-opt=kv.path=docker/nodes "consul://`docker-machine ip manager`:8500"

# set env to talk to swarm
DOCKER_HOST=`docker-machine ip manager`:3376

docker pull alpine
docker pull redis:alpine
docker pull busybox
docker pull postgres:9.4
docker pull vieux/demo-worker
docker pull vieux/demo-vote
docker pull vieux/demo-result

echo 'eval $(docker-machine env manager)'
echo 'DOCKER_HOST=`docker-machine ip manager`:3376'

# TEST: 2 containers ping
#docker run -it --name c1 --net swarm -e constraint:node==node-1 alpine sh
#docker run -it --name c2 --net swarm -e constraint:node==node-2 alpine sh

# TEST: rescheduling
#docker-compose up -d
#open browsers
#docker-machine stop node-2

