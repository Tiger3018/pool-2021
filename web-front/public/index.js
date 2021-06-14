"use strict";
let exposeFunc = {};
(function (){
  "use strict";
  let btn_span1 = document.getElementById("input2-default");
  let btn_span2 = document.getElementById("input2-loading");
  let writePreview = document.getElementById("imageDraw");
  let writeSpace = document.getElementById("recoText");
  let codeSpace = document.getElementById("recoStatus");
  let debugSpace = document.getElementById("recoJson");
  let tempImg = new Image;
  tempImg.onload = function(e){ /* no async here, to avoid height&width problem. no float here*/
    writePreview.src = tempImg.src;
    writePreview.height = Math.min(tempImg.height, 0.65 * window.innerHeight);
    writePreview.width = Math.min(tempImg.height, 0.65 * window.innerHeight) / tempImg.height  * tempImg.width;
    // writePreview.height = tempImg.height;
    // writePreview.style["max-width"] = tempImg.width;
    // await new Promise(resolve => setTimeout(resolve, 10));
  };
  /**
   * @param {form} dom
   */
  function fileSender(dom)
  {
    // var sendURL = "https://api.tiger3018.wang/api/recognition";
    btn_span1.classList = ["d-none"]; btn_span2.classList = ["d-inline"];
    var formData = new FormData(dom);
    var request = new XMLHttpRequest();
    request.open(dom.method, dom.action);
    request.onloadend = fileUploadHandler;
    request.onprogress = btnAnimation;
    codeSpace.innerText = "Pending"; codeSpace.classList = "mx-2 badge bg-secondary";
    // request.onerror = fileUploadEraser;
    request.send(formData);
  }
  function fileUploadHandler(e)
  {
    console.log(e);
    btn_span1.classList = btn_span2.classList = [];
    writeSpace.innerHTML = "";
    if(!e.target.status)
    {
      debugSpace.innerText = "Can't connect to API host at " + document.getElementById("fileUpload").action;
      codeSpace.innerText = "N/A";
      codeSpace.classList = "mx-2 badge bg-" + check(codeSpace.innerText);
      return;
    }
    debugSpace.innerText = e.target.responseText;
    codeSpace.innerText = e.target.status;
    codeSpace.classList = "mx-2 badge bg-" + check(codeSpace.innerText);
    var dictRead = JSON.parse(e.target.responseText);
    if(!("Warning" in dictRead))
    {
      drawResult(dictRead)
    }
  }
  function fileDisplay()
  {
    var virtualList = document.getElementById("input1").files;
    if(virtualList[0]){
      debugSpace.innerHTML = writeSpace.innerHTML = codeSpace.innerText = "";
      tempImg.src = URL.createObjectURL(virtualList[0]);
      // writePreview.style["opacity"] = 0;
    }
    else{
      writePreview.height = Math.min(198, 0.65 * window.innerHeight);
      writePreview.width = Math.min(198, 0.65 * window.innerHeight) / 198 * 705;
      writePreview.src = "./demo.png";
      debugSpace.innerText = document.getElementById("demoHidden").innerText;
      drawResult(JSON.parse(debugSpace.innerText));
    }
    // document.getElementById("input1").value = "";
  }
  function drawResult(dictRead)
  {
    writeSpace.innerHTML = "";
    for(let index of dictRead.Response.TextDetections){
      writeSpace.innerHTML += "<p>" + index.DetectedText + '<span class="float-end badge bg-' + check(index.Confidence) + '">' + index.Confidence + "</span></p>"
    }
  }
  /**
   * @param {int, string} num [0-100, 200,..., 404,..., 500,...(web status code)]
   * @returns {string} to show bg-secondary
   */
  function check(num)
  {
    if(typeof num == "string")
    {
      num = parseInt(num);
    }
    if(num <= 60)
      return "danger";
    else if(num <= 85)
      return "warning text-dark";
    else if(num <= 100 || num == 200)
      return "success";
    return "danger";
  }
  function btnAnimation(e)
  {
    // console.log(e);
    return;
  }

  // Code below will run once the file loaded (after <footer> DOM)
  fileDisplay();
  exposeFunc.fileSender = fileSender;
  // exposeFunc.fileUploadHandler = fileUploadHandler;
  exposeFunc.fileDisplay = fileDisplay;
  exposeFunc.drawResult = drawResult;
  if ("serviceWorker" in navigator) {
    //navigator.serviceWorker.register('./server.js', { scope: "./" }); //setting scope of sw
  }
})(); // anonymous code block for publish