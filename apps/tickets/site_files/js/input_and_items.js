
  $scope.addToInput = function () {
    $scope.ticket.inputs = $scope.ticket.inputs || [];
    $scope.ticket.inputs.push({
      value: $scope.input.value,
      name: $scope.input.name,
      receet: $scope.input.receet
    });
    $scope.input.value = '';
    $scope.input.name = '';
    $scope.input.receet = '';
  };

  $scope.deleteInput = function (input) {
    for (let i = 0; i < $scope.ticket.inputs.length; i++) {
      if ($scope.ticket.inputs[i].value == input.value && $scope.ticket.inputs[i].name == input.name) {
        $scope.ticket.inputs.splice(i, 1);
      }
    }
  };


  $scope.addToOutput = function () {
    $scope.ticket.outputs = $scope.ticket.outputs || [];
    $scope.ticket.outputs.push({
      value: $scope.output.value,
      name: $scope.output.name
    });
    $scope.output.value = '';
    $scope.output.name = '';
  };



  $scope.deleteOutput = function (output) {
    for (let i = 0; i < $scope.ticket.outputs.length; i++) {
      if ($scope.ticket.outputs[i].value == output.value && $scope.ticket.outputs[i].name == output.name) {
        $scope.ticket.outputs.splice(i, 1);
      }
    }
  };



  $scope.addToItemUsed = function () {
    $scope.ticket.item_used_list = $scope.ticket.item_used_list || [];
    $scope.ticket.item_used_list.push($scope.itemUsed);
    $scope.itemUsed = {};
  };


  $scope.deleteItemUsed = function (item) {
    for (let i = 0; i < $scope.ticket.item_used_list.length; i++) {
      if ($scope.ticket.item_used_list[i].name == item.name) {
        $scope.ticket.item_used_list.splice(i, 1);
      }
    }
  };



  $scope.addToItemNeed = function () {
    $scope.ticket.item_need_list = $scope.ticket.item_need_list || [];
    $scope.ticket.item_need_list.push({
      name: $scope.itemNeed.name
    });
    $scope.itemNeed.name = '';
  };


  $scope.deleteItemNeed = function (item) {
    for (let i = 0; i < $scope.ticket.item_need_list.length; i++) {
      if ($scope.ticket.item_need_list[i].name == item.name) {
        $scope.ticket.item_need_list.splice(i, 1);
      }
    }
  };

  $scope.addToItemRecived = function () {
    $scope.ticket.item_recived_list = $scope.ticket.item_recived_list || [];
    $scope.ticket.item_recived_list.push({
      name: $scope.itemRecived.name
    });
    $scope.itemRecived.name = '';
  };


  $scope.deleteItemRecived = function (item) {
    for (let i = 0; i < $scope.ticket.item_recived_list.length; i++) {
      if ($scope.ticket.item_recived_list[i].name == item.name) {
        $scope.ticket.item_recived_list.splice(i, 1);
      }
    }
  };

