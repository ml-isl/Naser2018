module.exports = function (site) {


    site.get('importEmployees', (req, res) => {

        res.json({
            done: true
        })

        const $employees = site.connectCollection("employees")

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {

            if (err) {
                console.log(err)
                sql.close()
                return
            }

            var request = new sql.Request();

            request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Technicians]', function (err, result) {

                if (err) {
                    console.log(err)
                    sql.close()
                    return
                }

                let employees = result.recordset

                $employees.drop(() => {
                    employees.forEach(employee => {
                        $employees.add({
                            id: employee.ID,
                            name: employee.Name
                        }, () => {
                            console.log('employee added : ' + employee.ID)
                        })
                    })
                })
                sql.close()
            })
        })
    })

}