module.exports = function init(site) {


  const $item_transaction = site.connectCollection("item_transaction")
  $item_transaction.trackBusy = false
  site.on('please track item', itm => {

    if($item_transaction.trackBusy){
      setTimeout(() => {
        site.call('please track item', itm)
      }, 400);
      return
    }

    if(itm){
   
      $item_transaction.trackBusy = true
     
      $item_transaction.findMany({sort : {id : -1} , where : {code : itm.code , size : itm.size , 'store.id' : itm.store.id} , limit : 1} , (err , docs)=>{
       
        delete itm._id
        delete itm.id

        itm.transaction_type = 'in'

        if(docs && docs.length === 1){
          itm.last_count = docs[0].current_count
          itm.current_count = itm.last_count + itm.count
          itm.last_price = docs[0].price
          itm.transaction_type = 'in'
          $item_transaction.add(itm , ()=>{
            $item_transaction.trackBusy = false
          })
        }else{
          itm.last_count = 0
          itm.current_count = itm.last_count + itm.count
          itm.last_price = itm.price
          $item_transaction.add(itm , ()=>{
            $item_transaction.trackBusy = false
          })
        }
      })
    }

  })

  $item_transaction.outBusy = false
  site.on('please out item', itm => {

    if ($item_transaction.outBusy) {
      setTimeout(() => {
        site.call('please out item', Object.assign({} , itm))
      }, 400);
      return;
    }
    $item_transaction.outBusy = true

    delete itm.id
    delete itm._id
    site.log(itm)
    
    $item_transaction.findMany({sort : {id : -1} , where : {code : itm.code , size : itm.size} , limit : 1} , (err , docs)=>{
      
      if(docs && docs.length === 1){
        itm.last_count = docs[0].current_count
        itm.current_count = itm.last_count  - itm.count
        itm.last_price = docs[0].price
        itm.transaction_type = 'out'
        $item_transaction.add(itm , ()=>{
          setTimeout(() => {
            $item_transaction.outBusy = false
          }, 200);
        })
      }else{
        itm.last_count = 0
        itm.current_count = itm.last_count - itm.count
        itm.last_price = itm.price
        $item_transaction.add(itm , ()=>{
          setTimeout(() => {
            $item_transaction.outBusy = false
          }, 200);
        })
      }
    })
   
  })

  site.get({
    name: "item_transaction",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.post("/api/item_transaction/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let _id = req.body._id


    if (_id) {
      $item_transaction.delete({ _id: $item_transaction.ObjectID(_id), $req: req, $res: res }, (err, result) => {
        if (!err) {
          response.done = true
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })
  site.post("/api/item_transaction/view", (req, res) => {
    let response = {}
    response.done = false
    $item_transaction.findOne({
      where: {
        _id: site.mongodb.ObjectID(req.body._id)
      }
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
        console.log(doc)
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/item_transaction/all", (req, res) => {

    let response = {}
    let where = req.body.where || {}
    
    if (where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }

    response.done = false
    $item_transaction.findMany({
      select: req.body.select || {},
      limit: req.body.limit || 100,
      sort: req.body.sort || {id : -1},
      where: where
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count
        console.log(docs)
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


}