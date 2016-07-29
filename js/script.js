/**
 *
 * HTML5 Image uploader with Jcrop
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// convert bytes into friendly format
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0)
        return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

// check for selected crop region
function checkForm() {
    if (parseInt($('#w').val()))
        return true;
    mui.toast('请先选择图片，并且截图');
    //$('.error').html('请先选择图片，并且截图').show();
    return false;
}

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    /*$('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);*/
 	console.log("左："+e.x+"上："+e.y+"右："+e.x2+"下："+e.y2+"宽："+e.w+"高"+e.h);
  
}
;

// clear info by cropping (onRelease event handler)
function clearInfo() {
    mui.toast("请选取您要上传的图片区域");
    /*$('.info #w').val('');
    $('.info #h').val('');*/
}

function fileSelectHandler() {

    // get selected file
    var oFile = $('#image_file')[0].files[0];

    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png|image\/jpg)$/i;
    if (!rFilter.test(oFile.type)) {
    	mui.toast('请选择jpg、jpeg或png格式的图片');
        //$('.error').html('请选择jpg、jpeg或png格式的图片').show();
        return;
    }

    // check for file size
    if (oFile.size > 1000 * 1024) {
    	mui.toast('请上传小于1M的图片');
        //$('.error').html('请上传小于1M的图片').show();
        return;
    }

    // preview element
    var oImage = document.getElementById('previewBg');

    // prepare HTML5 FileReader
    var oReader = new FileReader(),currentHeight=window.innerHeight||document.documentElement.currentHeight||document.body.currentHeight;
    oReader.onload = function(e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        $("#blackBg").fadeIn(function(){
        	document.addEventListener("touchmove",stopMove,false);
        });
        oImage.src = e.target.result;
        oImage.onload = function() { // onload event handler
            // display step 2
            //$('.step2').fadeIn(500);
            $("#blackBg").css({paddingTop:(currentHeight-$("#previewBg").height()-72)/2+"px"});
            // display some basic image info
            var sResultFileSize = bytesToSize(oFile.size);
            $('#filesize').val(sResultFileSize);
            $('#filetype').val(oFile.type);
            $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

            // Create variables (in this scope) to hold the Jcrop API and image size
            var jcrop_api, boundx, boundy;

            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined')
                jcrop_api.destroy();

            // initialize Jcrop
            $('#previewBg').Jcrop({
                minSize: [32, 32], // min crop size
                aspectRatio: 1, // keep aspect ratio 1:1
                bgFade: true, // use fade effect
                bgOpacity: .3, // fade opacity
                onChange: updateInfo,
                onSelect: updateInfo,
                onRelease: clearInfo
            }, function() {

                // use the Jcrop API to get the real image size
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];

                // Store the Jcrop API in the jcrop_api variable
                jcrop_api = this;
            });
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}