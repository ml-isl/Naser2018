module.exports = function init(site) {

  const $tax_types = site.connectCollection("tax_types")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $tax_types.deleteDuplicate({
    name: 1,
    value: 1,
    type: 1
  }, (err, result) => {
    $tax_types.createUnique({
      name: 1,
      value: 1,
      type: 1
    }, (err, result) => {

    })
  })


  site.get({
    name: "tax_types",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/tax_types/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let tax_types_doc = req.body
    tax_types_doc.$req = req
    tax_types_doc.$res = res


    $tax_types.add(tax_types_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/tax_types/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let tax_types_doc = req.body


    if (tax_types_doc._id) {
      $tax_types.edit({
        where: {
          _id: tax_types_doc._id
        },
        set: tax_types_doc,
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

  site.post("/api/tax_types/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $tax_types.delete({ _id: $tax_types.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/tax_types/view", (req, res) => {
    let response = {}
    response.done = false
    $tax_types.findOne({
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

  site.post("/api/tax_types/all", (req, res) => {

    let response = {}
    response.done = false
    $tax_types.findMany({
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