module.exports = function init(site) {

  const $employees = site.connectCollection("employees")

 
  site.get({
    name: "employees",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.post("/api/employees/add", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body
    doc.$req = req
    doc.$res = res

    doc.birth_date = new Date(doc.birth_date).getTime()
    doc.contract_date = new Date(doc.contract_date).getTime()


    $employees.add(doc, (err, id) => {
      if (!err) {
        response.done = true
        site.call('please add user', {
          email: doc.email,
          password: doc.password,
          role: doc.role,
          employeeid : doc.id
        })
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/employees/update", (req, res) => {
    let response = {}
    response.done = false
   
    if (!req.session.user) {
      res.json(response)
      return
    }

    let doc = req.body

    
    doc.birth_date = new Date(doc.birth_date).getTime()
    doc.contract_date = new Date(doc.contract_date).getTime()

    if (doc.id) {
      $employees.edit({
        where: {
          id: doc.id
        },
        set: doc,
        $req: req,
        $req: req,
        $res: res
      }, (err , result) => {
        if (!err) {
          response.done = true
          site.call('please add user', {
            email: doc.email,
            password: doc.password,
            role: doc.role,
            employeeid : doc.id
          })
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/employees/delete", (req, res) => {
    let response = {}
    response.done = false
    
    if (!req.session.user) {
      res.json(response)
      return
    }

    let id = req.body.id


    if (id) {
      $employees.delete({ 
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

  site.post("/api/employees/view", (req, res) => {
    let response = {}
    response.done = false
    $employees.find({
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

  site.post("/api/employees/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.data.where || {}
    
    if (!req.session.user) {
      res.json(response)
      return
    }

    if(where['name']){
      where['name'] = new RegExp(where['name'], 'i')
    }

    $employees.findMany({
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

  site.post({
    name: '/api/employees/departments/all',
    path: __dirname + '/site_files/json/departments.json'
  })

  site.post({
    name: '/api/employees/jobs/all',
    path: __dirname + '/site_files/json/jobs.json'
  })

}