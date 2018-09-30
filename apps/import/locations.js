module.exports = function (site) {

    let default_gov = {
        id: 1,
        name: 'منوفية'
    }

    site.get('importLocations', (req, res) => {

        res.json({
            done: true
        })

        let $goves = site.connectCollection('goves')
        let $regions = site.connectCollection('regions')
        let $cities = site.connectCollection('cities')
        let $towns = site.connectCollection('towns')

        let sql = require("mssql");
       
        sql.connect(site.sql_config, function (err) {
            if (err) {
                console.log(err)
                sql.close()
                return
            }
            var request = new sql.Request();

            request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Areas]', function (err, result) {

                if (err) {
                    console.log(err)
                    sql.close()
                    return
                }

                let regions = result.recordset


                request.query('SELECT TOP (1000) [ID],[Name] FROM [MainDatabase].[dbo].[MainApp_Cities]', function (err, result) {

                    if (err) {
                        console.log(err)
                        sql.close()
                        return
                    }

                    let cities = result.recordset
                    request.query('SELECT TOP (10000) [ID],[Name],[CityID],[AreaID] FROM [MainDatabase].[dbo].[MainApp_Villages]', function (err, result) {

                        if (err) {
                            console.log(err)
                            sql.close()
                            return
                        }

                        let towns = result.recordset

                        sql.close()

                        $goves.drop(() => {
                            $cities.drop(() => {
                                $towns.drop(() => {
                                    $regions.drop(() => {
                                        console.log('Regions Count : ' + regions.length)
                                        console.log('Cities Count : ' + cities.length)
                                        console.log('Towns Count : ' + towns.length)

                                        $goves.add(default_gov , (err , _gov)=>{
                                            regions.forEach(region =>{
                                                $regions.add({id : region.ID , name : region.Name , gov : default_gov},()=>{
                                                    console.log('region added : ' + region.ID)
                                                })
                                            })
                                            cities.forEach(city =>{
                                                $cities.add({id : city.ID , name : city.Name , gov : default_gov},()=>{
                                                    console.log('city added : ' + city.ID)
                                                })
                                            })

                                            setTimeout(() => {
                                                towns.forEach(town =>{
                                                    let _town = {id : town.ID , name : town.Name , gov : default_gov}
                                                    regions.forEach(region=>{
                                                        if(region.ID == town.AreaID){
                                                            _town.region = {
                                                                id : region.ID,
                                                                name : region.Name
                                                            }
                                                        }
                                                    })
                                                    cities.forEach(city=>{
                                                        if(city.ID == town.CityID){
                                                            _town.city = {
                                                                id : city.ID,
                                                                name : city.Name
                                                            }
                                                        }
                                                    })
                                                    $towns.add(_town,()=>{
                                                        console.log('town added : ' + town.ID)
                                                    })
                                                })
                                            }, 1000 * 5);
                                        })
                                    })
                                })
                            })
                        })

                    })
                })

            })
        })

    })
}