module.exports = function init(site) {

  const $companies_devices = site.connectCollection("companies_devices")

  site.get({
    name: "companies_devices",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/companies_devices/add", (req, res) => {
    let response = {}
    response.done = false
  
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res
   
    $companies_devices.add(doc, (err, id) => {
      if (!err) {
        response.done = true
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/companies_devices/update", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.body
   

    if (doc.id) {
      $companies_devices.edit({
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

  site.post("/api/companies_devices/delete", (req, res) => {
    let response = {}
    response.done = false
  
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let id = req.body.id
    if (id) {
      $companies_devices.delete({ id: id, $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/companies_devices/view", (req, res) => {
    let response = {}
    response.done = false
    $companies_devices.find({
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

  site.post("/api/companies_devices/all", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let where = req.data.where || {}
    
    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }


    $companies_devices.findMany({
      select: req.body.select || {},
      where: where ,
      sort : req.body.sort || {'company.name' : 1}
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