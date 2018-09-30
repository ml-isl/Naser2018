module.exports = function init(site) {



  const $eng_item_list = site.connectCollection("eng_item_list")


  site.on('mark eng item as used', itm => {
    site.log(itm)
    $eng_item_list.find({
      id: itm.id
    }, (err, doc) => {
      doc.status = 'used'
      doc.ticket_code = itm.ticket_code
      $eng_item_list.update(doc)
    })
  })
  site.get({
    name: "eng_item_list",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })
  site.post("/api/eng_item_list/add", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let eng_item_list_doc = req.body
    eng_item_list_doc.$req = req
    eng_item_list_doc.$res = res

    eng_item_list_doc.date = site.toDateTime(eng_item_list_doc.date)
    console.log(eng_item_list_doc)
    eng_item_list_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      for (let i = 0; i < itm.count; i++) {
        let obj = {}
        obj.date = eng_item_list_doc.date
        obj.eng = eng_item_list_doc.eng
        obj.store = eng_item_list_doc.store
        obj.name = itm.name
        obj.code = itm.code
        obj.cost = site.toNumber(itm.cost)
        obj.count = 1
        obj.size = itm.size
        obj.price = site.toNumber(itm.price)
        obj.number = site.toNumber(eng_item_list_doc.number)
        obj.safe = eng_item_list_doc.safe
        obj.status = 'waiting'
        $eng_item_list.add(obj, (err, doc) => {
          if (!err) {
            response.done = true

            doc.transaction_type = 'out'

            site.call('please out item', Object.assign({}, doc))
            site.call('please out item [categories items]', Object.assign({}, doc))

          } else {
            response.error = err.message
          }

        })

      }

      setTimeout(() => {
        res.json(response)
      }, 1000);


    })

  })

  site.post("/api/eng_item_list/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }
    let eng_item_list_doc = req.body
    eng_item_list_doc.seasonName = eng_item_list_doc.seasonName
    eng_item_list_doc.type = site.fromJson(eng_item_list_doc.type)
    eng_item_list_doc.date = new Date(eng_item_list_doc.date)

    eng_item_list_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    eng_item_list_doc.discount = site.toNumber(eng_item_list_doc.discount)
    eng_item_list_doc.octazion = site.toNumber(eng_item_list_doc.octazion)
    eng_item_list_doc.net_discount = site.toNumber(eng_item_list_doc.net_discount)
    eng_item_list_doc.total_value = site.toNumber(eng_item_list_doc.total_value)

    if (eng_item_list_doc._id) {
      $eng_item_list.edit({
        where: {
          _id: eng_item_list_doc._id
        },
        set: eng_item_list_doc,
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

  site.post("/api/eng_item_list/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let id = req.body.id
    if (id) {
      $eng_item_list.find({
        id: id
      }, (err, doc) => {
        if (!err && doc) {
          site.call('please track item', Object.assign({}, doc))
          site.call('please track item [categories item]', Object.assign({}, doc))
          $eng_item_list.delete({
            id: id,
            $req: req,
            $res: res
          }, (err, result) => {
            if (!err) {
              response.done = true
            site.call('[eng item list ] [categories items]'  , result.doc)
            }
            res.json(response)
          })
        }
      })

    } else {
      res.json(response)
    }
  })

  site.post("/api/eng_item_list/view", (req, res) => {
    let response = {}
    response.done = false
    $eng_item_list.findOne({
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

  site.post("/api/eng_item_list/all", (req, res) => {
    let response = {}
    response.done = false

    let where = req.body.where ||  {}
    
   
    if (where && where.date_from && where.date_to) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d1.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
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

    if (where && where['name']) {
      where['name'] = new RegExp(where['name'], 'i');
    }



    if (where && where.date_from) {
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

    
    $eng_item_list.findMany({
      select: req.body.select || {},
      where: where,
      sort: {
        id: -1
      }
    }, (err, docs, count) => {
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