
  $scope.addToCloseEngInput = function () {
    $scope.ticket.close_eng.inputs = $scope.ticket.close_eng.inputs || [];
    $scope.ticket.close_eng.inputs.push({
      value: $scope.input.value,
      name: $scope.input.name,
      receet: $scope.input.receet
    });
    $scope.input.value = '';
    $scope.input.name = '';
    $scope.input.receet = '';
  };

  $scope.deleteCloseEngInput = function (input) {
    for (let i = 0; i < $scope.ticket.close_eng.inputs.length; i++) {
      if ($scope.ticket.close_eng.inputs[i].value == input.value && $scope.ticket.close_eng.inputs[i].name == input.name) {
        $scope.ticket.close_eng.inputs.splice(i, 1);
      }
    }
  };


  $scope.addToCloseEngOutput = function () {
    $scope.ticket.close_eng.outputs = $scope.ticket.close_eng.outputs || [];
    $scope.ticket.close_eng.outputs.push({
      value: $scope.output.value,
      name: $scope.output.name
    });
    $scope.output.value = '';
    $scope.output.name = '';
  };



  $scope.deleteCloseEngOutput = function (output) {
    for (let i = 0; i < $scope.ticket.close_eng.outputs.length; i++) {
      if ($scope.ticket.close_eng.outputs[i].value == output.value && $scope.ticket.close_eng.outputs[i].name == output.name) {
        $scope.ticket.close_eng.outputs.splice(i, 1);
      }
    }
  };



  $scope.addToCloseEngItemUsed = function () {
    $scope.ticket.close_eng.item_used_list = $scope.ticket.close_eng.item_used_list || [];
    $scope.ticket.close_eng.item_used_list.push($scope.itemUsed);
    $scope.itemUsed = {};
  };


  $scope.deleteCloseEngItemUsed = function (item) {
    for (let i = 0; i < $scope.ticket.close_eng.item_used_list.length; i++) {
      if ($scope.ticket.close_eng.item_used_list[i].name == item.name) {
        $scope.ticket.close_eng.item_used_list.splice(i, 1);
      }
    }
  };



  $scope.addToCloseEngItemNeed = function () {
    $scope.ticket.close_eng.item_need_list = $scope.ticket.close_eng.item_need_list || [];
    $scope.ticket.close_eng.item_need_list.push({
      name: $scope.itemNeed.name
    });
    $scope.itemNeed.name = '';
  };


  $scope.deleteCloseEngItemNeed = function (item) {
    for (let i = 0; i < $scope.ticket.close_eng.item_need_list.length; i++) {
      if ($scope.ticket.close_eng.item_need_list[i].name == item.name) {
        $scope.ticket.close_eng.item_need_list.splice(i, 1);
      }
    }
  };

  $scope.addToCloseEngItemRecived = function () {
    $scope.ticket.close_eng.item_recived_list = $scope.ticket.close_eng.item_recived_list || [];
    $scope.ticket.close_eng.item_recived_list.push({
      name: $scope.itemRecived.name
    });
    $scope.itemRecived.name = '';
  };


  $scope.deleteCloseEngItemRecived = function (item) {
    for (let i = 0; i < $scope.ticket.close_eng.item_recived_list.length; i++) {
      if ($scope.ticket.close_eng.item_recived_list[i].name == item.name) {
        $scope.ticket.close_eng.item_recived_list.splice(i, 1);
      }
    }
  };

