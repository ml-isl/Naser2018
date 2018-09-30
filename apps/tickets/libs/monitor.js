module.exports = function init(site) {

  site.on('mongodb after insert', function (result) {
      if (result.collection === 'tickets') {
        site.call('please monitor action' , { obj : {
          icon: '/images/ticket.png',
          source: "Tickets System",
          source_ar: "نظام البلاغات",
          message_ar: "تم أضافة بلاغ جديد",
          message: "New Tickets Added",
          value: result.doc.code,
          value_ar: result.doc.code,
          add: result.doc,
          action: 'add'
        }, result : result })
      }
  })

  site.on('mongodb after update', function (result) {
      if (result.collection === 'tickets') {
        site.call('please monitor action' , { obj : {
          icon: '/images/ticket.png',
          source: "Tickets System",
          source_ar: "نظام البلاغات",
          message_ar: "تم تعديل بلاغ ",
          message: "New Tickets Updated",
          value: result.doc.code,
          value_ar: result.doc.code,
          update: site.objectDiff(result.update.$set, result.doc),
          action: 'update'
        }, result : result })
      }
  })


  site.on('mongodb after delete', function (result) {
      if (result.collection === 'tickets') {
        site.call('please monitor action' , { obj : {
          icon: '/images/ticket.png',
          source: "Tickets System",
          source_ar: "نظام البلاغات",
          message_ar: "تم حذف بلاغ ",
          message: "Tickets Deleted",
          value: result.doc.code,
          value_ar: result.doc.code,
          delete: result.doc,
          action: 'delete'
        }, result : result })
      }
  })

}
