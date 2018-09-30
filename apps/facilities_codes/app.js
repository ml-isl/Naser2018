module.exports = function init(site) {


  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/facilities_codes", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/facilities_codes/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/facilities_codes/images", (err, dir) => {

        })
      })
    })
  })


  const $facilities_codes = site.connectCollection("facilities_codes")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $facilities_codes.deleteDuplicate({
    name: 1
  }, (err, result) => {
    $facilities_codes.createUnique({
      name: 1
    }, (err, result) => {

    })
  })
    
  $facilities_codes.deleteDuplicate({
    code: 1
  }, (err, result) => {
    $facilities_codes.createUnique({
      code: 1
    }, (err, result) => {

    })
  })

  site.get({
    name: "facilities_codes",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/facilities_codes/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let facilities_codes_doc = req.body
    facilities_codes_doc.$req = req
    facilities_codes_doc.$res = res
    $facilities_codes.add(facilities_codes_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/facilities_codes/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let facilities_codes_doc = req.body
  
    if (facilities_codes_doc._id) {
      $facilities_codes.edit({
        where: {
          _id: facilities_codes_doc._id
        },
        set: facilities_codes_doc,
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

  site.post("/api/facilities_codes/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $facilities_codes.delete({ _id: $facilities_codes.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/facilities_codes/view", (req, res) => {
    let response = {}
    response.done = false
    $facilities_codes.findOne({
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

  site.post("/api/facilities_codes/all", (req, res) => {
    let response = {}
    response.done = false
    $facilities_codes.findMany({
      where: req.body.where,
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



  site.post("/api/facilities_codes/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "facilities_codes_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/facilities_codes/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/facilities_codes/image/" + newName
      res.json(response)
    })
  })
  site.get("/facilities_codes/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/facilities_codes/images/" + req.params.name)
  })
}