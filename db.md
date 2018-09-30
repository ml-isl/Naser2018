# Create Admin

```mongodb
use admin
db.createUser( { user: "user1",
                 pwd: "P@$$w0rd",
                "roles" : [
                            {
                                "role" : "root",
                                "db" : "admin"
                            }
                          ]
                } )
```