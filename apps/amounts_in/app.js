module.exports = function init(site) {



  const $amounts_in = site.connectCollection("amounts_in")
  $amounts_in.drop();
  site.get({
    name: "amounts_in",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/amounts_in/add", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let amounts_in_doc = req.data
    amounts_in_doc.$req = req
    amounts_in_doc.$res = res


    amounts_in_doc.date = new Date(amounts_in_doc.date)
    $amounts_in.add(amounts_in_doc, (err, doc) => {
      if (!err) {
        let Obj = {
          value: doc.value,
          safe :doc.safe,
          date:doc.date,
          sourceName:doc.source.name
        }
        if( Obj.value && Obj.safe && Obj.date && Obj.sourceName ){
          site.call('[amount in][safes][+]' , Obj)
        }
        

        
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/amounts_in/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let amounts_in_doc = req.body
    amounts_in_doc.date = new Date(amounts_in_doc.date)
    if (amounts_in_doc._id) {
      $amounts_in.edit({
        where: {
          _id: amounts_in_doc._id
        },
        set: amounts_in_doc,
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

  site.post("/api/amounts_in/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $amounts_in.delete({
        _id: $amounts_in.ObjectID(_id),
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err && result.ok) {
          let Obj = {
            value: result.doc.value,
            safe :result.doc.safe,
            date:result.doc.date,
            sourceName:result.doc.source.name
          }
          if( Obj.value && Obj.safe && Obj.date && Obj.sourceName ){
            site.call('[amount in][safes][-]' , Obj)
          }
          
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/amounts_in/view", (req, res) => {
    let response = {}
    response.done = false
    $amounts_in.findOne({
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

  site.post("/api/amounts_in/all", (req, res) => {
    let response = {}
    response.done = false

    let where = req.body.where || {}
    

    
    if (where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }
    if (where  && where.date_from) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
      delete where.date_from
      delete where.date_to
    }



    
    if (where.search && where.search.date) {
      let d1 = site.toDate(where.search.date)
      let d2 = site.toDate(where.search.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }

    if (where && where.search && where.search.date_from) {
      let d1 = site.toDate(where.search.date_from)
      let d2 = site.toDate(where.search.date_to)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }


    

    
    if (where.search && where.search.source) {
    
      where['source.id'] = where.search.source.id
    }
    
    

    if (where.search && where.search.company) {
    
      where['company.id'] = where.search.company.id
    }
    

  if (where.search && where.search.customer) {
    
      where['customer.id'] = where.search.customer.id
    }


    if (where.search && where.search.eng) {
    
      where['eng.id'] = where.search.eng.id
    }
    
    if(where['description']) {
      where['description'] = new RegExp(where['description'] , 'i')
    }

    if (where.search && where.search.value) {
    
      where['value'] = where.search.value
    }
    
    delete where.search


    $amounts_in.findMany({
      select: req.body.select || {},
      where: where,
      sort : {id : -1},
      limit: 0
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