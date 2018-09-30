module.exports = function init(site) {


  const $safes_payments = site.connectCollection("safes_payments")
  

  site.on('[safes][safes_payments][+]',  info => {
    let obj = {
      number : info.number || '',
      safe : info.safe,
      value : info.value || '',
      date : info.date || info.safe.date,
      source : info.operation,
      transition_type : info.transition_type ,
      balance: info.balance ||  info.safe.balance,
      image_url : info.image_url || info.safe.image_url,
      pre_balance : info.pre_balance,
      sourceName : info.sourceName  || ''
    }
    $safes_payments.add(obj)
  }) 

  site.on('[safes][safes_payments][-]',  info => {
    let obj = {
      number : info.number || '',
      safe : info.safe,
      value : info.value,
      date : info.date,
      source :  info.operation,
      transition_type : info.transition_type ,
      balance: info.balance,
      image_url : info.image_url,
      pre_balance : info.pre_balance,
      sourceName : info.sourceName || ''
    }
    $safes_payments.add(obj)
  }) 



  site.get({
    name: "safes_payments",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })


  site.post("/api/safes_payments/all", (req, res) => {
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
    
    if(where['source']) {
      where['source'] = new RegExp(where['source'] , 'i')
    }

    $safes_payments.findMany({
      select: req.body.select || {},
      where: req.body.where,
      sort : {id : -1}
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