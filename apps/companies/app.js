module.exports = function init(site) {

  const $companies = site.connectCollection("companies")

  site.get({
    name: "companies",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/companies/add", (req, res) => {
    let response = {}
    response.done = false
 
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res
    doc.gov = doc.gov

    $companies.add(doc, (err, id) => {
      if (!err) {
        response.done = true
      }
      res.json(response)
    })
  })

  site.post("/api/companies/update", (req, res) => {
    let response = {}
    response.done = false
 
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body
    doc.gov = doc.gov

    if (doc.id) {
      $companies.edit({
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

  site.post("/api/companies/delete", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.body.id


    if (id) {
      $companies.delete({
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

  site.post("/api/companies/view", (req, res) => {
    let response = {}
    response.done = false
    $companies.find({
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

  site.post("/api/companies/all", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      res.json(response)
      return
    }

    let where = req.data.where || {}
    
    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }
/////////////////////////////////////////////////////////


    $companies.findMany({
      select: req.body.select || {},
      where: req.body.where,
      sort: req.body.sort || {
        name: 1
      }
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