module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/devices_models", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/devices_models/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/devices_models/images", (err, dir) => {

        })
      })
    })
  })

  const $devices_models = site.connectCollection("devices_models")
  site.words.addList(__dirname + '/site_files/json/words.json')
  site.get({
    name: "devices_models",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/devices_models/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let devices_models_doc = req.body
    devices_models_doc.$req = req
    devices_models_doc.$res = res
    devices_models_doc.category = site.fromJson(devices_models_doc.category)
    devices_models_doc.sub_category = site.fromJson(devices_models_doc.sub_category)
    $devices_models.add(devices_models_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/devices_models/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let devices_models_doc = req.body
    devices_models_doc.category = site.fromJson(devices_models_doc.category)
    devices_models_doc.sub_category = site.fromJson(devices_models_doc.sub_category)
    if (devices_models_doc._id) {
      $devices_models.edit({
        where: {
          _id: devices_models_doc._id
        },
        set: devices_models_doc,
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

  site.post("/api/devices_models/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $devices_models.delete({ _id: $devices_models.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/devices_models/view", (req, res) => {
    let response = {}
    response.done = false
    $devices_models.findOne({
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

  site.post("/api/devices_models/all", (req, res) => {
    let response = {}
    response.done = false
    $devices_models.findMany({
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

  site.post("/api/devices_models/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "devices_models_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/devices_models/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/devices_models/image/" + newName
      res.json(response)
    })
  })
  site.get("/devices_models/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/devices_models/images/" + req.params.name)
  })
}