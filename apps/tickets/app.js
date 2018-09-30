module.exports = function init(site) {

  const $tickets = site.connectCollection({
    collection: "tickets",
    db: "crm_naser_tickets_2018"
  })



  $tickets.deleteDuplicate({
    'code': 1
  }, (err, result) => {
    $tickets.createUnique({
      'code': 1
    })
  })

  site.require(__dirname + '/libs/monitor');

  function addZero(code, number) {
    let c = number - code.toString().length
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString()
    }
    return code
  }

  $tickets.newCode = function () {

    let y = new Date().getFullYear().toString().substr(2, 2)
    let m = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'][new Date().getMonth()].toString()
    let d = new Date().getDate()
    let lastCode = site.storage('ticket_last_code') || 0
    let lastMonth = site.storage('ticket_last_month') || m
    if (lastMonth != m) {
      lastMonth = m
      lastCode = 0
    }
    lastCode++
    site.storage('ticket_last_code', lastCode)
    site.storage('ticket_last_month', lastMonth)
    return y + lastMonth + addZero(d, 2) + addZero(lastCode, 4)
  }

  site.get({
    name: "tickets",
    path: __dirname + "/site_files/html/index.html",
    parser: "html js"
  })


  site.post("/api/tickets/add", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'you are not login'
      res.json(response)
      return
    }

    let tickets_doc = req.body

    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.code = $tickets.newCode()
    
    if (tickets_doc.company_code) {
      tickets_doc.company_codes = [tickets_doc.company_code]
      delete tickets_doc.company_code
    }

    tickets_doc.done = false
    tickets_doc.review_done = false
    tickets_doc.close_eng_assign = false
    tickets_doc.close_eng_done = false

    tickets_doc.close_eng = {
      device_info: tickets_doc.device_info
    }

    tickets_doc = ticketHandle(tickets_doc)
    $tickets.add(tickets_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
        site.call('new ticket added', doc)
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  function ticketHandle(tickets_doc){
    tickets_doc.date = new Date(tickets_doc.date)
    tickets_doc.visit_date = new Date(tickets_doc.visit_date)

    if(tickets_doc.add_user_info){
      tickets_doc.add_user_info.date = new Date(tickets_doc.add_user_info.date)
    }
    if(tickets_doc.close1_user_info){
      tickets_doc.close1_user_info.date = new Date(tickets_doc.close1_user_info.date)
    }
    if(tickets_doc.close2_user_info){
      tickets_doc.close2_user_info.date = new Date(tickets_doc.close2_user_info.date)
    }
    if(tickets_doc.close_eng_user_info){
      tickets_doc.close_eng_user_info.date = new Date(tickets_doc.close_eng_user_info.date)
    }
    if(tickets_doc.assign_user_info){
      tickets_doc.assign_user_info.date = new Date(tickets_doc.assign_user_info.date)
    }
    if(tickets_doc.close_eng && tickets_doc.close_eng.user_info){
      tickets_doc.close_eng.user_info.date = new Date(tickets_doc.close_eng.user_info.date)
    }

    return tickets_doc
  }

  site.post("/api/tickets/update", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body
    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc =  ticketHandle(tickets_doc)
    $tickets.update(tickets_doc, err => {
      if (!err) {
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })


  site.post("/api/tickets/updatePrint", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }


    $tickets.findOne({
      id: req.data.id
    }, (err, doc) => {
      if (doc) {

        doc.print_user_info = site.security.getUserFinger({
          $req: req,
          $res: res
        })
        doc.print_count = doc.print_count || 0
        doc.print_count++;
        doc = ticketHandle(doc)
        $tickets.update(doc, err => {
          if (!err) {
            response.done = true
          } else {
            response.error = err.message
          }
          res.json(response)
        })
      }
    })



  })


  site.post("/api/tickets/updateCloseEng", (req, res) => {

    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = {
      id: req.body.ticket.id,
      close_eng: req.body.ticket.close_eng,
      close_eng_done: req.body.ticket.close_eng_done
    }


    tickets_doc.close_eng.user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.close_eng_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    tickets_doc.$req = req
    tickets_doc.$res = res

    if (tickets_doc.id) {
      $tickets.find({
        where: {
          id: tickets_doc.id,
        },
        select: {}
      }, (err, doc) => {
        if (!err && doc) {
          doc.$req = req
          doc.$res = res
          doc.close_eng = tickets_doc.close_eng
          doc.close_eng_done = tickets_doc.close_eng_done
          doc.close_eng_user_info = tickets_doc.close_eng_user_info
          doc.device_info = doc.close_eng.device_info

          doc.eng_list[doc.eng_list.length - 1].close_eng = doc.close_eng
          if (doc.close_eng_done) {
           
            doc.fixes = doc.close_eng.fixes

            if (doc.close_eng.inputs) {
              doc.inputs = doc.inputs || []
              doc.close_eng.inputs.forEach(d => {
                d.eng = doc.eng
                doc.inputs.push(d)
              })
            }

            if (doc.close_eng.outputs) {
              doc.outputs = doc.outputs || []
              doc.close_eng.outputs.forEach(d => {
                d.eng = doc.eng
                doc.outputs.push(d)
              })
            }

            if (doc.close_eng.item_used_list) {
              doc.item_used_list = doc.item_used_list || []
              doc.close_eng.item_used_list.forEach(d => {
                d.eng = doc.eng
                doc.item_used_list.push(d)
              })
            }


            if (doc.close_eng.item_need_list) {
              doc.item_need_list = doc.item_need_list || []
              doc.close_eng.item_need_list.forEach(d => {
                d.eng = doc.eng
                doc.item_need_list.push(d)
              })
            }

            if (doc.close_eng.item_recived_list) {
              doc.item_recived_list = doc.item_recived_list || []
              doc.close_eng.item_recived_list.forEach(d => {
                d.eng = doc.eng
                doc.item_recived_list.push(d)
              })
            }


          }
          doc = ticketHandle(doc)
          $tickets.update(doc, err => {
            if (!err) {
              response.done = true
            } else {
              response.error = err.message
            }
            res.json(response)
          })

        }
      })
    }



  })

  site.post("/api/tickets/updateClose1", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body.ticket


    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.close1_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

   
    tickets_doc = ticketHandle(tickets_doc)
    $tickets.update(tickets_doc, (err , result) => {
      if (!err) {
        response.done = true
        if(tickets_doc.close1_done){
          tickets_doc.eng_list.forEach(cl=>{
            cl.close_eng.item_used_list.forEach(itm=>{
              itm.ticket_code = tickets_doc.code
              site.call('mark eng item as used' , itm)
            })
          })
        }
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/updateClose2", (req, res) => {
    let response = {}
    response.done = false

    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body.ticket
    tickets_doc.$req = req
    tickets_doc.$res = res

    tickets_doc.close2_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

   
    tickets_doc = ticketHandle(tickets_doc)
    $tickets.update(tickets_doc, err => {
      if (!err) {
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


  site.post("/api/tickets/updateNotes", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body
    let doc = {}
    doc.$req = req
    doc.$res = res

    doc.notes = site.fromJson(tickets_doc.notes)

    if (tickets_doc.id) {
      $tickets.edit({
        where: {
          id: tickets_doc.id
        },
        set: doc,
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
      response.error = 'no id'
      res.json(response)
    }
  })



  site.post("/api/tickets/updateReview", (req, res) => {
    let response = {}
    response.done = false

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }


    let doc = req.body
    doc.$req = req
    doc.$res = res
    doc.ticket.review_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })


    if (doc.id) {
      $tickets.edit({
        where: {
          id: doc.id
        },
        set: doc.ticket,
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
      response.error = 'no id'
      res.json(response)
    }
  })



  site.post("/api/tickets/updateFiles", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let tickets_doc = req.body
    let doc = {}
    doc.$req = req
    doc.$res = res

    doc.files = site.fromJson(tickets_doc.files)

    if (tickets_doc.id) {
      $tickets.edit({
        where: {
          id: tickets_doc.id
        },
        set: doc,
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
      response.error = 'no id'
      res.json(response)
    }
  })


  site.post("/api/tickets/BackToCloseEng", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      response.error = 'not login'
      res.json(response)
      return
    }

    let doc = req.body

    if (doc) {
      $tickets.edit({
        where: {
          id: doc.id
        },
        set: {
          'close_eng_done': false,
          'close1_done': false,
          'back_to_eng_user_info': site.security.getUserFinger({
            $req: req,
            $res: res
          })
        },
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
          response.count = result.count
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      response.error = 'no id'
      res.json(response)
    }
  })

  site.post("/api/tickets/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let id = req.body.id
    if (id) {
      $tickets.delete({
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

  site.post("/api/tickets/view", (req, res) => {
    let response = {}
    response.done = false
    $tickets.findOne({
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

  site.post("/api/tickets/view/open", (req, res) => {
    let response = {}
    response.done = false
    let doc = req.body
    if (!doc.customer || !doc.device_info || !doc.device_info.company || !doc.device_info.category || !doc.device_info.device) {
      res.json(response)
      return
    }
    $tickets.findMany({
      where: {
        done: false,
        'customer.id': doc.customer.id,
        'device_info.company.id': doc.device_info.company.id,
        'device_info.category.id': doc.device_info.category.id,
        'device_info.device.id': doc.device_info.device.id
      }
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.docs = docs
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/tickets/all", (req, res) => {

    let response = {}
    response.done = false


    if(!req.session.user){
      response.error = "Must Login First"
      res.json(response)
      return
    }


    let data = req.body.where || {}
    let where = {
      $or: []
    }



    if (data && data.from_date && data.to_date) {
      let d1 = site.toDate(data.from_date)
      let d2 = site.toDate(data.to_date)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    }


    if (data['add_user_info.id']) {
      where['add_user_info.id'] = data['add_user_info.id']
    }

    if (data['assign_user_info.id']) {
      where['assign_user_info.id'] = data['assign_user_info.id']
    }

    if (data['close_eng_user_info.id']) {
      where['close_eng_user_info.id'] = data['close_eng_user_info.id']
    }

    if (data['back_to_eng_user_info.id']) {
      where['back_to_eng_user_info.id'] = data['back_to_eng_user_info.id']
    }

    if (data['close2_user_info.id']) {
      where['close2_user_info.id'] = data['close2_user_info.id']
    }

    if (data['review_user_info.id']) {
      where['review_user_info.id'] = data['review_user_info.id']
    }


    if (data.print_status) {
      if (data.print_status == '1') {
        where['print_count'] = {
          '$gte': 1
        }
      } else if (data.print_status == '-1') {
        where['print_count'] = 0
      }
    }

    if (data.eng) {
      where['eng.id'] = data.eng.id
    }if (data['eng.id']) {
      where['eng.id'] = parseInt(data['eng.id'])
    } else {
      if (req.session.user.roles.length === 1) {
        if (req.session.user.roles[0].name === 'eng') {
          where['eng.id'] = req.session.user.employee_id
          where['close_eng_done'] = false
        }
      }
    }

    if (data.code) {
      if (data.code.split('\n').length > 1) {
        data.code.split('\n').forEach(m => {
          where.$or.push({
            'code': new RegExp(m, 'i')
          })
        })
      } else {
        where.code = new RegExp(data.code, 'i')
      }

    }

    if (data.company_code) {
      if (data.company_code.split('\n').length > 1) {
        data.company_code.split('\n').forEach(m => {
          where.$or.push({
            'company_codes': new RegExp(m, 'i')
          })
        })
      } else {
        where['company_codes'] = new RegExp(data.company_code, 'i')
      }

    }

    if (data.receipt_number) {
      where.receipt_number = data.receipt_number
    }


    if (data.priotry) {
      where['priotry.id'] = site.fromJson(data.priotry).id
    }

    if (data.review_status) {
      where['review_status.id'] = site.fromJson(data.review_status).id
    }

    if (data.review_done == false || data.review_done == true) {
      where['review_done'] = data.review_done
    }

    if (data.status) {
      where['status.id'] = site.fromJson(data.status).id
    }
  

    if (data.status2) {
      where['status2.id'] = site.fromJson(data.status2).id
    }

    if (data.status3) {
      where['status3.id'] = site.fromJson(data.status3).id
    }
    if (data.device_info) {
      if (data.device_info.company) {
        where['device_info.company.id'] = data.device_info.company.id
      }

      if (data.device_info.serial) {
        where['device_info.serial'] = data.device_info.serial
      }

      if (data.device_info.category) {
        where['device_info.category.id'] = data.device_info.category.id
      }
      if (data.device_info.sub_category) {
        where['device_info.sub_category.id'] = data.device_info.sub_category.id
      }
      if (data.device_info.device) {
        where['device_info.device.id'] = data.device_info.device.id
      }
      if (data.device_info.model) {
        where['device_info.model.name'] = data.device_info.model.name
      }
    }

    if (data['device_info.device.id']) {
      where['device_info.device.id'] = data['device_info.device.id']
    }


    if (data.item_need_name) {
      where['close1.item_need_list'] = {
        $all: [{
          name: data.item_need_name
        }]
      }
    }

    if (data.lated && data.lated > 0) {
      let d1 = new Date()
      d1.setHours(d1.getHours() - data.lated);
      where.date = {
        '$lte': d1
      }

      where.$or.push({
        'close_eng_done': {
          "$exists": false
        }
      })
      where.$or.push({
        'close_eng_done': false
      })

    }

    if (data.date_type) {
      let d1 = null
      let d2 = null

      if (data.date) {
        d1 = site.toDate(data.date)
        d2 = site.toDate(data.date)
        d2.setDate(d2.getDate() + 1)
      }

      if (data.from_date) {
        d1 = site.toDate(data.from_date)
        d2 = site.toDate(data.to_date)
        d2.setDate(d2.getDate() + 1)

      }

      if (data.date_type.id == 1) {
        where.date = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 2) {
        where['close_eng_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 3) {
        where['close1_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 4) {
        where['close2_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      } else if (data.date_type.id == 5) {
        where['assign_user_info.date'] = {
          '$gte': d1,
          '$lt': d2
        }
      }


    }

    if (data['customer.id']) {
      where['customer.id'] = parseInt(data['customer.id'])
    }

    if (data.customer) {
      data.customer = site.fromJson(data.customer)

      if (data.customer.name) {
        where['customer.name'] = new RegExp(data.customer.name, 'i')
      }

      if (data.customer.id) {
        where['customer.id'] = parseInt(data.customer.id)
      }

      if (data.customer.mobile) {
        if (data.customer.mobile.split('\n').length > 1) {
          data.customer.mobile.split('\n').forEach(m => {
            where.$or.push({
              'customer.mobiles': new RegExp(m, 'i')
            })
            where.$or.push({
              'customer.phones': new RegExp(m, 'i')
            })
          })
        } else {
          where.$or.push({
            'customer.phones': new RegExp(data.customer.mobile, 'i')
          })
          where.$or.push({
            'customer.mobiles': new RegExp(data.customer.mobile, 'i')
          })
          //where['customer.mobiles'] = new RegExp(data.customer.mobile, 'i')
        }

      }
      if (data.customer.phone) {
        where.$or.push({
          'customer.phones': new RegExp(data.customer.phone, 'i')
        })
        where.$or.push({
          'customer.mobiles': new RegExp(data.customer.phone, 'i')
        })
        // where['customer.phones'] = new RegExp(data.customer.phone, 'i')
      }

      if (data.customer.gov) {
        where['customer.gov.id'] = site.fromJson(data.customer.gov).id
      }
      if (data.customer.city) {
        where['customer.city.id'] = site.fromJson(data.customer.city).id
      }
      if (data.customer.town) {
        where['customer.town.id'] = site.fromJson(data.customer.town).id
      }
      if (data.customer.region) {
        where['customer.region.id'] = site.fromJson(data.customer.region).id
      }
    }

    if (data.close_eng_done === true || data.close_eng_done === false) {
      where['close_eng_done'] = data.close_eng_done
    }

    if (data.close1_done === true || data.close1_done === false) {
      where['close1_done'] = data.close1_done
    }

    if (data.close2_done === true || data.close2_done === false) {
      where['close2_done'] = data.close2_done
    }

    if (data.done === true || data.done === false) {
      where['done'] = data.done
    }

    if(data.notes){
      where['notes'] =  new RegExp(data.notes, 'i')
    }

    if (data.user_type && data.user) {
      if (data.user_type.id == 1) {
        where['add_user_info.id'] = data.user.id
      } else if (data.user_type.id == 2) {
        where['close_eng_user_info.id'] = data.user.id
      } else if (data.user_type.id == 3) {
        where['close1_user_info.id'] = data.user.id
      } else if (data.user_type.id == 4) {
        where['close2_user_info.id'] = data.user.id
      } else if (data.user_type.id == 5) {
        where['review_user_info.id'] = data.user.id
      } else if (data.user_type.id == 6) {
        where['assign_user_info.id'] = data.user.id
      }
    }

    if (data['status.id']) {
      where['status.id'] = data['status.id']
    }

    if (data['customer.region.id']) {
      where['customer.region.id'] = data['customer.region.id']
    }

   

    if (where.$or.length === 0) {
      delete where.$or
    }

    $tickets.findMany({
      select: req.body.select,
      where: where,
      sort: {
        id: -1
      }
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count

        if (data.repeats_only) {
          let arr = []
          docs.forEach(d => {
            let exists = false
            arr.forEach(a => {
              if (a.id === d.id) {
                exists = true
              }
            })
            if (d.repeats) {
              exists = true
            }
            if (exists === false) {
              let count2 = 0;
              docs.forEach(d2 => {
                if (d.id !== d2.id && d2.device_info.serial  && d2.device_info.serial == d.device_info.serial) {
                  count2++
                  d.repeats = d.repeats || []
                  let exists = false
                  d.repeats.forEach(r => {
                    if (r.id === d2.id) {
                      exists = true
                    }
                  })
                  if (d2.repeats) {
                    exists = true
                  }
                  if (exists === false) {
                    d.repeats.push(d2)
                  }

                }
              })
              if (count2 > 0) {
                let exists = false
                arr.forEach(a => {
                  if (a.id === d.id) {
                    exists = true
                  }
                  a.repeats.forEach(a2 => {
                    if (a2.id === d.id) {
                      exists = true
                    }
                  })
                })
                if (exists === false) {
                  arr.push(d)
                }

              }
            }

          })

          response.list = arr
          response.count = arr.length

        }

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


  site.post("/api/tickets/assignEng", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let id = req.data.id
    let eng = site.fromJson(req.data.eng)

    if (id) {
      $tickets.find({
        where: {
          id: id,
        },
        select: {}
      }, (err, doc) => {
        if (!err && doc) {

          if (doc.eng_list === undefined) {
            doc.eng_list = []
          } else {
            doc.eng_list[doc.eng_list.length - 1].close_eng = site.copy(doc.close_eng)
            doc.close_eng = {
              device_info: doc.device_info
            }
          }

          doc.eng_list.push({
            date: new Date(),
            eng: eng,
            user: {
              _id: req.session.user._id,
              id: req.session.user.id,
              email: req.session.user.email,
              name: req.session.user.profile.name
            }
          })

          doc.eng = eng
          doc.close_eng_assign = true
          doc.close_eng_done = false
          doc.close1_done = false
          doc.close2_done = false

          doc.status = {
            id: 4,
            ar: "موزع",
            en: "Assignd"
          }
          doc.assign_user_info = site.security.getUserFinger({
            $req: req,
            $res: res
          })

          $tickets.edit({
            where: {
              id: id
            },
            set: doc,
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
        }
      })


    } else {
      res.json(response)
    }
  })





  site.post("/api/tickets/assignEngAll", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
      return
    }

    let ids = site.fromJson(req.data.ids)
    let eng = site.fromJson(req.data.eng)

    for (let i = 0; i < ids.length; i++) {
      let id = ids[i]

      if (id) {
        $tickets.find({
          where: {
            id: id,
          },
          select: {
            eng: 1,
            eng_list: 1
          }
        }, (err, doc) => {
          if (!err && doc) {
            if (doc.eng_list === undefined) {
              doc.eng_list = []
            }

            doc.eng_list.push({
              date: new Date(),
              eng: eng,
              user: {
                _id: req.session.user._id,
                id: req.session.user.id,
                email: req.session.user.email,
                name: req.session.user.profile.name
              }
            })

            doc.eng = eng
            doc.close_eng_assign = true
            doc.close_eng_done = false
            doc.close1_done = false
            doc.close2_done = false
  
            doc.status = {
              id: 4,
              ar: "موزع",
              en: "Assignd"
            }
            doc.assign_user_info = site.security.getUserFinger({
              $req: req,
              $res: res
            })
  

            $tickets.edit({
              where: {
                id: id
              },
              set: doc,
              $req: req,
              $res: res
            }, err => {
              if (!err) {
                response.done = true
              } else {
                response.error = err.message
              }

            })
          }
        })


      }

    }

    setTimeout(() => {
      res.json(response)
    }, 3000);
  })



  site.post({
    name: '/api/ticket/sources/all',
    path: __dirname + '/site_files/json/ticket_sources.json'
  })

  site.post({
    name: '/api/ticket/services/all',
    path: __dirname + '/site_files/json/ticket_services.json'
  })

  site.post({
    name: '/api/ticket/status/all',
    path: __dirname + '/site_files/json/ticket_status.json'
  })

  site.post({
    name: '/api/ticket/status2/all',
    path: __dirname + '/site_files/json/ticket_status2.json'
  })

  site.post({
    name: '/api/ticket/status3/all',
    path: __dirname + '/site_files/json/ticket_status3.json'
  })

  site.post({
    name: '/api/ticket/review_status/all',
    path: __dirname + '/site_files/json/ticket_review_status.json'
  })

  site.post({
    name: '/api/ticket/date_types/all',
    path: __dirname + '/site_files/json/ticket_date_types.json'
  })

  site.post({
    name: '/api/ticket/user_types/all',
    path: __dirname + '/site_files/json/ticket_user_types.json'
  })

  site.post({
    name: '/api/ticket/priorities/all',
    path: __dirname + '/site_files/json/ticket_priorities.json'
  })

}