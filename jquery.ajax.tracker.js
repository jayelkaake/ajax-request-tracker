Tracker.Ajax = {
    requests: {
        alive: 0,
        complete: 0,
        begin: function () {
            Tracker.Ajax.requests.alive++;
            console.log("Ajax alive(" + Tracker.Ajax.requests.alive + ")");
        },
        end: function () {
            Tracker.Ajax.requests.alive--;
            Tracker.Ajax.requests.complete++;
            console.log("Ajax complete (" + Tracker.Ajax.requests.complete + ") alive(" + Tracker.Ajax.requests.alive + ")");
        }
    },
    base: {
        ajax: $.ajax,
        get: $.get,
        post: $.post
    },
    fn: {
        ajax: function(options) {
            Tracker.Ajax.requests.begin();
            return Tracker.Ajax.base.ajax(options).then(function(data) {
                Tracker.Ajax.requests.end();
                return $.Deferred().promise(data);
            });
        },
        get: function (options) {
            Tracker.Ajax.requests.begin();
            Quintiles.Log.Console("Ajax alive(" + Tracker.Ajax.requests.alive + ")");

            return Tracker.Ajax.base.get(options).then(function (data) {
                Tracker.Ajax.requests.end();
                return $.Deferred().promise(data);
            });
        },
        post: function (options) {
            Tracker.Ajax.requests.begin();
            return Tracker.Ajax.base.post(options).then(function (data) {
                Tracker.Ajax.requests.end();
                return $.Deferred().promise(data);
            });
        }
    }
}

$.ajax = Tracker.Ajax.fn.ajax;
$.get = Tracker.Ajax.fn.get;
$.post = Tracker.Ajax.fn.post;