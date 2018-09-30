module.exports = function init(site) {

  const $stores_out = site.connectCollection("stores_out")
 
  $stores_out.deleteDuplicate( {number : 1 } , (err , result)=>{
    $stores_out.createUnique({number : 1 } , (err , result)=>{

    })
  })

  site.on('[categories_items][store_out]' , itm => {

    itm.sizes.forEach(s=>{
      s.name = itm.name
      s.count = s.current_count
      s.total = s.total
    })

    let obj = {
      image_url : '/images/store_out.png' ,
      items : itm.sizes,
      store : itm.store,
      company : itm.company,
      date : new Date(itm.date),
      number :  new Date().getTime().toString(),
      total_value : site.toNumber(itm.total_value),
      net_value : site.toNumber(itm.net_value) ,
      total_tax : site.toNumber(itm.total) ,
      total_discount : site.toNumber(itm.total_discount),
      transaction_type : 'out'
    }
 
    $stores_out.add(obj)

  })

  site.get({
    name: "stores_out",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.post("/api/stores_out/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_out_doc = req.body
    stores_out_doc.$req = req
    stores_out_doc.$res = res
   
    stores_out_doc.date = site.toDateTime(stores_out_doc.date)

    stores_out_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })


    stores_out_doc.discount = site.toNumber(stores_out_doc.discount)
    stores_out_doc.octazion = site.toNumber(stores_out_doc.octazion)
    stores_out_doc.net_discount = site.toNumber(stores_out_doc.net_discount)
    stores_out_doc.total_value = site.toNumber(stores_out_doc.total_value)
    stores_out_doc.net_value = site.toNumber(stores_out_doc.net_value)

    $stores_out.add(stores_out_doc, (err, doc) => {
      if (!err) {
        response.done = true

        let obj = {
          value: doc.net_value,
          safe :doc.safe,
          date:doc.date,
          number:doc.number
        }

        if( obj.value && obj.safe && obj.date && obj.number ){
          site.call('[stores_out][safes][+]' , obj)
        }
      
        
        stores_out_doc.items.forEach(itm => {
          itm.date = stores_out_doc.date
          itm.transaction_type ='out'
          itm.store = stores_out_doc.store
          site.call('please out item', Object.assign( {} , itm))
          site.call('please out item [categories items]', Object.assign( {} , itm))

        })
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/stores_out/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_out_doc = req.body
    stores_out_doc.seasonName = stores_out_doc.seasonName
    stores_out_doc.type = site.fromJson(stores_out_doc.type)
    stores_out_doc.date = new Date(stores_out_doc.date)

    stores_out_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    stores_out_doc.discount = site.toNumber(stores_out_doc.discount)
    stores_out_doc.octazion = site.toNumber(stores_out_doc.octazion)
    stores_out_doc.net_discount = site.toNumber(stores_out_doc.net_discount)
    stores_out_doc.total_value = site.toNumber(stores_out_doc.total_value)

    if (stores_out_doc._id) {
      $stores_out.edit({
        where: {
          _id: stores_out_doc._id
        },
        set: stores_out_doc,
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

  site.post("/api/stores_out/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $stores_out.delete({ _id: $stores_out.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          let Obj = {
            value: result.doc.net_value,
            safe : result.doc.safe,
            date: result.doc.date,
            number: result.doc.number
          }
          if( Obj.value && Obj.safe && Obj.date && Obj.number ){
            console.log(Obj)
            site.call('[stores_out][safes][-]' , Obj)
          }
          

          response.done = true
          result.doc.items.forEach(itm=>{
            itm.store = result.doc.store
            site.call('please track item', Object.assign({date:new Date()}, itm))
            site.call('[store out] [categories items]' , itm)

          })

        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/stores_out/view", (req, res) => {
    let response = {}
    response.done = false
    $stores_out.findOne({
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

  site.post("/api/stores_out/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where
    if (where  && where.number){
      where['number'] = where.number
    }

    if (where  && where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1);
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
  
    $stores_out.findMany({
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