module.exports = function init(site) {



  site.createDir(site.dir + "/../../uploads", (err, dir) => {
    site.createDir(site.dir + "/../../uploads/crm", (err, dir) => {
      site.createDir(site.dir + "/../../uploads/crm/tickets_slides", (err, dir) => {
        site.createDir(site.dir + "/../../uploads/crm/tickets_slides/files", (err, dir) => {

        })
        site.createDir(site.dir + "/../../uploads/crm/tickets_slides/images", (err, dir) => {

        })
      })
    })
  })


  const $tickets_slides = site.connectCollection("tickets_slides")
  site.words.addList(__dirname + '/site_files/json/words.json')

  $tickets_slides.deleteDuplicate({
    name: 1,
    from:1,
    to:1
  }, (err, result) => {
    $tickets_slides.createUnique({
      name: 1,
      from:1,
      to:1
    }, (err, result) => {

    })
  })
    
  $tickets_slides.deleteDuplicate({
    name: 1
  }, (err, result) => {
    $tickets_slides.createUnique({
      name: 1
    }, (err, result) => {

    })
  })

     
  $tickets_slides.deleteDuplicate({
    from: 1
  }, (err, result) => {
    $tickets_slides.createUnique({
      from: 1
    }, (err, result) => {

    })
  })

    
  $tickets_slides.deleteDuplicate({
    to: 1
  }, (err, result) => {
    $tickets_slides.createUnique({
      to: 1
    }, (err, result) => {

    })
  })

  
  site.get({
    name: "tickets_slides",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/tickets_slides/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let tickets_slides_doc = req.body
    tickets_slides_doc.$req = req
    tickets_slides_doc.$res = res
    $tickets_slides.add(tickets_slides_doc, (err, _id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/tickets_slides/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let tickets_slides_doc = req.body


    if (tickets_slides_doc._id) {
      $tickets_slides.edit({
        where: {
          _id: tickets_slides_doc._id
        },
        set: tickets_slides_doc,
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

  site.post("/api/tickets_slides/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $tickets_slides.delete({ _id: $tickets_slides.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/tickets_slides/view", (req, res) => {
    let response = {}
    response.done = false
    $tickets_slides.findOne({
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

  site.post("/api/tickets_slides/all", (req, res) => {
    let response = {}
    response.done = false
    $tickets_slides.findMany({
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

  site.post("/api/tickets_slides/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "tickets_slides_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/tickets_slides/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/tickets_slides/image/" + newName
      res.json(response)
    })
  })
  site.get("/tickets_slides/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/tickets_slides/images/" + req.params.name)
  })
}