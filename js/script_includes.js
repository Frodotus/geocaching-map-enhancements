var enhanced = false;

function markStatusSolved(stat) {
        var id = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();    
        var name = escape($('#ctl00_ContentBody_CacheName').html());        
        var ed;
        var content = "";
        if(editMode){
            ed = tinyMCE.get('cache_note');
            ed.setProgressState(1); // Show progress
            content = ed.getContent();
        } else {
              content = $('#cache_note').html();
        }
        if(enhanced_notes_enabled == 'remote') {
            $.ajax({
              type: 'POST',
              url: enhanced_notes_remote_database_url+"index.php?id="+id+"&status="+stat+"&name="+name,
              data: content,
              success: function ( data ) {
                if(editMode)
                    ed.setProgressState(0);
                alert("Cache marked as solved.");            
              },
            });
        } else if(enhanced_notes_enabled == 'local') {
            var data = localStorage.getItem(id);
            if(data){
                var odata = JSON.parse(data);
                data = {'status': stat, 'name': name, 'content': odata['content']};
            } else {
                data = {'status': stat, 'name': name, content: ''}
            }
            data = JSON.stringify(data);
            localStorage.setItem(id, data);
            alert("Cache marked as solved.");            
        }
}

function ajaxSave() {
        var id = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();    
        var ed = tinyMCE.get('cache_note');
        var name = escape($('#ctl00_ContentBody_CacheName').html());        
        ed.setProgressState(1); // Show progress
        if(enhanced_notes_enabled == 'remote') {
            $.ajax({
              type: 'POST',
              url: enhanced_notes_remote_database_url+"index.php?id="+id+"&name="+name,
              data: ed.getContent(),
              success: function ( data ) {
                        var et = "Cache note saved at: "+enhanced_notes_remote_database_url+"index.php?id="+id;
                        $.pageMethod("SetUserCacheNote", JSON.stringify({ dto: { et: et, ut: userToken} }), function (r) {
                            var r = JSON.parse(r.d);
                            if (r.success == true) {
                                ed.setProgressState(0);
                            } else {
                                alert(cacheNoteText.ErrorInSaving);
                            }

                        });
                },
            });
        } else if(enhanced_notes_enabled == 'local') {
            var data = localStorage.getItem(id);
            if(data){
                var status = 1;                
                var odata = JSON.parse(data);
                if(odata['status']) status = odata['status']; 
                data = {'status': status, 'name': name, 'content': ed.getContent()};
            } else {
                data = {'status': 1, 'name': name, 'content': ed.getContent()}
            }
            data = JSON.stringify(data);
            localStorage.setItem(id, data);
            ed.setProgressState(0);
        } else if(enhanced_notes_enabled == 'enabled') {
            var et = ed.getContent();
            if (et.length > 500)
                et = et.substr(0, 500);
                et = escape(et);
            $.pageMethod("SetUserCacheNote", JSON.stringify({ dto: { et: et, ut: userToken} }), function (r) {
                var r = JSON.parse(r.d);
                if (r.success == true) {
                    ed.setProgressState(0);
                } else {
                    alert(cacheNoteText.ErrorInSaving);
                }
            });
        }
}

function geoMceEdit() {
    editMode = true;
    var data = $('#cache_note').html();
    $('#cache_note_save').hide();
    $('#cache_note').replaceWith('<textarea id="cache_note" style="width:100%">'+data+'</textarea><a class="btn" href="javascript:;" onclick="ajaxSave();return false;"><span>Save</span></a>');
        $('textarea').tinymce({
            // Location of TinyMCE script
            script_url : extensionBaseURI+"js/tiny_mce/tiny_mce.js",

            // General options
            theme : "advanced",
            plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
            convert_urls : true,
            // Theme options
            theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,forecolor,backcolor,|,bullist,numlist,hr,formatselect,fontsizeselect",
            theme_advanced_buttons2 : "",
            theme_advanced_buttons3 : "",
            theme_advanced_buttons4 : "",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "bottom",
            theme_advanced_resizing : true,

            // Example content CSS (should be your site CSS)
            content_css : extensionBaseURI+"css/tinymce.css",

            // Replace values for the template plugin
            template_replace_values : {
                username : "Some User",
                staffid : "991234"
            }
        });
}

function enhanceTitle()
{
    if($('#ctl00_ContentBody_hlFoundItLog').length != 0){
        var cache_name = $('#ctl00_ContentBody_CacheName').html();    
        $('#ctl00_ContentBody_CacheName').html("<img id='found_stamp' src='"+extensionBaseURI+"img/found.png'> "+cache_name);
    }
}

