const UserModel = require('../models/users')
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');

/**
 * User
 * @class
 */

class User {
    constructor(app, connect) {
        this.app = app
        this.UserModel = connect.model('User', UserModel)

        this.get_users()
        this.get_user()
        this.create_user()
        this.update_user()
        this.delete_user()
        this.login()
    }

    /**
     * Récupérer tous les utilisateurs
     * @Endpoint : /v1/users
     * @Method : GET
     */
    get_users() {
        this.app.get('/v1/users', (req, res) => {
            try {
                this.UserModel.find({}, function(err, users) {
                    res.status(200).json(
                        { 
                            users: users, 
                        }
                    )
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    
    
    /**
     * Récupérer les données d'un utilisateur
     * @Endpoint : /v1/users/{id}
     * @Method : GET
     */
    get_user() {
        this.app.get('/v1/users/:id', (req, res) => {
            try {
                this.UserModel.findById(req.params.id).then(user => {
                    if(user){
                        res.status(200).json(
                            { 
                                user: user, 
                            }
                        )
                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                    
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    
    
    /**
     * Créer un utilisateur
     * @Endpoint : /v1/users/create
     * @Method : POST
     */
    create_user() {
        this.app.post('/v1/users/create', (req, res) => {
            try {
                if((req.body.email && req.body.email !== '') && (req.body.name && req.body.name !== '') && (req.body.password && req.body.password !== '')){
                    const userModel = new this.UserModel(req.body)
                    const sha_pass = sha256( req.body.password );

                    this.UserModel.findOne({ email: req.body.email }, function(err, user) {
                        if (user) {
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "email already exist",
                                    } 
                                }
                            ) 
                        } else {
                            userModel.save({password: sha_pass, name: req.body.name, email: req.body.email}).then(user => {
                                res.status(201).json(
                                    { 
                                        user: user, 
                                    }
                                )
                            }).catch(err => {
                                res.status(400).json(
                                    { 
                                        error: {
                                            status: 400,
                                            message: "error",
                                        } 
                                    }
                                ) 
                            })
                        }
                    }); 
                }else{
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "error",
                            } 
                        }
                    ) 
                }
                 
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }

    
    /**
     * Editer un utilisateur
     * @Endpoint : /v1/users/{id}/update
     * @Method : PUT
     */
    update_user() {
        this.app.put('/v1/users/:id/update', (req, res) => {
            try {
                this.UserModel.findByIdAndUpdate(req.params.id, req.body).then(user => {
                    if(user){
                        res.status(201).json(
                            { 
                                user: user, 
                            }
                        )
                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Supprimer un utilisateur
     * @Endpoint : /v1/users/{id}/delete
     * @Method : DELETE
     */
    delete_user() {
        this.app.delete('/v1/users/:id/delete', (req, res) => {
            try {
                this.UserModel.findByIdAndDelete(req.params.id).then(user => {
                    res.status(200).json(
                        { 
                            success: {
                                status: 200,
                                message: "successfully deleted",
                            }
                        }
                    )
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    

    /**
     * Connecter un user
     * @Endpoint : /v1/users/login
     * @Method : POST
     */
    login() {
        this.app.post('/v1/users/login', (req, res) => {
            try {
                this.UserModel.findOne({"email": req.body.email, "password": req.body.password})
                .then(user => {
                    if(user) { 
                        jwt.sign({email: req.body.email}, 'shhhhh', {expiresIn: '6h'}, (err, token) => {
                            if(err) {
                                res.status(400).json({ error: { status: 400, message: "Error",} })
                            } else {
                                res.status(200).json({ success: {status: 200, message: 'Success', token: token, user} });
                            }
                        })
                    }else{
                        res.status(400).json({ error: { status: 400, message: "Empty",} })
                    } 
                })
                .catch(err => {
                    res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
                })
                      
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
}

module.exports = User