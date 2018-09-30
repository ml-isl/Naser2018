module.exports = function (site) {


    site.get('importTickets', (req, res) => {

        res.json({
            done: true
        })

        const $tickets = site.connectCollection({
            collection: "tickets",
            db: "crm_naser_tickets_2018"
        })

        const $damages = site.connectCollection('damages')
        const $devices_names = site.connectCollection('devices_names')
        const $customers = site.connectCollection('customers')
        const $employees = site.connectCollection("employees")

        let sql = require("mssql");

    

            function transfairData(__id) {

                sql.connect(site.sql_config, function (err) {

                    if (err) {
                        console.log(err)
                        sql.close()
                        return
                    }
        
                    var request = new sql.Request();
        
            

                request.query(`SELECT TOP (100000) * FROM [MainDatabase].[dbo].[MainApp_Complaints] where ID < ${__id+10001} and ID > ${__id}`, function (err, result) {

                    if (err) {
                        console.log(err)
                        sql.close()
                        return
                    }
                    req.session.set('__id', (__id + 10000))
                    let tickets = result.recordset

                    request.query('SELECT TOP (1000000) [ID],[Name],[CompanyID],[DeviceID],[ProductID],[Name2] FROM [MainDatabase].[dbo].[MainApp_Models]', function (err, result) {

                        if (err) {
                            console.log(err)
                            sql.close()
                            return
                        }

                        let models = result.recordset
                        sql.close()

                        tickets.forEach((ticket, i) => {
                            let _t = {
                                id: ticket.ID,
                                code: ticket.Code,
                                date: new Date(ticket.ReceivedDate),
                                visit_date: new Date(ticket.SuggestDate),
                                complain: ticket.Complaint,
                                company_codes: [ticket.SapNo],
                                notes: [ticket.CustomerNotes, ticket.SuggestDateNotes],
                                eng: {
                                    id: ticket.TechnicianID
                                },
                                damage: {
                                    id: ticket.ComplaintTypeID
                                },
                                device_info: {
                                    device: {
                                        id: ticket.ProductID
                                    },
                                    serial: ticket.SerialNo
                                },
                                customer: {
                                    id: ticket.CustomerID
                                },
                                done: true
                            }


                            if(ticket.StatusTypeID == 1){
                                _t.status = {"id" : 1 ,   "ar" : "مفتوح" , "en" : "s1"}
                            }else if(ticket.StatusTypeID == 2){
                                _t.status = {"id" : 4 ,   "ar" : "موزع" , "en" : "s4"}
                            }else if(ticket.StatusTypeID == 3){
                                _t.status = {"id" : 6 ,   "ar" : "مؤجل قطع غيار" , "en" : "s6"}
                            }else if(ticket.StatusTypeID == 4){
                                _t.status = {"id" : 3 ,   "ar" : "مغلق بدون قطع غيار" , "en" : "s3"}
                            }else if(ticket.StatusTypeID == 5){
                                _t.status = {"id" : 5 ,   "ar" : "ملغى" , "en" : "s5"}
                            }else if(ticket.StatusTypeID == 6){
                                _t.status = {"id" : 7 ,   "ar" : "مؤجل طرف عميل" , "en" : "s7"}
                            }else if(ticket.StatusTypeID == 7){
                                _t.status = {"id" : 3 ,   "ar" : "مغلق بدون قطع غيار" , "en" : "s3"}
                            }else if(ticket.StatusTypeID == 8){
                                _t.status = {"id" : 2 ,   "ar" : "مغلق بقطع غيار" , "en" : "s2"}
                            }else if(ticket.StatusTypeID == 9){
                                _t.status = {"id" : 7 ,   "ar" : "مؤجل طرف عميل" , "en" : "s7"}
                            }else if(ticket.StatusTypeID == 10){
                                _t.status = {"id" : 6 ,   "ar" : "مؤجل قطع غيار" , "en" : "s6"}
                            }else if(ticket.StatusTypeID == 11){
                                _t.status = {"id" : 11 ,   "ar" : "مؤجل لاتصال العميل" , "en" : "s11"}
                            }else if(ticket.StatusTypeID == 12){
                                _t.status = {"id" : 11 ,   "ar" : "مؤجل لاتصال العميل" , "en" : "s11"}
                            }else if(ticket.StatusTypeID == 13){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                            }else if(ticket.StatusTypeID == 14){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                            }else if(ticket.StatusTypeID == 15){
                                _t.status = {"id" : 9 ,   "ar" : "سحب للشركة" , "en" : "s9"}
                            }else if(ticket.StatusTypeID == 16){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                                _t.status3 = {"id" : 6 ,   "ar" : "مفتوح" , "en" : "Open"}
                            }else if(ticket.StatusTypeID == 17){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                                _t.status3 = {"id" : 1 ,   "ar" : "الجهاز قيد التسليم" , "en" : "Proccing"}
                            }else if(ticket.StatusTypeID == 18){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                                _t.status3 = {"id" : 3 ,   "ar" : "مغلق" , "en" : "Closed"}
                            }else if(ticket.StatusTypeID == 19){
                                _t.status = {"id" : 8 ,   "ar" : "سحب للورشة" , "en" : "s8"}
                                _t.status3 = {"id" : 2 ,   "ar" : "مؤجل قطع غيار" , "en" : "Need Items"}
                            }else if(ticket.StatusTypeID == 20){
                                _t.status =  {"id" : 3 ,   "ar" : "مغلق بدون قطع غيار" , "en" : "s3"}
                            }else if(ticket.StatusTypeID == 21){
                                _t.status =  {"id" : 15 ,   "ar" : "الكهرباء مقطوعة" , "en" : "s15"}
                            }else if(ticket.StatusTypeID == 22){
                                _t.status =  {"id" : 7 ,   "ar" : "مؤجل طرف عميل" , "en" : "s7"}
                            }else if(ticket.StatusTypeID == 23){
                                _t.status =  {"id" : 5 ,   "ar" : "ملغى" , "en" : "s5"}
                            }else if(ticket.StatusTypeID == 24){
                                _t.status =  {"id" : 5 ,   "ar" : "ملغى" , "en" : "s5"}
                            }else{
                                _t.status = {"id" : 3 ,   "ar" : "مغلق بدون قطع غيار" , "en" : "s3"}
                            }

                            $tickets.add(_t, (err, doc) => {
                                if (!err && doc) {

                                    console.log(` ( ${i+1} ) Tickets Added : ${doc.id}`)

                                    $employees.get({
                                        id: doc.eng.id
                                    }, (err, eng1) => {
                                        if (!err && eng1) {
                                            doc.eng = {
                                                id: eng1.id,
                                                name: eng1.name
                                            }
                                            $tickets.update(doc)
                                        }
                                    })


                                    $damages.get({
                                        id: doc.damage.id
                                    }, (err, d1) => {
                                        if (!err && d1) {
                                            doc.damage = {
                                                id: d1.id,
                                                name: d1.name
                                            }
                                            $tickets.update(doc)
                                        }
                                    })

                                   

                                    $devices_names.get({
                                        id: doc.device_info.device.id
                                    }, (err, d2) => {
                                        if (!err && d2) {
                                            doc.device_info.company = d2.company
                                            doc.device_info.category = d2.category
                                            doc.device_info.sub_category = d2.sub_category
                                            doc.device_info.device = {
                                                id: d2.id,
                                                name: d2.name
                                            }
                                            if (ticket.ModelID) {

                                            }
                                            models.forEach(mo => {
                                                if (ticket.ModelID == mo.ID) {
                                                    doc.device_info.model = {
                                                        id: mo.ID,
                                                        name: mo.Name,
                                                        alt: mo.Name2
                                                    }
                                                }
                                            })
                                            $tickets.update(doc , ()=>{
                                                $customers.get({
                                                    id: doc.customer.id
                                                }, (err, c1) => {
                                                    if (!err && c1) {
                                                        c1.devices = c1.devices || []
                                                        let cd_exists = false
                                                        c1.devices.forEach(cd=>{
                                                            if(cd.company && cd.company.id == doc.device_info.company.id){
                                                                if(cd.category && cd.category.id == doc.device_info.category.id){
                                                                    if(cd.sub_category && cd.sub_category.id == doc.device_info.sub_category.id){
                                                                        if(cd.device && cd.device.id == doc.device_info.device.id){
                                                                            cd_exists = true
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        })
                                                        if(!cd_exists){
                                                            c1.devices.push(doc.device_info)
                                                            $customers.update(c1)
                                                        }
                                                        doc.customer = {
                                                            id : c1.id,
                                                            name : c1.name,
                                                            gov : c1.gov,
                                                            city : c1.city,
                                                            region : c1.region,
                                                            town : c1.town,
                                                            address : c1.address,
                                                            phones : c1.phones,
                                                            mobiles : c1.mobiles
                                                        }
                                                        $tickets.update(doc)
                                                    }
                                                })
                                            })
                                         
                                        }
                                    })



                                } else {
                                    console.log(err)
                                }

                            })
                        })



                    })
                })

            })
            }


            var ticket_id = 0
            $tickets.drop(() => {
                site.log(ticket_id)
                transfairData(ticket_id)
                ticket_id += 10000
                var tt = setInterval(() => {
                    site.log(ticket_id)
                    transfairData(ticket_id)
                    ticket_id += 10000

                    if (ticket_id > 500000) {
                        clearInterval(tt)
                    }
                }, 1000 * 60 * 2)
            })






        
    })

}