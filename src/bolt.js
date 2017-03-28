window.B = (function(R, $A){

    return function(c, details){
        
        /**
         * [log checks for message and logs message to console]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-27T13:26:46-0600
         * @param  {[type]}                 message [message to be logged]
         */
        var log = function(message, tab, end){
            if(details){
                tab = tab ? '\t' : '';
                end = end ? '\n' : '';
                console.log('BOLT::' + c.name + '::  ' + tab + message + end);
            }
        };

        /**
         * [findComp given aura:Id, returns a component]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T15:17:15-0600
         * @param  {[string]}                 auraId [an aura:id]
         * @return {[lightning component]}    [a lightning component with given aura:id]
         */
        var findComp = function (auraId){
            log('Finding Comp: ' + auraId); 
            return c.find(auraId);
        };

        /**
         * [findComps Given an array of aura:ids, returns an array of components]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T15:17:15-0600
         * [findComps curried function takes array of aura:ids and returns array of components]
         */
        var findComps = R.map(findComp);
        
        /**
         * [fireEvent Given an event string and optional parameters, fires a lightning application event]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T22:01:38-0600
         * @param  {[String]}                 event   [string of application event]
         * @param  {[type]}                 params [event attribute params]
         */
        var fireEvent = function(event, params){
            log('Firing Event: ' + event);
            var event = $A.get(event);
            if(params){
                log('With params: ' + params, true);
                event.setParams(params);
            }
            event.fire();
            log('Event Fired', true, true);
        };
        
        /**
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T15:17:15-0600
         * [getComps curried function Given a map of styles to ids, returns map of styles to components]
         */
        var getComps = R.mapObjIndexed(findComps);
        
        /**
         * [toastEvent Given title and message strings, fires an application toast event]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T20:51:16-0600
         * @param  {[String]}                 title
         * @param  {[String]}                 message 
         */
        var toastEvent = function(title, message){
            log('Toasting Event: ' + title);
            log('With message: ' + message, true);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "message": message
            });
            toastEvent.fire();
            log('Event Fired', true, true);
        };

        /**
         * [setCallback Given optional callback functions, fires builds callback conditions for lightning action response]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T20:45:00-0600
         * @param  {[type]}                 response [response from apex action]
         * @param  {[type]}                 options  [object with three optional callbacks for success, incomplete, or error]
         */
        var setCallback = function(options){
          
          return function(response){
                var state = response.getState();
                log('Setting Callback for State: ' + state);
                log('With options: ' + options, true); 
                if (state === 'SUCCESS') {                
                    log('State: ' + state)
                    log('With return value: ' + response.getReturnValue(), true); 
                    if(options.success){
                        log('Executing Success Callback:', true);
                        log('\n\n\t\t  ' + options.success, true); 
                        options.success(response.getReturnValue());
                        log('SUCCESS Callback Executed', true, true);
                    }
                }
                else if (state === 'INCOMPLETE') {
                    log('State: ' + state, true); 
                    toastEvent('Transaction Incomplete:', 'We\'re sorry, there was no response from the server or client is offline.');
                    if(options.incomplete){
                        log('Executing Incomplete Callback:', true);
                        log('\n\n\t\t  ' + options.incomplete, true); 
                        options.incopmlete();
                        log('INCOMPLETE Callback Executed', true, true);
                    }
                }
                else if (state === 'ERROR') {
                    var error = response.getError();
                    log('State: ' + state);
                    log('With error: ' + error, true); 
                    toastEvent('Server Error:', error);
                    if(options.error){
                        log('Executing Success Callback:', true);
                        log('\n\n\t\t  ' + options.error, true); 
                        options.error(error);
                        log('ERROR Callback Executed', true, true);

                    }
                }
            };
        };

        /**
         * [toggleStyle Given aura:Id and style, toggles style on relevant component]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T21:21:39-0600
         * @param  {[type]}                 auraId [aura:id of component toggle Class]
         * @param  {[type]}                 style  [style to toggle]
         */
        var toggleStyle = function (auraId, style) {
            log('Toggling Style: ' + style);
            log('For component Id: ' + auraId, true); 
            $A.util.toggleClass(findComp(auraId), style);
            log('Style Toggled', true, true);   
        };

        /**
         * [toggleStylesList Given array of of components and style, toggles style for each component in array]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T15:24:29-0600
         * @param  {[Array]}                 cmps  [Array of lightning components]
         * @param  {[String]}                style [style to be toggled]
         * @return {[type]}                       [description]
         */
        var toggleStylesList = function (cmps, style) {
            log('Toggling Style: ' + style);
            log('For list of components: ' + cmps, true); 
            R.forEach(function(cmp){
               log('Toggling Style: ' + style, true);
               log('For component: ' + cmp, true); 
               $A.util.toggleClass(cmp, style);
            }, cmps); 
            log('Styles List Toggled', true, true);
        };
        
        /**
         * [toggleStylesMap Curried function given object with styles to arrays of aura:ids, returns object with styles to arrays of components]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T15:17:15-0600
         */
        var toggleStylesMap = R.forEachObjIndexed(toggleStylesList);

        /**
         * [act Given event string, optional params, and optional callbacks, gets action, sets params, sets Callbacks, and enqueues action]
         * @author Rob Bruhn, rbruhn@gobyinc.com
         * @date   2017-03-21T22:11:46-0600
         * @param  {[String]}                 action [apex action to fire]
         * @param  {[String]}                  params [object with optional params for given action]
         * @param  {[String]}                 options [object with three optional callbacks for success, incomplete, or error]
         */
        var act = function(actionString, params, options){
            log('Setting up action: ' + actionString); 
            var action = c.get(actionString);
            if(params){
                log('Params: ' + params, true); 
                action.setParams(params);
            }
            log('Setting Callback', true); 
            action.setCallback(this, setCallback(options));
            log('Enqueing action!!!', true); 
            $A.enqueueAction(action);
            log('Action Enqueued', true, true);
        };

        return {
            act: act,
            fireEvent: fireEvent,
            getComps: getComps,
            setCallback: setCallback,
            toastEvent: toastEvent,
            toggleStyle: toggleStyle,
            toggleStylesList: toggleStylesList,
            toggleStylesMap: toggleStylesMap
        };
    };

})(R, $A);
