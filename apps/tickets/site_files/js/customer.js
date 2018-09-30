$rootScope.$on("newCustomerDone", function (ev, args) {
    $scope.customers = [];
    $scope.ticket.customer = null;
    $scope.customers = [args.doc];
    $timeout(() => {
        $scope.ticket.customer = args.doc;
    }, 250);

});

$rootScope.$on("editCustomerDone", function (ev, args) {
    $scope.customers = [];
    $scope.ticket.customer = null;
    $scope.customers = [args.doc];
    $timeout(() => {
        console.log(args.doc);
        $scope.ticket.customer = args.doc;
    }, 250);

});

$scope.setCustomer = function (customer) {
    $scope.stopLoadCustomerOptions = true;
    $scope.ticket.customer = null;
    $scope.ticket.customer = customer;
    $scope.customers = [];
};

$scope.newCustomer = function () {
    let cus = {};

    if ($scope.customerSearch && $scope.customerSearch.trim().length > 0) {
        cus.mobiles = [$scope.customerSearch];
    }

    $rootScope.$emit("newCustomer", cus);
};

$scope.editCustomer = function () {

    $rootScope.$emit("editCustomer", $scope.ticket.customer);
};

$scope.customerHistory = function (t) {

    site.showModal('#ticketsHistoryModal');
    let where = {};
    where['customer.id'] = t.customer.id;
    $scope.loadAll(where, 2);
};