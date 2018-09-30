module.exports = function init(site) {

  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/damages_calculate", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/damages_calculate/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/damages_calculate/images", (err, dir) => {

        })
      })
    })
  })

  const $damages_calculate = site.connectCollection("damages_calculate")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $damages_calculate.deleteDuplicate({
    'company.name': 1,
    'category.name': 1,
    'sub_category.name': 1,
    name: 1
  }, (err, result) => {
    $damages_calculate.createUnique({
      'company.name': 1,
      'category.name': 1,
      'sub_category.name': 1,
      name: 1
    }, (err, result) => {

    })
  })

  site.get({
    name: "damages_calculate",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })

  site.post("/api/damages_calculate/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let damages_calculate_doc = req.body
    damages_calculate_doc.$req = req
    damages_calculate_doc.$res = res
    damages_calculate_doc.company = site.fromJson(damages_calculate_doc.company)
    damages_calculate_doc.category = site.fromJson(damages_calculate_doc.category)
    damages_calculate_doc.sub_category = site.fromJson(damages_calculate_doc.sub_category)
    damages_calculate_doc.device = site.fromJson(damages_calculate_doc.device)

    $damages_calculate.add(damages_calculate_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/damages_calculate/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let damages_calculate_doc = req.body
    damages_calculate_doc.company = site.fromJson(damages_calculate_doc.company)
    damages_calculate_doc.category = site.fromJson(damages_calculate_doc.category)
    damages_calculate_doc.sub_category = site.fromJson(damages_calculate_doc.sub_category)
    damages_calculate_doc.device = site.fromJson(damages_calculate_doc.device)
    if (damages_calculate_doc._id) {
      $damages_calculate.edit({
        where: {
          _id: damages_calculate_doc._id
        },
        set: damages_calculate_doc,
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

  site.post("/api/damages_calculate/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $damages_calculate.delete({ _id: $damages_calculate.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/damages_calculate/view", (req, res) => {
    let response = {}
    response.done = false
    $damages_calculate.findOne({
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

  site.post("/api/damages_calculate/all", (req, res) => {
    let response = {}
    response.done = false
    $damages_calculate.findMany({
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

  site.post("/api/damages_calculate/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "damages_calculate_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/damages_calculate/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/damages_calculate/image/" + newName
      res.json(response)
    })
  })
  site.get("/damages_calculate/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/damages_calculate/images/" + req.params.name)
  })
}