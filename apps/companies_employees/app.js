module.exports = function init(site) {


  const $companies_employees = site.connectCollection("companies_employees")

  site.get({
    name: "companies_employees",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/companies_employees/add", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.data
    doc.$req = req
    doc.$res = res


    $companies_employees.add(doc, (err, newDoc) => {
      if (!err) {
        response.done = true
      }else{
        response.error  = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/companies_employees/update", (req, res) => {
    let response = {}
    response.done = false
     
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.data

    if (doc.id) {
      $companies_employees.edit({
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
      response.error = 'id not exists'
      res.json(response)
    }
  })

  site.post("/api/companies_employees/delete", (req, res) => {
    let response = {}
    response.done = false
       
    if (!req.session.user) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let doc = req.data

    if (doc.id) {
      $companies_employees.delete({ 
        id: doc.id, 
        $req: req, 
        $res: res 
      }, (err, result) => {
        if (!err) {
          response.done = true
        }else{
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      response.error = 'id not exists'
      res.json(response)
    }
  })

  site.post("/api/companies_employees/view", (req, res) => {
    let response = {}
    response.done = false
    $companies_employees.find({
      where: {
        id:req.body.id
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

  site.post("/api/companies_employees/all", (req, res) => {
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

    $companies_employees.findMany({
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