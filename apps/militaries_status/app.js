module.exports = function init(site) {

  const $militaries_status = site.connectCollection("militaries_status")
  site.words.addList(__dirname + '/site_files/json/words.json')

  site.get({
    name: "militaries_status",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/militaries_status/add", (req, res) => {
    let response = {}
    response.done = false
  
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res
    $militaries_status.add(doc, (err, id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/militaries_status/update", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body

    if (doc.id) {
      $militaries_status.edit({
        where: {
          id: doc.id
        },
        set: doc,
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

  site.post("/api/militaries_status/delete", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.body.id
    if (id) {
      $militaries_status.delete({ 
        id: id, 
        $req: req, 
        $res: res 
      }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/militaries_status/view", (req, res) => {
    let response = {}
    response.done = false
    $militaries_status.find({
      where: {
        id: req.body.id
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

  site.post("/api/militaries_status/all", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      res.json(response)
      return
    }

    $militaries_status.findMany({
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

}