
  $scope.showNotes = function (t) {
    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t);
    $scope.ticket = {};
    site.showModal('#ticketNotesModal');
  };

  $scope.showFiles = function (t) {
    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t);
    $scope.ticket = {};
    site.showModal('#ticketFilesModal');
  };

  $scope.addToNotes = function () {
    $scope.ticket.notes = $scope.ticket.notes || [];
    $scope.ticket.notes.push($scope.note);
    $scope.note = '';
  };

  $scope.deleteNote = function (n) {
    for (let i = 0; i < $scope.ticket.notes.length; i++) {
      if ($scope.ticket.notes[i] == n) {
        $scope.ticket.notes.splice(i, 1);
      }
    }
  };

  
  $scope.updateNotes = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateNotes",

      data: {
        id: $scope.ticket.id,
        notes: $scope.ticket.notes
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.updateOneTicket($scope.ticket);
          site.hideModal('#ticketNotesModal');
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  
  $scope.updateFiles = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateFiles",

      data: {
        id: $scope.ticket.id,
        files: $scope.ticket.files
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.updateOneTicket($scope.ticket);
          site.hideModal('#ticketFilesModal');
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  
  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/ticket/upload/file', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.fileStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.fileStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.fileStatus = "File Uploaded";
        $scope.ticket.files = $scope.ticket.files || [];
        $scope.ticket.files.push({
          url: res.data.file_url,
          name: $scope.fileName || res.data.file_name
        });
        $scope.fileName = '';
      }
    }, function (error) {
      $scope.fileStatus = error;
    });
  };

  $scope.deleteFile = function (file) {
    for (let i = 0; i < $scope.ticket.files.length; i++) {
      let f = $scope.ticket.files[i];
      if (f.url === file.url) {
        $scope.ticket.files.splice(i, 1);
        return;
      }
    }
  };


  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/tickets/upload/image', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.uploadStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.uploadStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.uploadStatus = "File Uploaded";
        $scope.ticket.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  
  $scope.print = function (t, id) {
    site.printHTML({
      select: id || '#print_' + t.id,
      ignores: ['.btn']
    });


    $scope.updatePrint(t);

  };


  $scope.printReccet = function (t, id) {
    
    $scope.view(t);
    site.showModal('#ticketReccetModal');

  };

  $scope.updatePrint = function (t) {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updatePrint",
      data: t
    }).then(
      function (response) {
        $scope.busy = false;
      },
      function (err) {}
    )
  };