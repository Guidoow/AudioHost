#!/bin/bash
set -e


detached_replica_initiate() {

  # wait for mongo instances to restart and initialize correctly
  sleep 22

  echo "
        Initializing MONGO REPL...
       "

  mongosh -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} --eval "
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: '${DATABASE_CONTAINER_NAME}:27017' },
      { _id: 1, host: '${DATABASE_REPL_CONTAINER_NAME}:27017' }
    ]
  });
"

}

detached_replica_initiate &