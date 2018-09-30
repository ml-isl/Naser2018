module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/unemployees_mobiles", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/unemployees_mobiles/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/unemployees_mobiles/images", (err, dir) => {

        })
      })
    })
  })

  const $unemployees_mobiles = site.connectCollection("unemployees_mobiles")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $unemployees_mobiles.deleteDuplicate({
    'unemployee.name':1,
    'number.number':1
  }, (err, result) => {
    $unemployees_mobiles.createUnique({
      'unemployee.name':1,
      'number.number':1
    }, (err, result) => {

    })
  })
    
  $unemployees_mobiles.deleteDuplicate({
    'number.number':1
  }, (err, result) => {
    $unemployees_mobiles.createUnique({
      'number.number':1
    }, (err, result) => {

    })
  })

  site.get({
    name: "unemployees_mobiles",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/unemployees_mobiles/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_mobiles_doc = req.body
    unemployees_mobiles_doc.$req = req
    unemployees_mobiles_doc.$res = res
    unemployees_mobiles_doc.unemployee = site.fromJson(unemployees_mobiles_doc.unemployee)
    unemployees_mobiles_doc.number = site.fromJson(unemployees_mobiles_doc.number)

    $unemployees_mobiles.add(unemployees_mobiles_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/unemployees_mobiles/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_mobiles_doc = req.body
    unemployees_mobiles_doc.unemployee = site.fromJson(unemployees_mobiles_doc.unemployee)
    unemployees_mobiles_doc.number = site.fromJson(unemployees_mobiles_doc.number)

    if (unemployees_mobiles_doc._id) {
      $unemployees_mobiles.edit({
        where: {
          _id: unemployees_mobiles_doc._id
        },
        set: unemployees_mobiles_doc,
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

  site.post("/api/unemployees_mobiles/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $unemployees_mobiles.delete({ _id: $unemployees_mobiles.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/unemployees_mobiles/view", (req, res) => {
    let response = {}
    response.done = false
    $unemployees_mobiles.findOne({
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

  site.post("/api/unemployees_mobiles/all", (req, res) => {
    let response = {}
    response.done = false
    $unemployees_mobiles.findMany({
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


  site.post("/api/unemployees_mobiles/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "unemployees_mobiles_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/unemployees_mobiles/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/unemployees_mobiles/image/" + newName
      res.json(response)
    })
  })
  site.get("/unemployees_mobiles/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/unemployees_mobiles/images/" + req.params.name)
  })

  site.post("/api/unemployees_mobiles/upload/file", (req, res) => {
    let response = {
      done: true
    }

    let file = req.files.fileToUpload
    let newName = "unemployees_mobiles_" + new Date().getTime() + '.' + site.path.extname(file.name)
    let newpath = site.dir + "/../../uploads/crm/unemployees_mobiles/files/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.file_url = "/unemployees_mobiles/file/" + newName
      response.file_name = file.name
      res.json(response)
    })
  })
  site.get("/unemployees_mobiles/file/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/unemployees_mobiles/files/" + req.params.name)
  })
}