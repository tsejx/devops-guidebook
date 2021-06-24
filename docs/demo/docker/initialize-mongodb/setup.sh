#!/bin/bash
mongo <<EOF
use admin;
db.createUser({ user: 'root', pwd: '123456', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });

use new_db;
db.createCollection("collection1");
db.createCollection("collection2");
EOF

mongoimport --db new_db --collection collection1 --file $WORKSPACE/xxx1.json
mongoimport --db new_db --collection collection2 --file $WORKSPACE/xxx2.json