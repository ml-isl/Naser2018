module.exports = function init(site) {


  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/trees_accounting", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/trees_accounting/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/trees_accounting/images", (err, dir) => {

        })
      })
    })
  })


  const $trees_accounting = site.connectCollection("trees_accounting")
  site.words.addList(__dirname + '/site_files/json/words.json')
  site.get({
    name: "trees_accounting",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/trees_accounting/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let trees_accounting_doc = req.body
    trees_accounting_doc.$req = req
    trees_accounting_doc.$res = res
    trees_accounting_doc.parent = site.fromJson(trees_accounting_doc.parent)
    $trees_accounting.add(trees_accounting_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/trees_accounting/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let trees_accounting_doc = req.body
    trees_accounting_doc.parent = site.fromJson(trees_accounting_doc.parent)

    if (trees_accounting_doc._id) {
      $trees_accounting.edit({
        where: {
          _id: trees_accounting_doc._id
        },
        set: trees_accounting_doc,
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

  site.post("/api/trees_accounting/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $trees_accounting.delete({ _id: $trees_accounting.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/trees_accounting/view", (req, res) => {
    let response = {}
    response.done = false
    $trees_accounting.findOne({
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

  site.post("/api/trees_accounting/all", (req, res) => {

    let response = {}
    response.done = false
    $trees_accounting.findMany({
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

  site.post("/api/trees_accounting/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "trees_accounting_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/trees_accounting/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/trees_accounting/image/" + newName
      res.json(response)
    })
  })
  site.get("/trees_accounting/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/trees_accounting/images/" + req.params.name)
  })
}