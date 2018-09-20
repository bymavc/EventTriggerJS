function EventTrigger(callback, options) {

    //Defaults, used to set the options
    var defaults = {
        trigger: 'exitIntent',
        percentDown: 50,
        percentUp: 5,
        checkInterval: 200
    };

    this.complete = false; //Used to check if callback has been executed so that it won't get executed more than once
    this.interval = null;
    this.callback = callback; //Sets the callback pased to function
    this.options = $.extend(defaults, options); //set options or defaults

    //Initializer
    this.init = function(){
        switch(this.options.trigger){
            case "exitIntent":
            this.exitIntent();
            break;
            case "scrollDown":
            this.scrollDownHandler();
            break;
            case "scrollUp":
            this.scrollUpHandler();
            break;
        }
    }

    //Handler for exit intent to trigger a function
    this.exitIntent = function(){
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