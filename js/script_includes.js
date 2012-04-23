var enhanced = false;
function ajaxLoad() {
        var ed = tinyMCE.get('cache_note');

        // Do you ajax call here, window.setTimeout fakes ajax call
        ed.setProgressState(1); // Show progress
        window.setTimeout(function() {
                ed.setProgressState(0); // Hide progress
                ed.setContent('HTML content that got passed from server.');
        }, 3000);
}

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
              success: function ( data ) {ed.setProgressState(0);},
            });
        } else if(enhanced_notes_enabled == 'local') {
            localStorage.setItem(id, ed.getContent());
            ed.setProgressState(0);
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


function loadNotes()
{
    if($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').length != 0){
        var cache_id = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();
        $('#ctl00_ContentBody_advertisingWithUs').hide();
        if($('#ctl00_ContentBody_hlFoundItLog').length != 0){
            var cache_name = $('#ctl00_ContentBody_CacheName').html();    
            $('#ctl00_ContentBody_CacheName').html("<img id='found_stamp' src='"+extensionBaseURI+"img/found-stamp.gif'> "+cache_name);
        }
        if(enhanced_notes_enabled == 'remote') {
            $.ajax({
              url: enhanced_notes_remote_database_url+"index.php?id="+cache_id
            }).done(function ( data ) {
                if(data == ""){
                  data = $('#cache_note').html();
                  if(data == "Click to enter a note"){        
                      data = "";
                  }
                }
                var o = $('#cache_note')
                $('#cache_note').replaceWith('<div id="cache_note" style="width:100%">'+data+'</div><a id="cache_note_save" class="btn" href="javascript:;" onclick="geoMceEdit();return false;"><span>Edit</span></a>');
            });
        } else if(enhanced_notes_enabled == 'local') {
            var data = localStorage.getItem(cache_id);
            if(!data) data = "";
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
        } else {
        }
    }
}

if (window.top === window) {
    function getMessage(msgEvent) {
    
        if (msgEvent.name == "enhancedNotesSettings"){            
            if(!enhanced){
                var enhancementSettings = msgEvent.message;
                if(enhancementSettings['enhanced_notes_enabled'] != 'disabled'){
                    var script3 = document.createElement("script");
                    script3.innerHTML = "var enhanced_notes_enabled = '"+enhancementSettings['enhanced_notes_enabled']+"';var extensionBaseURI = '"+safari.extension.baseURI+"';var enhanced_notes_remote_database_url = '"+enhancementSettings['enhanced_notes_remote_database_url']+"'; var editMode = false; document.ready = loadNotes();";
                    script3.innerHTML = script3.innerHTML + ajaxSave.valueOf();
                    script3.innerHTML = script3.innerHTML + ajaxLoad.valueOf()
                    script3.innerHTML = script3.innerHTML + markStatusSolved.valueOf()
                    script3.innerHTML = script3.innerHTML + geoMceEdit.valueOf()
                    script3.innerHTML = script3.innerHTML + loadNotes.valueOf()
                    document.body.insertBefore(script3, document.body.firstChild);
                    var script = document.createElement("script");
                    script.src = safari.extension.baseURI+"js/tiny_mce/jquery.tinymce.js"
                    document.body.insertBefore(script, document.body.firstChild);
                    enhanced = true;
                }
            }
        }
    }
    
    safari.self.tab.dispatchMessage("getEnhancedNotesSettings", ""); // ask for value
    safari.self.addEventListener("message", getMessage, false); // wait for reply
}