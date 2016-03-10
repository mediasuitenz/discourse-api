exports = module.exports = function(Discourse, actionTypeEnum) {

  "use strict";

  var actionTypeEnum = actionTypeEnum;

  Discourse.prototype.activateUser = function (id, username, callback) {
    this.put('admin/users/' + id + '/activate',
      {context: 'admin/users/' + username},
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  Discourse.prototype.approveUser = function (id, username, callback) {
    this.put('admin/users/' + id + '/approve',
      {context: 'admin/users/' + username},
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  Discourse.prototype.createUser = function (name, email, username, password, active, callback) {

    var that = this;

    that.post('users',
      {
        'name': name,
        'email': email,
        'username': username,
        'password': password,
        'active': active
      },
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.deleteUser = function (id, username, callback) {
    this.delete('admin/users/' + id + '.json',
      {context: '/admin/users/' + username},
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  /**
   * Delete user and block their email and IP address
   * @param id
   * @param username
   * @param callback
   */
  Discourse.prototype.deleteAndBlockUser = function (id, username, callback) {
    this.delete('/admin/users/' + id + '.json',
      {
        context: '/admin/users/' + username,
        block_email: true,
        block_urls: true,
        block_ip: true
      },
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  Discourse.prototype.deleteAndBlockUserSync = function(id, username) {

    return this.deleteSync('admin/users/' + id + '.json', {
      context: '/admin/users/' + username,
      block_email: true,
      block_urls: true,
      block_ip: true
    });
  };

  /**
   * Filter users by username, email, or IP address via the Admin list of active users
   * @param {String} filter - username, email or IP address for partial matching against users
   * @param callback
   */
  Discourse.prototype.filterUsers = function (filter, callback) {
    this.get('admin/users/list/active.json', { filter: filter, show_emails: true }, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  /**
   * Filter users by username, email, or IP address via the Admin list of active users
   * @param {String} filter - username, email or IP address for partial matching against users
   * @return Array of up to 100 user objects
   */
  Discourse.prototype.filterUsersSync = function(filter) {
    return JSON.parse(this.getSync('admin/users/list/active.json', { filter: filter, show_emails: true }, true).body);
  }


  Discourse.prototype.getUser = function (username, callback) {
    this.get('users/' + username + '.json',
      {},
      function (error, body, httpCode) {

        if (error) return callback(error, null);

        try {
          var json = JSON.parse(body);
          if (json.user.id) return callback(null, json);
          else return callback(null, null);
        }
        catch (err) {
          return callback(err, null);
        }

      }
    );
  };

  Discourse.prototype.getUserActivity = function (username, filterCodes, offset, callback) {
    // Support the old argument structure
    if (typeof offset === 'function') {
      callback = offset;
      offset = typeof filterCodes === 'number' ? filterCodes : 0;
    }
    this.get('user_actions.json',
      {
        username: username,
        filter: (filterCodes == null || !filterCodes.length) ? ACTIVITY_TYPES.REPLY : filterCodes.join(','),
        offset: offset || 0
      },
      callback
    );
  };

  Discourse.prototype.login = function (username, password, callback) {
    this.post('session', {'login': username, 'password': password}, function (error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.logout = function (username, callback) {
    this.delete('session/' + username, {}, function (error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.fetchConfirmationValue = function (callback) {

    // discourse api should bypass the honeypot since it is a trusted user (confirmed via api key)

    this.get('users/hp.json',
      {},
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.getUserEmail = function (username, callback) {
    this.put('users/' + username + '/emails.json',
      {context: '/users/' + username + '/activity'},
      function (error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  Discourse.prototype.getByExternalId = function (externalId, callback) {
    this.get('users/by-external/' + externalId + '.json',
      {},
      callback
    );
  };

  Discourse.prototype.ssoLogout = function (discourseUserId, callback) {
    this.post('admin/users/' + discourseUserId + '/log_out',
      {},
      callback
    );
  };
};
