module.exports = function init(site) {

    let collection_name = 'companies_devices'
  
   let source = {
      name : 'Companies System' ,
      ar : 'نظام الشركات'
    }
  
    let image_url = '/images/company_device.png'
    let add_message = {name : 'New Company_Model_device Added' , ar : 'تم أضافة موديل جهاز شركة جديدة'}
    let update_message =  {name : ' Company_Model_device updated' , ar : 'تم تعديل موديل جهاز شركة'}
    let delete_message =  {name : ' Company_Model_device dleteted' , ar : 'تم حذف موديل جهاز شركة '}
  
  
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