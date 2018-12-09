# EventTriggerJS
A Vanilla Javascript function to trigger functions based in some specific events.

This is useful if you want to show a Modal or to make an anouncement in an smarter way than just popping it up when page loads, works both for Web and Mobile devices.

### Basic Usage

```javascript
var et = new EventTrigger(callback, options);
```

### Options

|Option|Default|Type|Description|
|---|:---:|:---:|---|
|trigger|`timeout`|`string`|The event to trigger callback function: `timeout`,`targetIn`, `targetOut`, `exitIntent`, `scrollDown` or `scrollUp`.|
|target|`""`|`string`|The ID of a DOM element to use as a reference for the trigger.
|timeout|`0`|`number`|Time in miliseconds that needs to pass to trigger the callback function.|
|percentDown|`50`|`number`|Percentage of the document that needs to be scrolled down to trigger callback function.|
|percentUp|`5`|`number`|Percentage of the document that need to be scrolled up to trigger callback function.|
|checkInterval|`200`|`number`|Time in miliseconds to check if conditions are meet to trigger callback function.|

### Example
```javascript
function testAlert(){
    alert("This is an alert!");
}

// Triggers after 5 seconds
var et1 = new EventTrigger(testAlert, {trigger: 'timeout', timeout: 5000});

// Triggers when specified DOM element is in viewport
var et2 = new EventTrigger(testAlert, {trigger: 'targetIn', target: "elementID"});

// Triggers when specified DOM element is out of viewport
var et3 = new EventTrigger(testAlert, {trigger: 'targetOut', target: "elementID"});

// Triggers when mouse leaves the page
var et4 = new EventTrigger(testAlert, {trigger: 'exitIntent'});

// Triggers when scroll down 60% of the page
var et5 = new EventTrigger(testAlert, {trigger: 'scrollDown', percentDown: 60});

// Triggers when scroll up 10% of the page
var et6 = new EventTrigger(testAlert, {trigger: 'scrollUp', percentUp: 10});

// You can use triggers inside other triggers
// Triggers after scrolling down 50% of the page and then scrolling up 10% of the page
var et7 = new EventTrigger(function(){
    var et8 = new EventTrigger(testAlert, {trigger: 'scrollUp', percentUp: 10})
},{trigger: 'scrollDown', percentDown: 50})

```

### License 

The MIT License (MIT)

