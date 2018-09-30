module.exports = function init(site) {

  const $items_cards = site.connectCollection({
    collection: "items_cards",
    db: "crm_naser_items_cards"
  })

  site.items_cards = {}
  site.items_cards.add = function (obj, result, callback) {

    let user = null
    let link = null
    if (result) {
      user = site.security.getUserFinger(result)
      if (result.doc) {
        link = {
          db: result.db,
          collection: result.collection,
          _id: result.doc._id
        }
      }

    }

    $items_cards.add(Object.assign({
      source: '',
      source_ar: '',
      message: '',
      message_ar: '',
      value: '',
      value_ar: '',
      user: user,
      link: link,
      time: new Date().getTime()
    }, obj), callback)
  }


  site.security.on_error = function (result) {

  }
  site.on('user register' , function (result) {
    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "New user Register",
      message_ar: "تم أشتراك مستخدم جديد",
      value: result.doc.email,
      value_ar: result.doc.email,
      add : result.doc,
      action: 'add'
    }, result)
  })

   site.on('user login' , function (result) {

    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "user Login",
      message_ar: "مستخدم سجل دخول",
      value: result.doc.email,
      value_ar: result.doc.email,
      action: 'info'
    }, result)

  })

  site.on('user logout' , function (result) {

    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "user Logout",
      message_ar: "مستخدم سجل خروج",
      value: result.doc.email,
      value_ar: result.doc.email,
      action: 'info'
    }, result)

  })

  site.on('user add' , function (result) {
    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "New user Added",
      message_ar: "تم أضافة مستخدم جديد",
      value: result.doc.email,
      value_ar: result.doc.email,
      add : result.doc,
      action: 'add'
    }, result)
  })

   site.on('user update' , function (result) {

    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "user Updated",
      message_ar: "تم تعديل مستخدم",
      value: result.doc.email,
      value_ar: result.doc.email,
      update : site.objectDiff(result.update.$set , result.doc),
      action: 'update'
    }, result)
  })

   site.on('user delete' , function (result) {
    site.items_cards.add({
      icon: '/images/users.png',
      source: "Security System",
      source_ar: "نظام الحماية",
      message: "user Deleted",
      message_ar: "تم حذف مستخدم ",
      value: result.doc.email,
      value_ar: result.doc.email,
      delete : result.doc,
      action: 'delete'
    }, result)
  })


  site.on('mongodb after insert' , function (result) {
    if (result.collection === 'companies') {
      site.items_cards.add({
        icon: '/images/company.png',
        source: "Companies System",
        source_ar: "نظام الشركات",
        message: "New Company Added",
        message_ar: "تم إضافة شركة جديدة",
        value: result.doc.name,
        value_ar: result.doc.name,
        add : result.doc,
        action: 'add'
      }, result)
    } else if (result.collection === 'goves') {
      site.items_cards.add({
        icon: '/images/gov.png',
        source: "Governorate System",
        source_ar: "نظام المحافظات",
        message: "New governorate Added",
        message_ar: "تم أضافة محافظة جديدة",
        value: result.doc.name,
        value_ar: result.doc.name,
        add : result.doc,
        action: 'add'
      }, result)
    } else {

    }
  })

  site.on('mongodb after update' , function (result) {
    if (result.collection === 'companies') {
      site.items_cards.add({
        icon: '/images/company.png',
        source: "Companies System",
        source_ar: "نظام الشركات",
        message: "Company Updated",
        message_ar: "تم تعديل شركة ",
        value: result.doc.name,
        value_ar: result.doc.name,
        update : site.objectDiff(result.update.$set , result.doc),
        action: 'update'
      }, result)
    } else if (result.collection === 'goves') {
      site.items_cards.add({
        icon: '/images/gov.png',
        source: "Governorate System",
        source_ar: "نظام المحافظات",
        message: "governorate updated",
        message_ar: "تم تعديل محافظة ",
        value: result.doc.name,
        value_ar: result.doc.name,
        update : site.objectDiff(result.update.$set , result.doc),
        action: 'update'
      }, result)
    } else {

    }
  })

  site.on('mongodb after delete' , function (result) {
    if (result.collection === 'companies') {
      site.items_cards.add({
        icon: '/images/company.png',
        source: "Companies System",
        source_ar: "نظام الشركات",
        message: "Company Deleted",
        message_ar: "تم حذف شركة ",
        value: result.doc.name,
        value_ar: result.doc.name,
        delete : result.doc,
        action: 'delete'
      }, result)
    } else if (result.collection === 'goves') {
      site.items_cards.add({
        icon: '/images/gov.png',
        source: "Governorate System",
        source_ar: "نظام المحافظات",
        message: "governorate deleted",
        message_ar: "تم حذف محافظة ",
        value: result.doc.name,
        value_ar: result.doc.name,
        delete : result.doc ,
        action: 'delete'
      }, result)
    }
  })

  site.words.addList(__dirname + '/site_files/json/words.json')

  site.get({
    name: '/items_cards',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html'
  })

  site.post("/api/items_cards/latest", (req, res) => {
    let response = {}
    response.done = false
    $items_cards.findMany({
      sort: {
        time: -1
      },
      limit: 20
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.list = docs
      } else {
        console.log(err)
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/items_cards/all", (req, res) => {
    let response = {}
    response.done = false
    $items_cards.findMany({
      sort: {
        time: -1
      },
      limit: 100
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.list = docs
      } else {
        console.log(err)
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/items_cards/search", (req, res) => {
    let response = {}
    response.done = false
    let data = req.body
    let sort = {}
    let where = {}

    if (data.bySystem) {
      if (data.system == 'security') {
        where.source = 'Security System'
      } else if (data.system == 'governorate') {
        where.source = 'Governorate System'
      } else if (data.system == 'company') {
        where.source = 'Company System'
      } else {
        where.source = data.system
      }
    }

    if (data.byUser && data.user) {
      data.user = site.fromJson(data.user)
      where['user._id'] = $items_cards.ObjectID(data.user._id)
    }

    if (data.byTime && data.time) {
      where.time = data.time
    }

    if (data.byMessage) {
      if (req.session.lang == 'ar') {
        where.message_ar = data.message
      } else if (req.session.lang == 'en') {
        where.message = data.message
      }
    }
    if (data.byValue) {
      if (req.session.lang == 'ar') {
        where.value_ar = data.value
      } else if (req.session.lang == 'en') {
        where.value = data.value
      }
    }
    if (data.bySort) {
      data.sortType = parseInt(data.sortType)
      if (data.sort == 'user') {
        sort['user.id'] = data.sortType
      } else if (data.sort == 'source') {
        sort['source'] = data.sortType
      } else if (data.sort == 'message') {
        sort['message'] = data.sortType
      } else if (data.sort == 'value') {
        sort['value'] = data.sortType
      } else if (data.sort == 'time') {
        sort['time'] = data.sortType
      }
    }

    $items_cards.findMany({
      where: where,
      sort: sort,
      limit: data.limit
    }, (err, docs) => {
      if (!err) {
        response.done = true
        response.list = docs
      } else {
        console.log(err)
        response.error = err.message
      }
      res.json(response)
    })
  })


}