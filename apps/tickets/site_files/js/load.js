
  $scope.searchAll = function () {
    if($scope.serach.print_status){
      $scope.serach.print_status = $scope.serach.print_status.value;
    }
    $scope.loadAll($scope.search);
  };


  $scope.loadMyTickets = function () {
    $scope.loadAll({'eng.id' : '##user.employee_id##'});
  };


  $scope.loadAll = function (where, n) {

    $scope.busy = true;
    if (n && n === 2) {
      $scope.list2 = [];
    } else {
      $scope.list = [];
    }


    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done && response.data.list.length > 0) {
          $scope.count = response.data.count;
          site.hideModal('#SearchByCodeModal');
          site.hideModal('#SearchByCompanyCodeModal');
          site.hideModal('#SearchByAddressModal');
          site.hideModal('#SearchByEngModal');
          site.hideModal('#SearchByDeviceModal');
          site.hideModal('#SearchByCustomerModal');
          site.hideModal('#SearchModal');

          response.data.list.forEach(t => {
            t.device_info = t.device_info || {}
            t.hours = 0;
            if (t.assign_user_info) {
              t.hours = Math.abs(new Date() - new Date(t.assign_user_info.time)) / 3600000;
            }
          })
          if (n && n == 2) {
            $scope.list2 = response.data.list;
            $scope.list2.forEach(t => {
              t.$hide = true;
            });
          } else {
            $scope.list = response.data.list;
            $scope.list.forEach(t => {
              t.$select = true;
            });
          }

        }else{
          $scope.count = 0;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.loadTickets = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.tickets = response.data.list;
          $scope.count = response.data.count;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadFollowTickets = function () {
    $scope.busy = true;
    let where = {
      'review_done': false ,
      'done': true ,
    }
    $scope.loadAll(where);
  };

  $scope.loadLatesTickets = function () {
    $scope.busy = true;
    let d1 = new Date();
    let d2 = new Date();
    d1.setDate(d1.getDate() - 30);
    d2.setDate(d2.getDate() - 2);

    let where = {
      'close_eng_done': false,
      from_date: d1,
      to_date: d2
    }
    $scope.loadAll(where);
  };

  $scope.loadGoves = function () {

    if ($scope.stopLoadCustomerOptions) {
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.goves = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadCities = function (gov) {
    if ($scope.townBusy == true) {
      return;
    }
    var where = {};

    if (typeof gov === 'string') {
      gov = JSON.parse(gov);
    } else {
      gov = gov || {};
    }
    if (gov && gov.id) {
      where = {
        'gov.id': gov.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.cities = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadTowns = function (city) {
    if ($scope.townBusy == true) {
      return;
    }
    var where = {};

    if (typeof city === 'string') {
      city = JSON.parse(city);
    } else {
      city = city || {};
    }
    if (city && city.id) {
      where = {
        'city.id': city.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/towns/all",
      data: {
        where: where,
        select: {}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.towns = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadRegions = function (town) {

    var where = {};

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.regions = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadDevices = function (sub_category) {
    if ($scope.onChangeStatus == false) {
      return;
    }

    var where = {};

    if (typeof sub_category === 'string') {
      sub_category = JSON.parse(sub_category);
    } else {
      sub_category = sub_category || {};
    }
    if (sub_category && sub_category.id) {
      where = {
        'sub_category.id': sub_category.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_devices/all",
      data: {
        where: where,
        select: {
          id: 1,
          device: 1,
          models: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.device_list = [];
          $scope.model_list = [];
          response.data.list.forEach(co => {
            $scope.device_list.push(co.device);
            $scope.model_list.push({
              device: co.device,
              models: co.models
            })
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadModels = function (device) {
    device = site.fromJson(device);
    $scope.models = [];
    $scope.model_list.forEach(m => {
      if (m.device && device && m.device.id == device.id) {
        $scope.models = m.models;
      }
    })

  };

  $scope.loadDamages = function (sub_category) {

    var where = {};

    if (typeof sub_category === 'string') {
      sub_category = JSON.parse(sub_category);
    } else {
      sub_category = sub_category || {};
    }
    if (sub_category && sub_category.id) {
      where = {
        'sub_category.id': sub_category.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.damages = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Sources = function () {

    $http({
      method: "POST",
      url: "/api/ticket/sources/all",
      data: {}
    }).then(
      function (response) {

        $scope.tickets_sources = response.data;
      },
      function (err) {

        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Services = function () {

    $http({
      method: "POST",
      url: "/api/ticket/services/all",
      data: {}
    }).then(
      function (response) {

        $scope.tickets_services = response.data;
      },
      function (err) {

        $scope.error = err;
      }
    )
  };

  $scope.loadTicketReviewStatus = function () {

    $http({
      method: "POST",
      url: "/api/ticket/review_status/all",
      data: {}
    }).then(
      function (response) {

        $scope.reviewStatus = response.data;
      },
      function (err) {

        $scope.error = err;
      }
    )
  };

  $scope.loadCustomers = function (ev) {
    if (ev.which !== 13) {
      return;
    }

    $scope.customers = [];

    $http({
      method: "POST",
      url: "/api/customers/all",
      data: {
        search: $scope.customerSearch,
        select: {}
      }
    }).then(
      function (response) {

        if (response.data.done && response.data.list.length > 0) {
          $scope.customers = response.data.list;
          $timeout(() => {
            $scope.ticket.customer = response.data.list[0];
          }, 250);

        }
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadCompanies = function () {
    if ($scope.onChangeStatus == false) {
      return;
    }
    $http({
      method: "POST",
      url: "/api/companies/all",
      data: {
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {

        if (response.data.done) {
          $scope.company_list = response.data.list;
        }
      },
      function (err) {

        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Status = function () {

    $http({
      method: "POST",
      url: "/api/ticket/status/all",
      data: {}
    }).then(
      function (response) {
        $scope.tickets_status = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Status2 = function () {

    $http({
      method: "POST",
      url: "/api/ticket/status2/all",
      data: {}
    }).then(
      function (response) {
        $scope.tickets_status2 = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Status3 = function () {

    $http({
      method: "POST",
      url: "/api/ticket/status3/all",
      data: {}
    }).then(
      function (response) {
        $scope.tickets_status3 = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadDateTypes = function () {

    $http({
      method: "POST",
      url: "/api/ticket/date_types/all",
      data: {}
    }).then(
      function (response) {
        $scope.dateTypes = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadUserTypes = function () {

    $http({
      method: "POST",
      url: "/api/ticket/user_types/all",
      data: {}
    }).then(
      function (response) {
        $scope.userTypes = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadTickets_Priorities = function () {

    $http({
      method: "POST",
      url: "/api/ticket/priorities/all"
    }).then(
      function (response) {
        $scope.tickets_priorities = response.data;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadCategories = function (company) {

    if ($scope.onChangeStatus == false) {
      return;
    }

    var where = {};

    if (typeof company === 'string') {
      company = JSON.parse(company);
    } else {
      company = company || {};
    }
    if (company && company.id) {
      where = {
        'company.id': company.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_categories/all",
      data: {
        where: where,
        select: {
          category: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.category_list = [];
          response.data.list.forEach(co => {
            $scope.category_list.push(co.category);
          })
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadSubCategories = function (category) {
    if ($scope.onChangeStatus == false) {
      return;
    }

    var where = {};

    if (typeof category === 'string') {
      category = JSON.parse(category);
    } else {
      category = category || {};
    }
    if (category && category.id) {
      where = {
        'category.id': category.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.sub_category_list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadEngItemList = function(eng){

    let where = {};
    where['eng.id'] = eng.id;
    where['status'] = 'waiting';

    $http({
      method: "POST",
      url: "/api/eng_item_list/all",
      data: {
        where: where,
        select: {}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engItemList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };