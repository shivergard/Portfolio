//ilze.dombrovska@picanova.com
//March 10th, 2015
function loadPageVar(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var pguid = loadPageVar("guid");

function doPost(jsonstr) 
    {       
        var posting = $.post( "http://testingservices.meinfoto.de/service/threedee", jsonstr, "json");      
        posting.done(function (data) {
            processJson(JSON.stringify(data));
        });
        posting.always(function(data) {                         
        });

    } 

$(document).ready(function() {
    getPreview(pguid);
});


function getPreview(guid) {
    var t = {
        filter: "getPreview()",
        argument1: guid
    };
    console.log(JSON.stringify(t));
    doPost(JSON.stringify(t))
}
function processJson(info) {

    var obj = JSON.parse(info);
    if (obj.preview) {


    var image = obj.preview[0].preview_base64;

    var mass = [];
    

    
        //if (rinda!=='') {
        var imageContainer = document.createElement('p');
        imageContainer.className = "imagecontainer";
        var x = document.createElement('img');
        x.src = "data:image/png;base64," + image;
        //document.getElementById("preview-container").appendChild(x);
        x.onmousedown = function (event) {
            event.preventDefault();
        };
         $(x).appendTo(imageContainer).css("left","0");
         $(imageContainer).appendTo('.position-container');
         var xCord = 0;

for (i = 0; i < 24; i++) {
    var cords = xCord;
        mass.push(cords);
        var xCord = xCord - 512;

    };

    var current = 0;

    var canvas = document.getElementById('preview-container');
    var body = document.getElementById('body');

    canvas.onmousedown = function(event) {
        //alert("ff mousedown"); works
        $("#play").css("display", "inline-block");
        $("#stop").css("display", "none");
        stopAutoRotate(stop)
        //alert("ff mousedown"); works
        var x = event.pageX
        startDrag( x )
        //alert(event.pageX+ ' , ' + event.pageY);
    };
    body.onmousemove = function(event) {
        event.preventDefault();
        var x1 = event.pageX
        dragging(x1)
    };
    body.onmouseup = function(event) {
        var x2 = event.pageX
        endDrag(x2)
    };


    //Mobile

    canvas.addEventListener('touchstart', function() {
        //stopAutoRotate(stop)
        $("#play").css("display", "inline-block");
        $("#stop").css("display", "none");
        startTouchDrag(event)
    });

    body.addEventListener('touchmove', function() {
        draggingTouch(event)
    });

    body.addEventListener('touchend', function() {
        endDrag(event)
    });


    var mouseDragOn = false;
    var mouseStartPositionX = 0;

    function startTouchDrag(event) {
        mouseDragOn = true;
        mouseStartPositionX = event.changedTouches[0].pageX;
    }

    function startDrag( x ) {
        mouseDragOn = true;
        mouseStartPositionX = x;
        //alert(mouseStartPositionX);
    }

    function draggingTouch(event) {
        
        if (mouseDragOn) {

            if (mouseStartPositionX + 10 < event.changedTouches[0].pageX) {
                event.preventDefault();
                rotacija();
                mouseStartPositionX = event.changedTouches[0].pageX
                if (mouseStartPositionX + 10 < event.changedTouches[0].pageX) {
                    rotacija();
                }

            } else if (mouseStartPositionX - 10 > event.changedTouches[0].pageX) {
                event.preventDefault();
                rotacijapret();
                mouseStartPositionX = event.changedTouches[0].pageX
                if (mouseStartPositionX - 10 > event.changedTouches[0].pageX) {
                    rotacijapret();
                }
            }

        }
    }

    function dragging(x1) {
        //event.preventDefault();

        if (mouseDragOn) {
        var mouseMovePositionX = x1 ;
        //alert(mouseMovePositionX);
            if (mouseStartPositionX + 10 < mouseMovePositionX) {

                rotacija();
                mouseStartPositionX = mouseMovePositionX
                if (mouseStartPositionX + 10 < mouseMovePositionX) {
                    rotacija();
                }

            } else if (mouseStartPositionX - 10 > mouseMovePositionX) {
                rotacijapret();
                mouseStartPositionX = mouseMovePositionX
                if (mouseStartPositionX - 10 > mouseMovePositionX) {
                    rotacijapret();
                }
            }

        }
    }


    function endDrag(x2) {
        mouseDragOn = false
    }

    function rotacija(event) {
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
        if (current == 23) {
            current = -1;
        }
        current = current + 1
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
    };

    function rotacijapret(event) {
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
        if (current == 0) {
            current = 24;
        }
        current = current - 1
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
    }    

    var image = 0;
    $('.imagecontainer img').load(function() {
        image = image + 1
        if (image == 1) {
            $(".loader").fadeOut(200);
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');

            var i = 0;
            var howManyTimes = 24;

            function f() {
                i++;
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
                current++;
                if (current == 24) {
                    current = 0;
                }
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');

                if (i < howManyTimes) {
                    setTimeout(f, 30);
                }
            }
            f();

        }
    });

    var autoRotate;

    function rotateStartFunction() {
        autoRotate = setInterval(rotateTimer, 100);
    }

    function rotateTimer() {
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
                if (current == 23) {
                    current = -1;
                }
                current = current + 1
        $(".imagecontainer").find("img").css('left', mass[current] + 'px');
    }

    function stopAutoRotate() {
        clearInterval(autoRotate);
    }

    $("#play").click(function() {
        rotateStartFunction()
         $("#play").css("display", "none");
        $("#stop").css("display", "inline-block");
    });

    $("#stop").click(function() {
        stopAutoRotate()
         $("#play").css("display", "inline-block");
        $("#stop").css("display", "none");
    });
}

    //twitter button function
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

    var ownerId = obj.preview[0].ownerid;
    var scanid = obj.preview[0].scanid;
    var value = $(".m-radio--large").find(":checked").val();
    var height = $(".m-radio--large").find(":checked").attr('id');
    var cartlink = "http://www.mein3d.de/externalAPI?action=addStaticProduct&product=" + value + "&quantity=1&externalData=<external><scanId>" + scanid + "</scanId><ownerId>" + ownerId + "</ownerId><modelHeight>" + height + "</modelHeight></external>";

    var mainButton = document.createElement('a');
        mainButton.setAttribute('href', cartlink);
        mainButton.className = "button button--green";
    var t = document.createTextNode("JETZT BESTELLEN");
        mainButton.appendChild(t); 
        $(mainButton).appendTo('#add-to-cart-button');

        var sUrl = "http://www.mein3d.de/my-scan/?guid=" + pguid;
        var imageurl = "http://testingservices.meinfoto.de/service/TreeDeePreviewServlet?preview=" + scanid;
        var furl = "https://www.facebook.com/dialog/feed?%20app_id=1581542772108661%20&display=popup&picture="+ escape(imageurl)+"&link="+ escape(sUrl)+"&redirect_uri=http://www.mein3d.de/close/"


            $("#tw").click(function(event) {
                var width  = 575,
                    height = 400,
                    left   = ($(window).width()  - width)  / 2,
                    top    = ($(window).height() - height) / 2,
                    url    = this.href,
                    opts   = 'status=1' +
                             ',width='  + width  +
                             ',height=' + height +
                             ',top='    + top    +
                             ',left='   + left;
                
                window.open(url, 'twitter', opts);
             
                return false;
              });
        document.getElementById('tw').setAttribute('href', "http://twitter.com/share?text=Erlebe%20die%20Zukunft%2C%20ich%20in%20%233D!&url=" + escape(sUrl) + "&hashtags=3Dscanning,3Dfigur&via=mein3Dde");
        //document.getElementById('fb').setAttribute('href', furl );
        //$("#fb").text("Facebook");


        $("#fb").click(function(){
          var width=500;
          var height=500;
            //Allow for borders.
            var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
            //Allow for title and status bars.
            var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
            //console.log(furl);
            window.open(furl, "Window2", "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
        });


        $( ".m-radio-group .m-radio" ).click(function() {
        $('#add-to-cart-button').empty();
    var value = $(".m-radio-group").find(":checked").val();
    var height = $(".m-radio--large").find(":checked").attr('id');
    var total = $(this).find(".m-radio__label").find(".m-radio__price").text();
        $(".m-costs__total").text( total + ".00");

    var cartlink = "http://www.mein3d.de/externalAPI?action=addStaticProduct&product=" + value + "&quantity=1&externalData=<external><scanId>" + scanid + "</scanId><ownerId>" + ownerId + "</ownerId><modelHeight>" + height + "</modelHeight></external>";

    var mainButton = document.createElement('a');
        mainButton.setAttribute('href', cartlink);
        mainButton.className = "button button--green";
    var t = document.createTextNode("JETZT BESTELLEN");
        mainButton.appendChild(t); 
        $(mainButton).appendTo('#add-to-cart-button');

});



}