function EventTrigger(callback, options) {

    //Defaults, used to set the options
    var defaults = {
        trigger: 'exitIntent',
        timeout: 0,
        percentDown: 50,
        percentUp: 5,
        checkInterval: 200
    };

    this.complete = false; //Used to check if callback has been executed so that it won't get executed more than once
    this.interval = null;
    this.timer = null;
    this.callback = callback; //Sets the callback pased to function
    this.options = {
        trigger: (options.trigger == null) ? defaults.trigger : options.trigger,
        timeout: (options.timeout == null) ? defaults.timeout : options.timeout,
        percentDown: (options.percentDown == null) ? defaults.percentDown : options.percentDown,
        percentUp: (options.percentUp == null) ? defaults.percentUp : options.percentUp,
        checkInterval: (options.checkInterval == null) ? defaults.checkInterval : options.checkInterval
    } //set options or defaults

    //Initializer
    this.init = function(){
        switch(this.options.trigger){
            case "timeout":
            this.timeoutHandler();
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


    //Handler for timeout to trigger a function
    this.timeoutHandler = function(){
        this.timer = setTimeout(this.callback, this.options.timeout);
    }

    //Handler for exit intent to trigger a function
    this.exitIntentHandler = function(){
        let trigger = this;
            
        document.addEventListener("mouseleave", function(e){
            if(!trigger.complete && e.clientY < 0) { 
                trigger.callback();
                trigger.complete = true;
                document.removeEventListener("mouseleave");
            }
        });
    }

    //Handler for scroll up to trigger function based on scroll percentage
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

    //Handler for scroll down to trigger function based on scroll percentage
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

    //Initialize checker
    this.init();
}