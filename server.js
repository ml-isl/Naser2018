var isite = require("../isite")

const site = isite({
  port : 9090,
  name: "CRM_NASER",
  dir: __dirname + "/site_files",
  saving_time: .2,
  help : true,
  apps : false,
  cache: {
    enabled: true
  },
  security: {
    db: "crm_naser_security_2018"
  },
  session: {
    db: "crm_naser_sessions_2018"
  },
  mongodb: {
    db: "crm_naser_2018",
    limit : 50
  }
})


site.var("full-url", "http://crm-naser.egytag.com")

site.require(__dirname + "/lib/routing")

site.loadApp('static')
site.loadApp('client-side')
site.loadApp('security')
site.loadApp('ui-print')
site.loadApp('notifications')
site.loadApp('import')


site.loadApp('goves')
site.loadApp('cities')
site.loadApp('towns')
site.loadApp('regions')

site.loadApp('customers')
site.loadApp('tickets')
site.loadApp('tickets_slides')


site.loadApp('companies')
site.loadApp('companies_categories')
site.loadApp('companies_devices')
site.loadApp('devices_names')
site.loadApp('categories')
site.loadApp('sub_categories')
site.loadApp('damages')
site.loadApp('damages_calculate')



site.loadApp('employees')
site.loadApp('employee_discount')
site.loadApp('employee_offer')
site.loadApp('employees_degrees')
site.loadApp('engineers_report')
site.loadApp('employees_report')
site.loadApp('companies_employees')
site.loadApp('jobs')
site.loadApp('departments')

site.loadApp('maritals_status')
site.loadApp('militaries_status')


site.loadApp('safes')
site.loadApp('safes_payments')
site.loadApp('eng_item_list')
site.loadApp('stores')
site.loadApp('stores_in')
site.loadApp('stores_out')
site.loadApp('categories_items')
site.loadApp('item_transaction')
site.loadApp('tax_types')
site.loadApp('discount_types')


site.loadApp('amounts_in')
site.loadApp('amounts_out')
site.loadApp('in_out_names')
site.loadApp('amounts_report')



site.loadApp('menu')
site.loadApp('navbar')


site.run()
