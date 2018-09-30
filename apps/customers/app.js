module.exports = function init(site) {


  const $customers = site.connectCollection("customers")
  
  $customers.deleteDuplicate({name: 1}, (err, result) => {
    $customers.createUnique({name: 1}, (err, result) => {

    })
  })

  site.on('new ticket added', ticket => {
    $customers.find({
      where: { _id: ticket.customer._id },
      select: { devices: 1 }
    }, (err, doc) => {
      if(doc.devices === undefined){
        doc.devices = []
      }
      if(doc.devices.length === 0){
        doc.devices.push(ticket.device_info)
      }else{
        for (let i = 0; i < doc.devices.length; i++) {
          if(doc.devices[i].device && doc.devices[i].device.id === ticket.device_info.device.id && doc.devices[i].model.name === ticket.device_info.model.name){
            return
          }
        }
        doc.devices.push(ticket.device_info)
      }
      $customers.update(doc , (err , result)=>{
       
      })
    })
  })

  site.get({
    name: "customers",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/customers/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let customers_doc = req.body
    customers_doc.$req = req
    customers_doc.$res = res
    customers_doc.gov = site.fromJson(customers_doc.gov)
    customers_doc.city = site.fromJson(customers_doc.city)
    customers_doc.town = site.fromJson(customers_doc.town)
    customers_doc.region = site.fromJson(customers_doc.region)
    $customers.add(customers_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      }
      res.json(response)
    })
  })

  site.post("/api/customers/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let customers_doc = req.body
    customers_doc.gov = site.fromJson(customers_doc.gov)
    customers_doc.city = site.fromJson(customers_doc.city)
    customers_doc.town = site.fromJson(customers_doc.town)
    customers_doc.region = site.fromJson(customers_doc.region)
    if (customers_doc._id) {
      $customers.edit({
        where: {
          _id: customers_doc._id
        },
        set: customers_doc,
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

  site.post("/api/customers/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $customers.delete({
        _id: _id,
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

  site.post("/api/customers/view", (req, res) => {
    let response = {}
    response.done = false
    $customers.findOne({
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

  site.post("/api/customers/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}

    if(where['name']) {
      where['name'] = new RegExp(where['name'] , 'i')
    }

    if(where['email']) {
      where['email'] = new RegExp(where['email'] , 'i')
    }

    if(where['phones']) {
      where['phones'] = new RegExp(where['phones'] , 'i')
    }

    if(where['mobiles']) {
      where['mobiles'] = new RegExp(where['mobiles'] , 'i')
    }


    if(where['address']) {
      where['address'] = new RegExp(where['address'] , 'i')
    }

    if(where['notes']) {
      where['notes'] = new RegExp(where['notes'] , 'i')
    }

    
    $customers.findMany({
      select: req.body.select || {},
      where: where,
      sort: { id: -1 }
    }, (err, docs , count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


}