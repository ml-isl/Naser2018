module.exports = function init(site) {


  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/in_out_names", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/in_out_names/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/in_out_names/images", (err, dir) => {

        })
      })
    })
  })

  const $in_out_names = site.connectCollection("in_out_names")

  $in_out_names.deleteDuplicate({
    name:1
  }, (err, result) => {
    $in_out_names.createUnique({
      name: 1
    }, (err, result) => {

    })
  })
    
  site.get({
    name: "in_out_names",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/in_out_names/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let in_out_names_doc = req.body
    in_out_names_doc.$req = req
    in_out_names_doc.$res = res

    $in_out_names.add(in_out_names_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/in_out_names/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let in_out_names_doc = req.body

    
    if (in_out_names_doc._id) {
      $in_out_names.edit({
        where: {
          _id: in_out_names_doc._id
        },
        set: in_out_names_doc,
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

  site.post("/api/in_out_names/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $in_out_names.delete({ _id: $in_out_names.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/in_out_names/view", (req, res) => {
    let response = {}
    response.done = false
    $in_out_names.findOne({
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

  site.post("/api/in_out_names/all", (req, res) => {
    let response = {}
    response.done = false
    $in_out_names.findMany({
      select: req.body.select || {},
      sort : {id : -1},

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

  site.post("/api/in_out_names/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "in_out_names_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/in_out_names/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/in_out_names/image/" + newName
      res.json(response)
    })
  })
  site.get("/in_out_names/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/in_out_names/images/" + req.params.name)
  })
}