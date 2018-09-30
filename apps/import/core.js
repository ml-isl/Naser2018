module.exports = function (site) {

    $departments = site.connectCollection('departments')
    $jobs = site.connectCollection('jobs')
    $employees_degrees = site.connectCollection('employees_degrees')
    $militaries_status = site.connectCollection('militaries_status')
    $maritals_status = site.connectCollection('maritals_status')
    $tickets_slides = site.connectCollection('tickets_slides')
    
    
    // setInterval(()=>{
    //     $departments.export({} , __dirname + '/db/departments.json')
    //     $jobs.export({} , __dirname + '/db/jobs.json')
    //     $employees_degrees.export({} , __dirname + '/db/employees_degrees.json')
    //     $militaries_status.export({} , __dirname + '/db/militaries_status.json')
    //     $maritals_status.export({} , __dirname + '/db/maritals_status.json')
    //     $tickets_slides.export({} , __dirname + '/db/tickets_slides.json')
    // } , 1000 * 10)

    site.get('importCore', (req, res) => {

        res.json({
            done: true
        })


        $departments. import(__dirname + '/db/departments.json')
        $jobs. import(__dirname + '/db/jobs.json')
        $employees_degrees. import(__dirname + '/db/employees_degrees.json')
        $militaries_status. import(__dirname + '/db/militaries_status.json')
        $maritals_status. import(__dirname + '/db/maritals_status.json')
        $tickets_slides. import(__dirname + '/db/tickets_slides.json')

    })

}