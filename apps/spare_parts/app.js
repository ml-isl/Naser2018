module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/spare_parts", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/spare_parts/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/spare_parts/images", (err, dir) => {

        })
      })
    })
  })

  const $spare_parts = site.connectCollection("spare_parts")
  site.words.addList(__dirname + '/site_files/json/words.json')
  site.get({
    name: "spare_parts",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/spare_parts/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let spare_parts_doc = req.body
    spare_parts_doc.$req = req
    spare_parts_doc.$res = res

    $spare_parts.add(spare_parts_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/spare_parts/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let spare_parts_doc = req.body


    if (spare_parts_doc._id) {
      $spare_parts.edit({
        where: {
          _id: spare_parts_doc._id
        },
        set: spare_parts_doc,
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

  site.post("/api/spare_parts/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $spare_parts.delete({ _id: $spare_parts.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/spare_parts/view", (req, res) => {
    let response = {}
    response.done = false
    $spare_parts.findOne({
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

  site.post("/api/spare_parts/all", (req, res) => {
    let response = {}
    response.done = false
    $spare_parts.findMany({
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

  site.post("/api/spare_parts/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "spare_parts_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/spare_parts/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/spare_parts/image/" + newName
      res.json(response)
    })
  })
  site.get("/spare_parts/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/spare_parts/" + req.params.name)
  })
}