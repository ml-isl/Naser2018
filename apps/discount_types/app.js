module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/discount_types", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/discount_types/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/discount_types/images", (err, dir) => {

        })
      })
    })
  })


  const $discount_types = site.connectCollection("discount_types")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $discount_types.deleteDuplicate({
    name: 1,
    value: 1,
    type: 1
  }, (err, result) => {
    $discount_types.createUnique({
      name: 1,
      value: 1,
      type: 1
    }, (err, result) => {

    })
  })


  site.get({
    name: "discount_types",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/discount_types/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let discount_types_doc = req.body
    discount_types_doc.$req = req
    discount_types_doc.$res = res


    $discount_types.add(discount_types_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/discount_types/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let discount_types_doc = req.body


    if (discount_types_doc._id) {
      $discount_types.edit({
        where: {
          _id: discount_types_doc._id
        },
        set: discount_types_doc,
        $req: req,
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

  site.post("/api/discount_types/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $discount_types.delete({ _id: $discount_types.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/discount_types/view", (req, res) => {
    let response = {}
    response.done = false
    $discount_types.findOne({
      where: {
        _id: site.mongodb.ObjectID(req.body._id)
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

  site.post("/api/discount_types/all", (req, res) => {

    let response = {}
    response.done = false
    $discount_types.findMany({
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