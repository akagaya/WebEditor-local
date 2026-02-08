var sassjs = new Sass();
var cssdiv = document.getElementById("css");

function sass_transpile(value) {
	sassjs.compile(value, function (result) {
		//console.log(result);
		cssdiv.append(result.text);
	});
}
// sass.jsここまで

// ace editorここから
var editor_theme = document.getElementById("theme").value;

var editor_html = ace.edit("html");
editor_html.session.setMode("ace/mode/html");
editor_html.setTheme("ace/theme/" + editor_theme);
editor_html.setShowInvisibles(true);
editor_html.$blockScrolling = Infinity;

var editor_sass = ace.edit("sass");
editor_sass.session.setMode("ace/mode/scss");
editor_sass.setTheme("ace/theme/" + editor_theme);
editor_sass.setShowInvisibles(true);
editor_sass.$blockScrolling = Infinity;

var editor_js = ace.edit("javascript");
editor_js.session.setMode("ace/mode/javascript");
editor_js.setTheme("ace/theme/" + editor_theme);
editor_js.setShowInvisibles(true);
editor_js.$blockScrolling = Infinity;

var viewer_css = ace.edit("css");
viewer_css.session.setMode("ace/mode/css");
viewer_css.setReadOnly(true);
viewer_css.setTheme("ace/theme/" + editor_theme);
viewer_css.setShowInvisibles(true);
viewer_css.$blockScrolling = Infinity;

// エディタ監視
editor_html.on("change", function(){
	frame_update();
});
editor_js.on("change", function(){
	frame_update();
})


function frame_update(){
	document.getElementById("preview_frame").innerHTML = 
		"<iframe src=" 
		+ "data:text/html,"
		+ encodeURIComponent('<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title><style>'
		+ viewer_css.getValue() 
		+ '</style></head><body>' 
		+ editor_html.getValue() 
		+ '<script>' 
		+ editor_js.getValue() 
		+ '</script></body></html>') 
		+ "></iframe>"
	;
}

// Sassエディタを監視、変更があればトランスパイル
editor_sass.on("change", function () {
	sassjs.compile(editor_sass.getValue(), function (result) {
		if (result.text != undefined) {
			viewer_css.setValue(result.text);
			viewer_css.navigateFileStart();
			frame_update();
		}
	});
});

// テーマ変更
var select_theme = document.getElementById("theme");
select_theme.onchange = function(){
	themeChange();
};
themeChange();
function themeChange(){
	editor_html.setTheme("ace/theme/" + select_theme.value);
	editor_sass.setTheme("ace/theme/" + select_theme.value);
	editor_js.setTheme("ace/theme/" + select_theme.value);
	viewer_css.setTheme("ace/theme/" + select_theme.value);
}

// フォントサイズ変更
var font_size = document.getElementById("fontsize");
font_size.onchange = function(){
	fontSizeChange();
};
fontSizeChange();
function fontSizeChange(){
	var fs = parseInt(font_size.value)
	editor_html.setFontSize(fs);
	editor_sass.setFontSize(fs);
	editor_js.setFontSize(fs);
	viewer_css.setFontSize(fs);
}

// レイアウト変更
var select_layout = document.getElementById("layout");
select_layout.onchange = function(){
	var tgt = document.getElementById("editor");
	var find = tgt.children;
	var i;
	switch(this.value){
		case 'row':
		case 'column':
			tgt.style.flexDirection = this.value;
			tgt.style.flexWrap = "nowrap";
			for (i = 0; i < find.length; i++){
				find[i].style.width = "100%";
			}
			break;
		case 'wrap':
			tgt.style.flexDirection = "row";
			tgt.style.flexWrap = "wrap";
			for (i = 0; i < find.length; i++){
				find[i].style.width = "49%";
			}
			break;
		default:
			console.log("Layout Error.");
	}
};

// プレビューレイアウト変更
var select_preview = document.getElementById("preview_pos");
select_preview.onchange = function(){
	var tgt = document.getElementById("main");
	if(this.value == "vertical"){
		tgt.style.flexDirection = "column";
	} else {
		tgt.style.flexDirection = "row";
	}
}

// css pane
document.getElementById("visible_css").onclick = function(){
	var tgt = document.getElementsByClassName("css")[0];
	if(this.checked){
		tgt.style.display = "flex";
	} else {
		tgt.style.display = "none";
	}
};

// javascript pane
document.getElementById("visible_js").onclick = function(){
	var tgt = document.getElementsByClassName("javascript")[0];
	if(this.checked){
		tgt.style.display = "flex";
	} else {
		tgt.style.display = "none";
	}
};

// Preview Mode
document.getElementById("previewmode").onclick = function(){
	var tgt = document.getElementById("editor");
	if(this.checked){
		tgt.style.display = "none";
	} else {
		tgt.style.display = "flex";
	}
};
