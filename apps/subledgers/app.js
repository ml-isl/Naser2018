module.exports = function init(site) {


  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/subledgers", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/subledgers/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/subledgers/images", (err, dir) => {

        })
      })
    })
  })


  const $subledgers = site.connectCollection("subledgers")
  site.words.addList(__dirname + '/site_files/json/words.json')
  site.get({
    name: "subledgers",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/subledgers/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let subledgers_doc = req.body
    subledgers_doc.$req = req
    subledgers_doc.$res = res
    subledgers_doc.parent = site.fromJson(subledgers_doc.parent)
    $subledgers.add(subledgers_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/subledgers/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let subledgers_doc = req.body
    subledgers_doc.parent = site.fromJson(subledgers_doc.parent)

    if (subledgers_doc._id) {
      $subledgers.edit({
        where: {
          _id: subledgers_doc._id
        },
        set: subledgers_doc,
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

  site.post("/api/subledgers/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $subledgers.delete({ _id: $subledgers.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/subledgers/view", (req, res) => {
    let response = {}
    response.done = false
    $subledgers.findOne({
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

  site.post("/api/subledgers/all", (req, res) => {

    let response = {}
    response.done = false
    $subledgers.findMany({
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

  site.post("/api/subledgers/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "subledgers_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/subledgers/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/subledgers/image/" + newName
      res.json(response)
    })
  })
  site.get("/subledgers/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/subledgers/images/" + req.params.name)
  })
}