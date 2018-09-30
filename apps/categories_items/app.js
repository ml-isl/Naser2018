module.exports = function init(site) {

  const $categories_items = site.connectCollection("categories_items")
  $categories_items.deleteDuplicate( {code : 1 } , (err , result)=>{
    $categories_items.createUnique({code : 1 } , (err , result)=>{
    })
  })

  site.require(__dirname + '/libs/monitor');

  $categories_items.busy = false
  site.on('[ store in ] [categories items]' , (result)=>{
    console.log(result)
    if(result.code && result.count > 0){
      if($categories_items.busy){
        setTimeout(() => {
          site.call('[ store in ] [categories items]' , result)
        }, 100);
        return
      }

    $categories_items.busy = true
    $categories_items.find({
      code: result.code
    }, (err, doc) => {
      if (!err && doc) {
        setTimeout(() => {
          doc.sizes[0].current_count = doc.sizes[0].current_count - result.count
          $categories_items.update(doc)
          $categories_items.busy = false
        }, 100);
      }else{
        $categories_items.busy = false  
      }
      })
    }
  } )

  site.on('[store out] [categories items]' , (result)=>{

    if($categories_items.busy){
      setTimeout(() => {
        site.call('[store out] [categories items]' , result)
      }, 200);
      return
    }
    $categories_items.busy = true
    if(result.code && result.count > 0){
    $categories_items.find({
      code: result.code
    }, (err, doc) => {
      if (!err && doc) {
          doc.sizes[0].current_count = doc.sizes[0].current_count + result.count
          $categories_items.update(doc , ()=>{
            $categories_items.busy = false
          })
      }else{
        $categories_items.busy = false
      }
    })
  }
  } )

  $categories_items.trackBusy = false

  site.on('please track item [categories item]', itm => {
    if ($categories_items.trackBusy) {
      setTimeout(() => {
        site.call('please track item [categories item]', itm)
      }, 100);
      return
    }
    $categories_items.trackBusy = true

    $categories_items.find({
      where: {
        code: itm.code
      }
    }, (err, doc) => {
      if (!err && doc) {
        itm.done = false

        doc.sizes.forEach(s => {
          if (s.size == itm.size) {
            s.cost = itm.cost
            s.price = itm.price
            s.current_count = site.toNumber(s.current_count) + site.toNumber(itm.count)
            itm.done = true
          }
        })

        if (itm.done == false) {
          doc.sizes.push({
            size: itm.size,
            cost: itm.cost,
            price: itm.price,
            current_count: site.toNumber(itm.count)
          })
        }
        $categories_items.update(doc, (err, dd) => {
          $categories_items.trackBusy = false
        })
      } else {
        $categories_items.add({
          code: itm.code,
          section: itm.section,
          category: itm.category,
          Company: itm.company,
          name: itm.name,
          sizes: [{
            size: itm.size,
            price: itm.price,
            current_count: itm.count,
            cost: itm.cost
          }]
        }, (err, dd2) => {
          $categories_items.trackBusy = false
        })
      }
    })
  })

  $categories_items.outBusy = false

  site.on('please out item [categories items]', itm => {
    if ($categories_items.outBusy) {
      setTimeout(() => {
        site.call('please out item [categories items]', Object.assign({} , itm) )
      }, 400);
      return;
    }

    $categories_items.outBusy = true
   
    $categories_items.find({
      where: {
        code: itm.code
      }
    }, (err, doc) => {
      if (!err && doc) {
        itm.done = false

        doc.sizes.forEach(s => {
          if (s.size == itm.size) {
            s.price = itm.price
            s.current_count = site.toNumber(s.current_count) - site.toNumber(itm.count)
            itm.done = true
          }
        })

        if (itm.done == false) {
          doc.sizes.push({
            size: itm.size,
            price: itm.price,
            current_count: -site.toNumber(itm.count)
          })
        }
        $categories_items.update(doc, (err, dd) => {
          $categories_items.outBusy = false
        })
      }else{
        $categories_items.outBusy = false
      }
    })
  })

  site.get({
    name: "categories_items",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })

  site.post("/api/categories_items/add", (req, res) => {

    let response = {}
    response.done = false


    if (!req.session.user) {
      res.json(response)
      return
    }

    let categories_items_doc = req.body
    categories_items_doc.$req = req
    categories_items_doc.$res = res

    if (categories_items_doc.sizes) {
      categories_items_doc.sizes.forEach(itm => {
        itm.cost = site.toNumber(itm.cost)
        itm.price = site.toNumber(itm.price)
        itm.current_count = site.toNumber(itm.current_count)
      })
    }


    $categories_items.add(categories_items_doc, (err, doc) => {
      if (!err) {
        
         site.call('[categories_items][store_in]' , doc)

        doc.sizes.forEach( itm =>{

          itm.id = doc.id
          itm.code = doc.code
          itm.name = doc.name
          itm.count = itm.current_count
          itm.store = doc.store
          itm.date = doc.date

          site.call('please track item' , itm)

        })
       
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/categories_items/update", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      res.json(response)
    }
    let categories_items_doc = req.body
    categories_items_doc.category = site.fromJson(categories_items_doc.category)
    categories_items_doc.factory = site.fromJson(categories_items_doc.factory)
    categories_items_doc.company = site.fromJson(categories_items_doc.company)
    categories_items_doc.seasonName = site.fromJson(categories_items_doc.seasonName)
    categories_items_doc.section = site.fromJson(categories_items_doc.section)

    categories_items_doc.sizes.forEach(itm => {
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.current_count = site.toNumber(itm.current_count)
    })



    if (categories_items_doc._id) {
      $categories_items.edit({
        where: {
          _id: categories_items_doc._id
        },
        set: categories_items_doc,
        $req: req,
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

  site.post("/api/categories_items/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $categories_items.delete({
        _id: $categories_items.ObjectID(_id),
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          let doc = result.doc;
          site.call('[categories_items][store_out]' , doc)
          console.log("console.log console.log console.log console.log")
          console.log(doc)
          doc.sizes.forEach( itm =>{
            itm.date = doc.date
            itm.count = itm.current_count
            itm.name = doc.name
            itm.id = doc.id
            itm.code = doc.code
            itm.store = doc.store
            itm.transaction_type = 'out'
         site.call('please out item' , itm)
          })
         console.log(doc)
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/categories_items/view", (req, res) => {
    let response = {}
    response.done = false
    $categories_items.findOne({
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

  site.post("/api/categories_items/all", (req, res) => {

    let response = {}
    let where = req.body.where
    response.done = false
    $categories_items.findMany({
      select: req.body.select || {},
      where: where
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