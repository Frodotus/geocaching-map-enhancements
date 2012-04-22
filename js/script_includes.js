var enhanced = false;
function getMessage(msgEvent) {

    if (msgEvent.name == "enhancedNotesSettings"){
        if(!enhanced){
            var enhancementSettings = msgEvent.message;
            if(enhancementSettings['enhanced_notes_enabled'] != 'disabled'){
    
                var script = document.createElement("script"); 
                script.src = "https://raw.github.com/Frodotus/geocaching-map-enhancements/master/js/tiny_mce/jquery.tinymce.js"
                document.body.insertBefore(script, document.body.firstChild);
/*    
                var init_script = document.createElement("script"); 
                init_script.innerHTML = "var extension_baseURI = '"+safari.extension.baseURI+"'";
                document.body.insertBefore(init_script, document.body.firstChild);
*/  
            }
            enhanced = true;
        }
//        alert("Value for asked setting is: " + msgEvent.message['enhanced_notes_remote_database_url']);
    }
}

safari.self.tab.dispatchMessage("getEnhancedNotesSettings", ""); // ask for value
safari.self.addEventListener("message", getMessage, false); // wait for reply
