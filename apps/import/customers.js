module.exports = function (site) {

    site.get('importCustomers', (req, res) => {

        let default_gov = {
            id: 1,
            name: 'منوفية'
        }

        res.json({
            done: true
        })

        let sql = require("mssql");
        
        sql.connect(site.sql_config, function (err) {
            if (err) {
                console.log(err)
                return
            }
            var request = new sql.Request();
            request.query('SELECT top(1000000) [ID],[Name],[Phone],[Mobile1],[Mobile2],[Mobile3],[Address],[CityID],[VillageID],[AreaID] FROM [MainDatabase].[dbo].[MainApp_Customers]', function (err, result) {
                if (err) {
                    console.log(err)
                    return
                }

                let customers = result.recordset
                sql.close()

                let $customers = site.connectCollection('customers')
                let $cities = site.connectCollection('cities')
                let $towns = site.connectCollection('towns')
                let $regions = site.connectCollection('regions')

                console.log(customers.length)

                $customers.drop((err, ok) => {

                    if (ok) {
                        console.log('customers collection droped')
                    }

                    customers.forEach(c => {

                        let c2 = {
                            id: parseInt(c.ID),
                            name: c.Name,
                            phones: [],
                            mobiles: [],
                            gov: default_gov,
                            city_id: parseInt(c.CityID),
                            town_id: parseInt(c.VillageID),
                            region_id: parseInt(c.AreaID),
                            black_list: false,
                            address: c.Address
                        }
                        if (c.Phone) {
                            c2.phones.push(c.Phone)
                        }
                        if (c.Mobile1) {
                            c2.mobiles.push(c.Mobile1)
                        }
                        if (c.Mobile2) {
                            c2.mobiles.push(c.Mobile2)
                        }
                        if (c.Mobile3) {
                            c2.mobiles.push(c.Mobile3)
                        }

                        $customers.add(c2, (err, doc) => {
                            if (!err) {
                                console.log('customer added : ' + doc.id)
                                $cities.find({
                                    id: doc.city_id
                                }, (err, doc2) => {
                                    if (!err && doc2) {
                                        doc.city = {
                                            id: doc2.id,
                                            name: doc2.name
                                        }
                                        $customers.update(doc)
                                        console.log('customer city updated : ' + doc.id)
                                    }

                                })

                                $regions.find({
                                    id: doc.region_id
                                }, (err, doc2) => {
                                    if (!err && doc2) {
                                        doc.region = {
                                            id: doc2.id,
                                            name: doc2.name
                                        }
                                        $customers.update(doc)
                                        console.log('customer region updated : ' + doc.id)
                                    }

                                })

                                $towns.find({
                                    id: doc.town_id
                                }, (err, doc2) => {
                                    if (!err && doc2) {
                                        doc.town = {
                                            id: doc2.id,
                                            name: doc2.name
                                        }
                                        $customers.update(doc)
                                        console.log('customer town updated : ' + doc.id)
                                    }else{
                                        console.log(err)
                                    }

                                })

                            }
                        })
                    })
                })


            })
        })
    })


}