function loadNotes()
{
    if($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').length != 0){
        var cache_id = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();
        $('#ctl00_ContentBody_advertisingWithUs').hide();
        if(enhanced_notes_enabled == 'remote') {
            $.ajax({
              url: enhanced_notes_remote_database_url+"index.php?id="+cache_id
            }).done(function ( data ) {
                if(data == ""){
                  data = unescape($('#cache_note').html());
                  if(data == "Click to enter a note"){        
                      data = "";
                  }
                }
                var o = $('#cache_note')
                $('#cache_note').replaceWith('<div id="cache_note" style="width:100%">'+data+'</div><a id="cache_note_save" class="btn" href="javascript:;" onclick="geoMceEdit();return false;"><span>Edit</span></a>');
            });
        } else if(enhanced_notes_enabled == 'local') {
            var data = localStorage.getItem(cache_id);
            if(data){
                data = JSON.parse(data);
            } else {
                data = {'status': 1, 'content': unescape($('#cache_note').html())}
            }
            $('#cache_note').replaceWith('<div id="cache_note" style="width:100%">'+data['content']+'</div><a id="cache_note_save" class="btn" href="javascript:;" onclick="geoMceEdit();return false;"><span>Edit</span></a>');
        } else if(enhanced_notes_enabled == 'enabled') {
            var data = localStorage.getItem(cache_id);
            if(data){
                data = JSON.parse(data);
            } else {
                data = {'status': 1, 'content': ''}
            }
            data = unescape($('#cache_note').html());
            $('#cache_note').replaceWith('<div id="cache_note" style="width:100%">'+data+'</div><a id="cache_note_save" class="btn" href="javascript:;" onclick="geoMceEdit();return false;"><span>Edit</span></a>');
        } else {
        }
        $('.CacheDetailsNavLinks').append('<li><a class="lnk" href="javascript:;" onclick="markStatusSolved(50);return false;"><img src="'+extensionBaseURI+'img/50.png"> <span>Mark as field solvable</span></a></li>');
        $('.CacheDetailsNavLinks').append('<li><a class="lnk" href="javascript:;" onclick="markStatusSolved(99);return false;"><img src="'+extensionBaseURI+'img/99.png"> <span>Mark as solved</span></a></li>');
    }


    if($('.SearchResultsTable') != 0){
        var arr = new Array();
        $('.SearchResultsTable tr').each(function(i, el) {
            var c = $(el).children();
            var data = c[3].innerHTML;            
            var data2 = c[5].innerHTML;            
            if(data.trim() == ""){
                var gcid = data2.match(/\bGC[^\b]*?\b/gi);
                arr.push(gcid);
                
            }
        });
        if(enhanced_notes_enabled == 'remote') {
            $.ajax({
              url: enhanced_notes_remote_database_url+"status.php?ids="+arr.join()
            }).done(function ( rdata ) {
                if(rdata != ""){
                  rdata = eval('(' + rdata + ')');
                    $('.SearchResultsTable tr').each(function(i, el) {
                        var c = $(el).children();
                        var data = c[3].innerHTML;            
                        var data2 = c[5].innerHTML;            
                        if(data.trim() == ""){
                            var gcid = data2.match(/\bGC[^\b]*?\b/gi);
                            if(rdata[gcid] > 0){                     
                                c[3].innerHTML = "<img class='sticky_note' src='"+extensionBaseURI+"img/"+rdata[gcid]+".png'>";
                            }
                        }
                     });
                }
            });
        } else if(enhanced_notes_enabled == 'local') {
            $('.SearchResultsTable tr').each(function(i, el) {
                var c = $(el).children();
                var data = c[3].innerHTML;            
                var data2 = c[5].innerHTML;            
                if(data.trim() == ""){
                    var gcid = data2.match(/\bGC[^\b]*?\b/gi);
                    cdata = localStorage.getItem(gcid)
                    if(cdata){                     
                        var cdata = JSON.parse(cdata);
                        c[3].innerHTML = "<img class='sticky_note' src='"+extensionBaseURI+"img/"+cdata['status']+".png'>";
                    }
                }
             });
        }        
    }
}
function initEnhancements()
{
    alert("enhance_title");
    if($('#ctl00_ContentBody_hlFoundItLog').length != 0){
        var cache_name = $('#ctl00_ContentBody_CacheName').html();    
        $('#ctl00_ContentBody_CacheName').html("<img id='found_stamp' src='"+extensionBaseURI+"img/found.png'> "+cache_name);
    }
}


if (window.top === window) {
    function getMessage(msgEvent) {
    
        if (msgEvent.name == "enhancedNotesSettings"){            
            if(!enhanced){
                var script2 = "";
                var script3 = document.createElement("script");
                var enhancementSettings = msgEvent.message;
                if(enhancementSettings['enhanced_notes_enabled'] != 'disabled'){
                    script2 = "var enhanced_notes_enabled = '"+enhancementSettings['enhanced_notes_enabled'] + "';"
                        + "var extensionBaseURI = '"+safari.extension.baseURI+"';"
                        + "var enhanced_notes_remote_database_url = '"+enhancementSettings['enhanced_notes_remote_database_url']+"';"
                        + "var editMode = false;"
                        + "function init() {"
                        + "loadNotes();";
                    script3.innerHTML = script3.innerHTML + initEnhancements.valueOf();
                    script3.innerHTML = script3.innerHTML + ajaxSave.valueOf();
                    script3.innerHTML = script3.innerHTML + markStatusSolved.valueOf()
                    script3.innerHTML = script3.innerHTML + geoMceEdit.valueOf()
                    script3.innerHTML = script3.innerHTML + loadNotes.valueOf()
                    var script = document.createElement("script");
                    script.src = safari.extension.baseURI+"js/tiny_mce/jquery.tinymce.js"
                    document.body.insertBefore(script, document.body.firstChild);
                    enhanced = true;
                }
                
                if(enhancementSettings['enhance_title']){
                    script2 = script2 + "enhanceTitle();";                                
                    script3.innerHTML = script3.innerHTML + enhanceTitle.valueOf();                                
                }
                
                script2 = script2 + "} document.ready = init();";
                script3.innerHTML = script3.innerHTML + script2;
                document.body.insertBefore(script3, document.body.firstChild);
            }
        }
    }
    
    safari.self.tab.dispatchMessage("getEnhancedNotesSettings", ""); // ask for value
    safari.self.addEventListener("message", getMessage, false); // wait for reply
}