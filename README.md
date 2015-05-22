# ajax-request-tracker
Override AJAX Get and Post operations in jQuery or Angular and track how many are active.  
If you do all your AJAX in the `document.ready` state, then you can setup a timer in your `window.load` state to run code when they are complete.  
  
  
##jquery.ajax.tracker.js   
Include this in your project _after_ you load jQuery and it will override the default `$.ajax`, `$.get` and `$.post` operations.  Then you may call `Tracker.Ajax.request.alive` at any time to track how many requests are alive.  
If all your ajax operations happen in the document ready state, as-in `$(function() { ... })` then you may use code like this:  
```
$(window).load(function () {
    var timer = setTimeout(function () {
        if (Tracker.Ajax.requests.alive === 0) {
            // run your code after all ajax requests have completed.
            clearTimeout(timer);
        }
    }, 250);
});
```

##httpService.js   
This is a more sophisticated Angular JS 1.x version of the tracker.  It doesn't automatically overload the `$http` operations, you must do so yourself.  But if you do it will maintain the `pendingRequests` service.  Then you may use it like this:
```
$(window).load(function () {
    var timer = setTimeout(function () {
        if (pendingRequestsService.count() === 0) {
            // run your code after all ajax requests have completed.
            clearTimeout(timer);
        }
    }, 250);
});
```
