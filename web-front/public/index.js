"use strict";
/**
 * @param {form} dom
 */
let btn_span1 = document.getElementById("input2-default");
let btn_span2 = document.getElementById("input2-loading");
let writePreview = document.getElementById("imagePreview");
function fileSender(dom)
{
  // var sendURL = "http://tiger3018.wang:8888/api/recognition";
  btn_span1.classList = ["d-none"]; btn_span2.classList = ["d-inline"];
  var formData = new FormData(dom);
  var request = new XMLHttpRequest();
  request.open(dom.method, dom.action);
  request.onloadend = fileUploadHandler;
  // request.onerror = fileUploadEraser;
  request.send(formData);
}
function fileUploadHandler(e)
{
  console.log(e);
  btn_span1.classList = btn_span2.classList = [];
  var writeSpaceParent = document.getElementById("recoRetu");
  var writeSpace = document.getElementById("recoText");
  if(!e.target.status)
  {
    writeSpace.innerText = "Can't connect to API host." + document.getElementById("fileUpload").action;
    writeSpaceParent.children[2].innerText = "N/A";
    return;
  }
  writeSpace.innerText = e.target.responseText;
  writeSpaceParent.children[2].innerText = e.target.status;
}
function fileDisplay(e)
{
  e.target;
  
  console.log(e);
}