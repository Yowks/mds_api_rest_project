const PostModel = require('../models/posts')

/**
 * Post
 * @class
 */

class Post {
    constructor(app, connect) {
        this.app = app
        this.PostModel = connect.model('Post', PostModel)

        this.get_posts()
        this.get_post()
        this.create_post()
        this.update_post()
        this.delete_post()
    }

    /**
     * Récupérer tous les posts
     * @Endpoint : /v1/posts
     * @Method : GET
     */
    get_posts() {
        this.app.get('/v1/posts', (req, res) => {
            try {
                this.PostModel.find({}, function(err, posts) {
                    res.status(200).json(
                        { 
                            posts: posts, 
                            totalPosts: Object.keys(posts).length,
                        }
                    )
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    
    
    /**
     * Récupérer les données d'un post
     * @Endpoint : /v1/posts/{id}
     * @Method : GET
     */
    get_post() {
        this.app.get('/v1/posts/:id', (req, res) => {
            try {
                this.PostModel.findById(req.params.id).then(post => {
                    if(post){
                        res.status(200).json(
                            { 
                                post: post, 
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
     * Créer un post
     * @Endpoint : /v1/posts/create
     * @Method : POST
     */
    create_post() {
        this.app.post('/v1/posts/create', (req, res) => {
            try {
                if((req.body.title && req.body.title !== '') && (req.body.image && req.body.image !== '') && (req.body.content && req.body.content !== '')){
                    const postModel = new this.PostModel(req.body)
                    this.PostModel.findOne({ title: req.body.title }, function(err, post) {
                        if (post) {
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "post already exist",
                                    } 
                                }
                            ) 
                        } else {
                            postModel.save().then(post => {
                                res.status(201).json(
                                    { 
                                        post: post, 
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
     * Editer un post
     * @Endpoint : /v1/posts/{id}/update
     * @Method : PUT
     */
    update_post() {
        this.app.put('/v1/posts/:id/update', (req, res) => {
            try {
                this.PostModel.findByIdAndUpdate(req.params.id, req.body).then(post => {
                    if(post){
                        res.status(201).json(
                            { 
                                post: post, 
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
     * Supprimer un post
     * @Endpoint : /v1/posts/{id}/delete
     * @Method : DELETE
     */
    delete_post() {
        this.app.delete('/v1/posts/:id/delete', (req, res) => {
            try {
                this.PostModel.findByIdAndDelete(req.params.id).then(post => {
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
    
}

module.exports = Post