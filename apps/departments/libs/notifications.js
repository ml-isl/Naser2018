module.exports = function init(site) {

    let collection_name = 'departments'
  
   let source = {
      name : 'Jobs And Employees System' ,
      ar : 'نظام الوظائف والموظفين'
    }
  
    let image_url = '/images/department.png'
    let add_message = {name : 'New Department Added' , ar : 'تم أضافة قسم جديدة'}
    let update_message =  {name : ' Department updated' , ar : 'تم تعديل قسم'}
    let delete_message =  {name : ' Department dleteted' , ar : 'تم حذف قسم '}
  
    site.on('mongodb after insert', function (result) {
        if (result.collection === collection_name) {
          site.call('please monitor action' , { obj : {
            icon: image_url,
            source: source,
            message: add_message ,
            value: { name : result.doc.name , ar : result.doc.name},
            add: result.doc,
            action: 'add'
          }, result : result })
        }
    })
  
    site.on('mongodb after update', function (result) {
        if (result.collection === collection_name) {
          site.call('please monitor action' , { obj : {
            icon: image_url,
            source : source,
            message: update_message ,
            value: {name : result.old_doc.name , ar : result.old_doc.name},
            update: site.objectDiff(result.update.$set, result.old_doc),
            action: 'update'
          }, result : result })
        }
    })
  
  
    site.on('mongodb after delete', function (result) {
        if (result.collection === collection_name) {
          site.call('please monitor action' , { obj : {
            icon: image_url,
            source: source ,
            message: delete_message ,
            value: {name : result.doc.name , ar : result.doc.name},
            delete: result.doc,
            action: 'delete'
          }, result : result })
        }
    })
  
  }