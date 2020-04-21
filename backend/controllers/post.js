const PostModel = require('../models/post.js')

/**
 * Post
 * @class
 */
class Post {
  constructor (app, connect) {
    this.app = app
    this.PostModel = connect.model('Post', PostModel)

    this.create()
    this.show()
    this.list()
    this.delete()
    this.update()
  }

  /**
   * Show
   */
  show () {
    this.app.get('/post/:id', (req, res) => {
      try {
        this.PostModel.findById(req.params.id).then(post => {
          res.status(200).json(post || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }

  /** LIST ALL */
  list () {
    this.app.get('/posts', (req, res) => {
      try {
        this.PostModel.find({}, function(err, post) {
          res.status(200).json(
              { 
                posts: post, 
              }
          )
        });
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }

  /**
   * Delete
   */
  delete () {
    this.app.delete('/post/delete/:id', (req, res) => {
      try {
        this.PostModel.findByIdAndRemove(req.params.id).then(post => {
          res.status(200).json(post || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }

  /**
   * Update
   */
  update () {
    this.app.put('/post/update/:id', (req, res) => {
      try {
        this.PostModel.findByIdAndUpdate(req.params.id, req.body).then(post => {
          res.status(200).json(post || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }

  /**
   * Create
   */
  create () {
    this.app.post('/post/create', (req, res) => {
      try {
        const postModel = this.PostModel(req.body)
        postModel.save().then(post => {
          res.status(200).json(post || {})
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'error : ' + err
        })
      }
    })
  }
}
module.exports = Post
