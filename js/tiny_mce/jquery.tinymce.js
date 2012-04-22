(function(c){var b,e,a=[],d=window;c.fn.tinymce=function(j){var p=this,g,k,h,m,i,l="",n="";if(!p.length){return p}if(!j){return tinyMCE.get(p[0].id)}p.css("visibility","hidden");function o(){var r=[],q=0;if(f){f();f=null}p.each(function(t,u){var s,w=u.id,v=j.oninit;if(!w){u.id=w=tinymce.DOM.uniqueId()}s=new tinymce.Editor(w,j);r.push(s);s.onInit.add(function(){var x,y=v;p.css("visibility","");if(v){if(++q==r.length){if(tinymce.is(y,"string")){x=(y.indexOf(".")===-1)?null:tinymce.resolve(y.replace(/\.\w+$/,""));y=tinymce.resolve(y)}y.apply(x||tinymce,r)}}})});c.each(r,function(t,s){s.render()})}if(!d.tinymce&&!e&&(g=j.script_url)){e=1;h=g.substring(0,g.lastIndexOf("/"));if(/_(src|dev)\.js/g.test(g)){n="_src"}m=g.lastIndexOf("?");if(m!=-1){l=g.substring(m+1)}d.tinyMCEPreInit=d.tinyMCEPreInit||{base:h,suffix:n,query:l};if(g.indexOf("gzip")!=-1){i=j.language||"en";g=g+(/\?/.test(g)?"&":"?")+"js=true&core=true&suffix="+escape(n)+"&themes="+escape(j.theme)+"&plugins="+escape(j.plugins)+"&languages="+i;if(!d.tinyMCE_GZ){tinyMCE_GZ={start:function(){tinymce.suffix=n;function q(r){tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r))}q("langs/"+i+".js");q("themes/"+j.theme+"/editor_template"+n+".js");q("themes/"+j.theme+"/langs/"+i+".js");c.each(j.plugins.split(","),function(s,r){if(r){q("plugins/"+r+"/editor_plugin"+n+".js");q("plugins/"+r+"/langs/"+i+".js")}})},end:function(){}}}}c.ajax({type:"GET",url:g,dataType:"script",cache:true,success:function(){tinymce.dom.Event.domLoaded=1;e=2;if(j.script_loaded){j.script_loaded()}o();c.each(a,function(q,r){r()})}})}else{if(e===1){a.push(o)}else{o()}}return p};c.extend(c.expr[":"],{tinymce:function(g){return !!(g.id&&tinyMCE.get(g.id))}});function f(){function i(l){if(l==="remove"){this.each(function(n,o){var m=h(o);if(m){m.remove()}})}this.find("span.mceEditor,div.mceEditor").each(function(n,o){var m=tinyMCE.get(o.id.replace(/_parent$/,""));if(m){m.remove()}})}function k(n){var m=this,l;if(n!==b){i.call(m);m.each(function(p,q){var o;if(o=tinyMCE.get(q.id)){o.setContent(n)}})}else{if(m.length>0){if(l=tinyMCE.get(m[0].id)){return l.getContent()}}}}function h(m){var l=null;(m)&&(m.id)&&(d.tinymce)&&(l=tinyMCE.get(m.id));return l}function g(l){return !!((l)&&(l.length)&&(d.tinymce)&&(l.is(":tinymce")))}var j={};c.each(["text","html","val"],function(n,l){var o=j[l]=c.fn[l],m=(l==="text");c.fn[l]=function(s){var p=this;if(!g(p)){return o.apply(p,arguments)}if(s!==b){k.call(p.filter(":tinymce"),s);o.apply(p.not(":tinymce"),arguments);return p}else{var r="";var q=arguments;(m?p:p.eq(0)).each(function(u,v){var t=h(v);r+=t?(m?t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,""):t.getContent()):o.apply(c(v),q)});return r}}});c.each(["append","prepend"],function(n,m){var o=j[m]=c.fn[m],l=(m==="prepend");c.fn[m]=function(q){var p=this;if(!g(p)){return o.apply(p,arguments)}if(q!==b){p.filter(":tinymce").each(function(s,t){var r=h(t);r&&r.setContent(l?q+r.getContent():r.getContent()+q)});o.apply(p.not(":tinymce"),arguments);return p}}});c.each(["remove","replaceWith","replaceAll","empty"],function(m,l){var n=j[l]=c.fn[l];c.fn[l]=function(){i.call(this,l);return n.apply(this,arguments)}});j.attr=c.fn.attr;c.fn.attr=function(n,p){var m=this;if((!n)||(n!=="value")||(!g(m))){if(p!==b){return j.attr.call(m,n,p)}else{return j.attr.call(m,n)}}if(p!==b){k.call(m.filter(":tinymce"),p);j.attr.call(m.not(":tinymce"),n,p);return m}else{var o=m[0],l=h(o);return l?l.getContent():j.attr.call(c(o),n,p)}}}})(jQuery);
window.linkify=(function(){var k="[a-z\\d.-]+://",h="(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",c="(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",n="(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",f="(?:"+c+n+"|"+h+")",o="(?:[;/][^#?<>\\s]*)?",e="(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",d="\\b"+k+"[^<>\\s]+",a="\\b"+f+o+e+"(?!\\w)",m="mailto:",j="(?:"+m+")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"+f+e+"(?!\\w)",l=new RegExp("(?:"+d+"|"+a+"|"+j+")","ig"),g=new RegExp("^"+k,"i"),b={"'":"`",">":"<",")":"(","]":"[","}":"{","B;":"B+","b:":"b9"},i={callback:function(q,p){return p?'<a href="'+p+'" target="_blank" title="'+p+'">'+q+"</a>":q},punct_regexp:/(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/};return function(u,z){z=z||{};var w,v,A,p,x="",t=[],s,E,C,y,q,D,B,r;for(v in i){if(z[v]===undefined){z[v]=i[v]}}while(w=l.exec(u)){A=w[0];E=l.lastIndex;C=E-A.length;if(/[\/:]/.test(u.charAt(C-1))){continue}do{y=A;r=A.substr(-1);B=b[r];if(B){q=A.match(new RegExp("\\"+B+"(?!$)","g"));D=A.match(new RegExp("\\"+r,"g"));if((q?q.length:0)<(D?D.length:0)){A=A.substr(0,A.length-1);E--}}if(z.punct_regexp){A=A.replace(z.punct_regexp,function(F){E-=F.length;return""})}}while(A.length&&A!==y);p=A;if(!g.test(p)){p=(p.indexOf("@")!==-1?(!p.indexOf(m)?"":m):!p.indexOf("irc.")?"irc://":!p.indexOf("ftp.")?"ftp://":"http://")+p}if(s!=C){t.push([u.slice(s,C)]);s=E}t.push([A,p])}t.push([u.substr(s)]);for(v=0;v<t.length;v++){x+=z.callback.apply(window,t[v])}return x||u}})();
var editMode = false;
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
          url: "http://www.leino.net/geo/index.php?id="+id+"&status="+stat+"&name="+name,
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
        $.ajax({
          type: 'POST',
          url: "http://www.leino.net/geo/index.php?id="+id+"&name="+name,
          data: ed.getContent(),
          success: function ( data ) {ed.setProgressState(0);},
        });
}

