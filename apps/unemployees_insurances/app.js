module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/unemployees_insurances", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/unemployees_insurances/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/unemployees_insurances/images", (err, dir) => {

        })
      })
    })
  })
  const $unemployees_insurances = site.connectCollection("unemployees_insurances")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $unemployees_insurances.deleteDuplicate({
    'name.name': 1,
    number: 1
  }, (err, result) => {
    $unemployees_insurances.createUnique({
      'name.name': 1,
      number: 1
    }, (err, result) => {

    })
  })

  $unemployees_insurances.deleteDuplicate({
    'name.name': 1
  }, (err, result) => {
    $unemployees_insurances.createUnique({
      'name.name': 1
    }, (err, result) => {

    })
  })

  $unemployees_insurances.deleteDuplicate({
    number: 1
  }, (err, result) => {
    $unemployees_insurances.createUnique({
      number: 1
    }, (err, result) => {

    })
  })
  site.get({
    name: "unemployees_insurances",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/unemployees_insurances/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_insurances_doc = req.body
    unemployees_insurances_doc.$req = req
    unemployees_insurances_doc.$res = res
    unemployees_insurances_doc.name = site.fromJson(unemployees_insurances_doc.name)
    unemployees_insurances_doc.slide = site.fromJson(unemployees_insurances_doc.slide)

    $unemployees_insurances.add(unemployees_insurances_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/unemployees_insurances/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let unemployees_insurances_doc = req.body
    unemployees_insurances_doc.name = site.fromJson(unemployees_insurances_doc.name)


    if (unemployees_insurances_doc._id) {
      $unemployees_insurances.edit({
        where: {
          _id: unemployees_insurances_doc._id
        },
        set: unemployees_insurances_doc,
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

  site.post("/api/unemployees_insurances/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $unemployees_insurances.delete({ _id: $unemployees_insurances.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/unemployees_insurances/view", (req, res) => {
    let response = {}
    response.done = false
    $unemployees_insurances.findOne({
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

  site.post("/api/unemployees_insurances/all", (req, res) => {
    let response = {}
    response.done = false
    $unemployees_insurances.findMany({
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


  site.post("/api/unemployees_insurances/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "unemployees_insurances_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/unemployees_insurances/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/unemployees_insurances/image/" + newName
      res.json(response)
    })
  })
  site.get("/unemployees_insurances/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/unemployees_insurances/images/" + req.params.name)
  })

  site.post("/api/unemployees_insurances/upload/file", (req, res) => {
    let response = {
      done: true
    }

    let file = req.files.fileToUpload
    let newName = "unemployees_insurances_" + new Date().getTime() + '.' + site.path.extname(file.name)
    let newpath = site.dir + "/../../uploads/crm/unemployees_insurances/files/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.file_url = "/unemployees_insurances/file/" + newName
      response.file_name = file.name
      res.json(response)
    })
  })
  site.get("/unemployees_insurances/file/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/unemployees_insurances/files/" + req.params.name)
  })
}