/**
 * Summary.
 * @file This file defines the Event Trigger function
 * @author bymavc.
 * @version 1.0.2
 */

/**
 * Sets an function to be triggered on specific events
 * @param {function} callback 
 * @param {Object} options 
 */
function EventTrigger(callback, options) {

    /**
     * Merge defaults with user options
     * @param {Object} defaults 
     * @param {Object} options 
     * @returns {Object} Merged values of defaults and options
     */
    let extend = function (defaults, options) {
        let extended = {};
        let p;
        for (opt in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, p)) {
                extended[p] = defaults[p];
            }
        }
        for (opt in options) {
            if (Object.prototype.hasOwnProperty.call(options, p)) {
                extended[p] = options[p];
            }
        }
        return extended;
    }

    /**
     * Default options
     * If no options are given
     */
    var defaults = {
        trigger: 'timeout',
        target: '',
        timeout: 0,
        percentDown: 50,
        percentUp: 5,
        checkInterval: 200
    };

    this.complete = false;                      // Contains if the trigger has been fire
    this.interval = null;                       // Contains the amount of time between intervals
    this.timer = null;                          // Contains the timeout set when trigger is timeout
    this.callback = callback;                   // Contains the callback function
    this.options = extend(defaults, options);   // Contains the options for the current trigger set

    /**
     * Initialize the event trigger
     */
    this.init = function(){
        switch(this.options.trigger){
            case "timeout":
                this.timeoutHandler();
                break;
            case "target":
                this.targetHandler();
                break;
            case "exitIntent":
                this.exitIntentHandler();
                break;
            case "scrollDown":
                this.scrollDownHandler();
                break;
            case "scrollUp":
                this.scrollUpHandler();
                break;
        }
    }

    /**
     * Handler for Timeout Based Trigger
     * Triggers callback function when timeout finishes
     */
    this.timeoutHandler = function(){
        this.timer = setTimeout(this.callback, this.options.timeout);
    }

    /**
     * Handler for Target Based Trigger
     * Triggers callback function when scroll reaches the specified DOM element
     */
    this.targetHandler = function () {
        if (!document.getElementById(this.options.target)) {
            this.complete = true;
        } else {
            let targetPosition = document.getElementById(this.options.target).offsetTop;
            
            let trigger = this;

            this.interval = setInterval(function () { 
                if (window.scrollY >= targetPosition) {
                    clearInterval(trigger.interval);
                    trigger.interval = null;
                    if (!trigger.complete) {
                        trigger.callback();
                        trigger.complete = true;
                    }
                }
            }, this.options.checkInterval);
        }
    }

    /**
     * Handler for Exit Intent Based Trigger
     * Triggers callback function when mouse leaves the window
     */
    this.exitIntentHandler = function(){
        let trigger = this;
            
        document.addEventListener("mouseleave", function(e){
            if(!trigger.complete) { 
                trigger.callback();
                trigger.complete = true;
                document.removeEventListener("mouseleave");
            }
        });
    }

    /**
     * Handler for Scroll Up Based Trigger
     * Triggers callback function when scroll reaches the specified percentage of the page 
     */
    this.scrollUpHandler = function(){
        let scrollStart = window.scrollY;
        let pageHeight = document.body.clientHeight;
        
        let trigger = this;
        
        if(pageHeight > 0) {
            this.interval = setInterval(function() {
                let scrollAmount = scrollStart - window.scrollY;
                if(scrollAmount < 0) {
                    scrollAmount = 0;
                    scrollStart = window.scrollY;
                }
                let upScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
                
                if(upScrollPercent > parseFloat(trigger.options.percentUp) / 100) {
                    clearInterval(trigger.interval);
                    trigger.interval = null;
                    
                    if(!trigger.complete) {
                        trigger.callback();
                        trigger.complete = true;
                    }
                }
                
            }, this.options.checkInterval);
        }
    }

    /**
     * Handler for Scroll Down Based Trigger
     * Triggers callback function when scroll reaches the specified percentage of the page 
     */
    this.scrollDownHandler = function(){
        let scrollStart = window.scrollY;
        let pageHeight = document.body.clientHeight;
        
        let trigger = this;
        
        if(pageHeight > 0) {
            this.interval = setInterval(function() {
                let scrollAmount = window.scrollY - scrollStart;
                if(scrollAmount < 0) {
                    scrollAmount = 0;
                    scrollStart = window.scrollY;
                }
                let downScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
                
                if(downScrollPercent > parseFloat(trigger.options.percentDown) / 100) {
                    clearInterval(trigger.interval);
                    trigger.interval = null;
                    
                    if(!trigger.complete) {
                        trigger.callback();
                        trigger.complete = true;
                    }
                }
                
            }, this.options.checkInterval);
        }
    }

    /**
     * Initialize checkers
     */
    this.init();
}