function geoMceEdit() {
    editMode = true;
    var data = $('#cache_note').html();
    $('#cache_note_save').hide();
    $('#cache_note').replaceWith('<textarea id="cache_note" style="width:100%">'+data+'</textarea><a class="btn" href="javascript:;" onclick="ajaxSave();return false;"><span>Save</span></a>');
		$('textarea').tinymce({
			// Location of TinyMCE script
			script_url : "https://raw.github.com/Frodotus/geocaching-map-enhancements/master/js/tiny_mce/tiny_mce.js",

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
			content_css : "https://raw.github.com/Frodotus/geocaching-map-enhancements/master/css/tinymce.css",

			// Replace values for the template plugin
			template_replace_values : {
				username : "Some User",
				staffid : "991234"
			}
		});
}

document.ready = load();
function load()
{
    if($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').length != 0){
        var cache_id = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();
        $('#ctl00_ContentBody_advertisingWithUs').hide();
        if($('#ctl00_ContentBody_hlFoundItLog').length != 0){
            var cache_name = $('#ctl00_ContentBody_CacheName').html();    
            $('#ctl00_ContentBody_CacheName').html("<img id='found_stamp' src='http://www.leino.net/geo/found-stamp.gif'> "+cache_name);
        }
        $.ajax({
          url: "http://www.leino.net/geo/index.php?id="+cache_id
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
    
        $('.CacheDetailsNavLinks').append('<li><a class="lnk" href="javascript:;" onclick="markStatusSolved(99);return false;"><img src="http://www.leino.net/geo/99.gif"> <span>Mark as solved</span></a></li>');
        $('.CacheDetailsNavLinks').append('<li><a class="lnk" href="javascript:;" onclick="markStatusSolved(50);return false;"><img src="http://www.leino.net/geo/99.gif"> <span>Mark as field solvable</span></a></li>');
        $('.UserSuppliedContent').each(function(index) {
//            $(this).html(linkify($(this).html()));
        });
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

        $.ajax({
          url: "http://www.leino.net/geo/status.php?ids="+arr.join()
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
                            c[3].innerHTML = "<img class='sticky_note' src='http://www.leino.net/geo/"+rdata[gcid]+".gif'>";
                        }
                    }
                 });
            }
        });
    }
}
