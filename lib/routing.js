module.exports = function init(site) {

  site.get({
    name: "/css/crm.css",
    parser: "css2",
    compress: true,
    path: [
      site.dir + "/css/layout.css",
      site.dir + "/css/navbar.css",
      site.dir + "/css/form.css",
      site.dir + "/css/modal.css",
      site.dir + "/css/fixed_menu.css",
      site.dir + "/css/color.css",
      site.dir + "/css/effect.css",
      site.dir + "/css/table.css",
      site.dir + "/css/tableExport.css"
    ]
  })

  site.get({
    name: "/js",
    path: site.dir + "/js"
  })

  site.get({
    name: "/css",
    path: site.dir + "/css"
  })
  site.get({
    name: "/fonts",
    path: site.dir + "/fonts"
  })
  site.get({
    name: "/images",
    path: site.dir + "/images"
  })
  site.get({
    name: "/json",
    path: site.dir + "/json"
  })
  site.get({
    name: "/html",
    path: site.dir + "/html"
  })

  site.get({
    name: "",
    path: site.dir + "/html/index.html",
    parser: "html",
    compress: true
  })



}