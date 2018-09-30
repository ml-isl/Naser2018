module.exports = function init(site) {


  site.get({
    name: "amounts_report",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })



}