module.exports = function init(site) {

  site.on('mongodb after insert', function (result) {
      if (result.collection === 'stores') {
        site.call('please monitor action' , { obj : {
          icon: '/images/store.png',
          source: "Stores System",
          source_ar: "نظام المخازن",
          message: "New Store Added",
          message_ar: "تم أضافة مخزن جديد",
          value: result.doc.name,
          value_ar: result.doc.name,
          add: result.doc,
          action: 'add'
        }, result : result })
      }
  })

  site.on('mongodb after update', function (result) {
      if (result.collection === 'stores') {
        site.call('please monitor action' , { obj : {
          icon: '/images/store.png',
          source: "Stores System",
          source_ar: "نظام المخازن",
          message: "New Store Updated",
          message_ar: "تم تعديل مخزن ",
          value: result.doc.name,
          value_ar: result.doc.name,
          update: site.objectDiff(result.update.$set, result.doc),
          action: 'update'
        }, result : result })
      }
  })


  site.on('mongodb after delete', function (result) {
      if (result.collection === 'stores') {
        site.call('please monitor action' , { obj : {
          icon: '/images/store.png',
          source: "Stores System",
          source_ar: "نظام المخازن",
          message: " Store Deleted",
          message_ar: "تم حذف مخزن ",
          value: result.doc.name,
          value_ar: result.doc.name,
          delete: result.doc,
          action: 'delete'
        }, result : result })
      }
  })

}