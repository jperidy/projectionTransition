db.createUser({
    user: "projectiontransition",
    pwd: 'je suis projection transition',
    roles: [{
        role: "readWrite",
        db: "projection-transition-db"
    }]
})