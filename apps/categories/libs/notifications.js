module.exports = function init(site) {

    let collection_name = 'categories'
  
   let source = {
      name : 'categories System' ,
      ar : 'نظام الفئات'
    }
  
    let image_url = '/images/category.png'
    let add_message = {name : 'New Category Added' , ar : 'تم أضافة فئة جديدة'}
    let update_message =  {name : ' Category updated' , ar : 'تم تعديل فئة'}
    let delete_message =  {name : ' Category dleteted' , ar : 'تم حذف فئة '}
  
  
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