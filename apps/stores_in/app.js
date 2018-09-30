module.exports = function init(site) {

  const $stores_in = site.connectCollection("stores_in")
 
  site.require(__dirname + "/libs/monitor")
  
  $stores_in.deleteDuplicate( {number : 1 } , (err , result)=>{
    $stores_in.createUnique({number : 1 } , (err , result)=>{

    })
  })
  site.on('[categories_items][store_in]' , itm => {

    itm.sizes.forEach(s=>{
      s.name = itm.name
      s.count = s.current_count
      s.total = 0
    })

    let obj = {
      image_url : '/images/store_in.png' ,
      items : itm.sizes,
      store : itm.store,
      company : itm.company,
      date : new Date(itm.date),
      number : new Date().getTime().toString(),
      total_value : 0,
      net_value : 0 ,
      total_tax : 0 ,
      total_discount : 0
    }
 
    console.log(obj)
    $stores_in.add(obj)

  })
  
  site.get({
    name: "stores_in",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.post("/api/stores_in/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return;
    }
    let stores_in_doc = req.body
    stores_in_doc.$req = req
    stores_in_doc.$res = res
   
    stores_in_doc.date = site.toDateTime(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })


    stores_in_doc.discount = site.toNumber(stores_in_doc.discount)
    stores_in_doc.octazion = site.toNumber(stores_in_doc.octazion)
    stores_in_doc.net_discount = site.toNumber(stores_in_doc.net_discount)
    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)
    stores_in_doc.net_value = site.toNumber(stores_in_doc.net_value)

    $stores_in.add(stores_in_doc, (err, doc) => {
      if (!err) {
        response.done = true
        
        let Obj = {
          value: doc.net_value,
          safe :doc.safe,
          date:doc.date,
          number:doc.number
        }
        if( Obj.value && Obj.safe && Obj.date && Obj.number ){
          site.call('[stores_in][safes][-]' , Obj)
        }

        site.call('please add to Company balance', {
          id: stores_in_doc.company.id,
          balance: stores_in_doc.net_value
        })
        
        stores_in_doc.items.forEach(itm => {
          itm.company = stores_in_doc.company
          itm.date = stores_in_doc.date
          itm.transaction_type ='in'
          itm.store = stores_in_doc.store
          site.call('please track item', Object.assign({} ,itm ) )
          site.call('please track item [categories item]',  Object.assign({} ,itm ))

        })
      }else{
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/stores_in/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_in_doc = req.body
    stores_in_doc.company = site.fromJson(stores_in_doc.company)
    stores_in_doc.seasonName = stores_in_doc.seasonName
    stores_in_doc.type = site.fromJson(stores_in_doc.type)
    stores_in_doc.date = new Date(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    stores_in_doc.discount = site.toNumber(stores_in_doc.discount)
    stores_in_doc.octazion = site.toNumber(stores_in_doc.octazion)
    stores_in_doc.net_discount = site.toNumber(stores_in_doc.net_discount)
    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)

    if (stores_in_doc._id) {
      $stores_in.edit({
        where: {
          _id: stores_in_doc._id
        },
        set: stores_in_doc,
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

  site.post("/api/stores_in/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id
    if (_id) {
      $stores_in.delete({ _id: $stores_in.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
          let Obj = {
            value: result.doc.net_value,
            safe : result.doc.safe,
            date: result.doc.date,
            number: result.doc.number
          }
          if( Obj.value && Obj.safe && Obj.date && Obj.number ){
            site.call('[stores_in][safes][+]' , Obj)
          }
          result.doc.items.forEach(itm=>{
            itm.store = result.doc.store
            site.call('please out item', Object.assign({date:new Date()}, itm))
            site.call('[ store in ] [categories items]'  , itm)
           
          })
          

        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/stores_in/view", (req, res) => {
    let response = {}
    response.done = false
    $stores_in.findOne({
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

  site.post("/api/stores_in/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where


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
  
    $stores_in.findMany({
      select: req.body.select || {},
      where: where,
      sort: { id: -1 }
    }, (err, docs , count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count
//console.log(docs)
        
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


}