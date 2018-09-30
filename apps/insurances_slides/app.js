module.exports = function init(site) {


  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/insurances_slides", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/insurances_slides/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/insurances_slides/images", (err, dir) => {

        })
      })
    })
  })

  const $insurances_slides = site.connectCollection("insurances_slides")
  site.words.addList(__dirname + '/site_files/json/words.json')


  $insurances_slides.deleteDuplicate({
    name:1
  }, (err, result) => {
    $insurances_slides.createUnique({
      name:1
    }, (err, result) => {

    })
  })

  $insurances_slides.deleteDuplicate({
    value:1
  }, (err, result) => {
    $insurances_slides.createUnique({
      value:1
    }, (err, result) => {

    })
  })


  site.get({
    name: "insurances_slides",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/insurances_slides/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let insurances_slides_doc = req.body
    insurances_slides_doc.$req = req
    insurances_slides_doc.$res = res
    $insurances_slides.add(insurances_slides_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/insurances_slides/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let insurances_slides_doc = req.body

    if (insurances_slides_doc._id) {
      $insurances_slides.edit({
        where: {
          _id: insurances_slides_doc._id
        },
        set: insurances_slides_doc,
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

  site.post("/api/insurances_slides/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $insurances_slides.delete({ _id: $insurances_slides.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/insurances_slides/view", (req, res) => {
    let response = {}
    response.done = false
    $insurances_slides.findOne({
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

  site.post("/api/insurances_slides/all", (req, res) => {
    let response = {}
    response.done = false
    $insurances_slides.findMany({
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



  site.post("/api/insurances_slides/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "insurances_slides_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/insurances_slides/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/insurances_slides/image/" + newName
      res.json(response)
    })
  })
  site.get("/insurances_slides/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/insurances_slides/images/" + req.params.name)
  })
}