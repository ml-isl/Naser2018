module.exports = function init(site) {

  const $sub_categories = site.connectCollection("sub_categories")

    
  site.get({
    name: "sub_categories",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/sub_categories/add", (req, res) => {
    let response = {}
    response.done = false
    
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res
    $sub_categories.add(doc, (err, id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/sub_categories/update", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body

    if (doc.id) {
      $sub_categories.edit({
        where: {
          id: doc.id
        },
        set: doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/sub_categories/delete", (req, res) => {
    let response = {}
    response.done = false
    
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let id = req.body.id


    if (id) {
      $sub_categories.delete({ 
        id: id, 
        $req: req, 
        $res: res
       }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/sub_categories/view", (req, res) => {
    let response = {}
    response.done = false
    $sub_categories.find({
      where: {
        id: req.body.id
      }
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/sub_categories/all", (req, res) => {
    let response = {}
    response.done = false
     
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let where = req.data.where || {}
    
    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }

    $sub_categories.findMany({
      select: req.body.select || {},
      where: req.body.where
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.list = docs
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

}