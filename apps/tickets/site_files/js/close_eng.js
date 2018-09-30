$scope.showOrder = function(){
  site.showModal('#orderModal');
}

$scope.filterOrders = function(){
  $scope.order_list = []
  $http({
    method: "POST",
    url: "/api/tickets/all",
    data: {
      where: { 'status.id':4, 'customer.region.id' : $scope.loadRegions.id , 'eng.id':$scope.eng.id}
    }
  }).then(
    function (response) {
      if (response.data.done && response.data.list.length > 0) {
        response.data.list.forEach((itm , i)=>{
          itm.index = i+1
        })
        $scope.order_list = response.data.list
      }
    })

}
$scope.showAssignEng = function (id, eng) {
    $scope.error = '';
    $scope.id = id;
    $scope.eng = eng || {};
    site.showModal('#engSelectModal');
  };

  
  $scope.showcloseEng = function (t) {
    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t , (t2)=>{
      $scope.loadEngItemList(t2.eng);
    });
    $scope.ticket = {};
    site.showModal('#closeEngModal');
    
  };

  
  $scope.assignEng = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/assignEng",
      data: {
        id: $scope.id,
        eng: $scope.eng
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#engSelectModal');
          $scope.list.filter(t => t.id == $scope.id).forEach(t => {
            t.eng = site.fromJson($scope.eng);
            t.close_eng_assign = true;
            t.status = {
              id: 3,
              ar: "موزع",
              en: "Assignd"
            };
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.assignEngAll = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/assignEngAll",
      data: {
        eng: $scope.eng,
        ids: $scope.list.filter(t => t.$select == true).map(t => t.id)
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#engSelectAllModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.loadEngList = function () {


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        where: {},
        select: {
          id: 1,
          name: 1,
          mobiles: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.backToCloseEng = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/BackToCloseEng",
      data: {
        id: $scope.ticket.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#close1Modal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.error = err;
      }
    );
  };

  $scope.updateCloseEng = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateCloseEng",

      data: {
        ticket: $scope.ticket
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTicketModal');
          site.hideModal('#closeEngModal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };