module.exports = function init(site) {

  const $safes = site.connectCollection("safes")
  
  site.require(__dirname + '/libs/monitor');



 

  site.on('[stores_in][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance || 0
        doc.balance = parseFloat(doc.balance) - parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'stores_in'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][-]', obj)
          })
          }
        })
      }

    })

  })
 
  site.on('[stores_in][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance || 0
        doc.balance = parseFloat(doc.balance) + parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'stores_in'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][+]', obj)
          })
          }
        })
      }

    })

  })


  site.on('[stores_out][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance || 0
        doc.balance = parseFloat(doc.balance) + parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance      
              obj.operation = 'stores_out'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][+]', obj)
          })
          }
        })
      }

    })

  })


  site.on('[stores_out][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) - parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'stores_out'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][-]', obj)
            })
          }
        })
      }

    })

  })


  site.on('[amount in][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) + parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'amount_in'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][+]', obj)
              
            })
          }
        })
      }

    })

  })


  site.on('[amount in][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) -  parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'amount_in'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][-]', obj)
            
            })
          }
        })
      }

    })

  })

  site.on('[amount out][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) + parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'amount_out'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][-]', obj)
              
            })
          }
        })
      }

    })

  })


  site.on('[amount out][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) - parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'amount_out'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][+]', obj)
              
            })
          }
        })
      }

    })

  })



  site.on('[employee_discount][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) +  parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'employee_discont'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][+]', obj)
              
            })
          }
        })
      }

    })

  })

  site.on('[employee_discount][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) -  parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'employee_discont'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][-]', obj)
              
            })
          }
        })
      }

    })

  })


  site.on('[employee_offer][safes][-]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) +  parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'employee_offer'
              obj.transition_type = 'in';
              site.call('[safes][safes_payments][+]', obj)
              
            })
          }
        })
      }

    })

  })

  site.on('[employee_offer][safes][+]', function (obj) {

    $safes.find({
      id: obj.safe.id,
    }, (err, doc) => {
      if (!err && doc) {
        doc.pre_balance = doc.balance
        doc.balance = parseFloat(doc.balance) -  parseFloat(obj.value)
        $safes.update(doc, (err, result) => {
          if (!err && result.ok) {
            $safes.find({
              id: result.doc.id
            },(err,doc)=>{
              obj.pre_balance = doc.pre_balance
              obj.image_url = doc.image_url
              obj.balance = doc.balance
              obj.operation = 'employee_offer'
              obj.transition_type = 'out';
              site.call('[safes][safes_payments][-]', obj)
              
            })
          }
        })
      }

    })

  })


  $safes.deleteDuplicate({
    name: 1,
  }, (err, result) => {
    $safes.createUnique({
      name: 1
    }, (err, result) => {

    })
  })


  site.get({
    name: "safes",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/safes/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }
    let safes_doc = req.body
    safes_doc.$req = req
    safes_doc.$res = res
    safes_doc.balance = site.toNumber(safes_doc.balance)
    $safes.add(safes_doc, (err, doc) => {
      if (!err) {
     
        let obj = {
          safe : doc,
          operation :   'new safe added',
          transition_type : 'in' ,
          pre_balance : 0,
          value : doc.balance,
          date : new Date(),
          sourceName : doc.employee.name
        }
        site.call('[safes][safes_payments][+]' , obj)
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/safes/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }
    let safes_doc = req.body

    safes_doc.employee = site.fromJson(safes_doc.employee)
    if (safes_doc._id) {
      $safes.edit({
        where: {
          _id: safes_doc._id
        },
        set: safes_doc,
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

  site.post("/api/safes/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $safes.delete({
        _id: $safes.ObjectID(_id),
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

  site.post("/api/safes/view", (req, res) => {
    let response = {}
    response.done = false
    $safes.findOne({
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

  site.post("/api/safes/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}


    if (where['name']) {
      where['name'] = new RegExp(where['name'], 'i')
    }
    $safes.findMany({
      select: req.body.select || {},
      sort: {
        id: -1
      },

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



  site.post("/api/safes/upload/image", (req, res) => {
    let response = {
      done: true
    }
    let file = req.files.fileToUpload
    let newName = "safes_doc_" + new Date().getTime() + ".png"
    let newpath = site.dir + "/../../uploads/crm/safes/images/" + newName
    site.mv(file.path, newpath, function (err) {
      if (err) {
        response.error = err
        response.done = false
      }
      response.image_url = "/safes/image/" + newName
      res.json(response)
    })
  })
  site.get("/safes/image/:name", (req, res) => {
    res.download(site.dir + "/../../uploads/crm/safes/images/" + req.params.name)
  })





}