from flask import request
import re, requests, base64, time, hashlib, hmac, json, traceback

def imageProcess():
    try:
        ty1 = request.mimetype
        ty2 = request.files['image'].mimetype
        if ty1 != "multipart/form-data" or not re.match('image/*', ty2):
            return {"Warning": ty1 + ' or ' + ty2 + " not allowed."}, 400
    except NameError:
        return {"Warning": "Empty mimetype (request/id='image') not allowed."}, 400

    imageObj = request.files['image'].read()
    baseStr = base64.b64encode(imageObj).decode()

    try:
        with open("tencent.secret", "r") as secretFile:
            a, b, *_unused = [i.split('\n')[0] for i in secretFile.readlines()]
            tenAPIObj = tencentProcess(a, b, baseStr)
        print(tenAPIObj.status_code, tenAPIObj.content.decode(), len(baseStr) * 3.0 / 4096, sep='\n')
    except FileNotFoundError:
        return {"Warning": "File tencent.secret Not Found."}, 404
    except Exception:
        traceback.print_exception()
        return {"Warning": "Server's communication with API provider failed.", "Debug": traceback.format_exception()}, 502
    # request.charset
    # request.cookies[]
    return json.loads(tenAPIObj.content.decode()), tenAPIObj.status_code

def tencentProcess(seId, seKey, IBData):
    # gmttime(), json.dumps() instead of str()
    timeUnix = str(int(time.time()))
    timeDate = time.strftime("%Y-%m-%d", time.gmtime())
    method = "/ocr/tc3_request"
    req = requests.Request("POST", "https://ocr.tencentcloudapi.com",
        json={"ImageBase64": IBData, "EnableWordPolygon": True},
        headers={
            "X-TC-Action": "GeneralHandwritingOCR",
            "X-TC-Region": "ap-guangzhou",
            "X-TC-Version": "2018-11-19",
            "X-TC-Timestamp": timeUnix,
            "Content-type": "application/json, charset=utf-8",
            "Host": 'ocr.tencentcloudapi.com'#
        })

    h1text = ""
    h2text = ""
    h3sum = hashlib.sha256(json.dumps(req.json).encode()).hexdigest()
    for i in ("Content-type", "Host"):
        h1text += i.lower() + ";"
        h2text += i.lower() + ":" + req.headers[i].lower() + '\n'
    h1text = h1text[:len(h1text) - 1]
    reqStr = "POST\n/\n\n" + h2text + "\n" + h1text + "\n" + h3sum
    reqStrHashed = hashlib.sha256(reqStr.encode()).hexdigest()

    stringToSign = "TC3-HMAC-SHA256\n" + timeUnix + "\n" + timeDate + method + "\n" + reqStrHashed
    secretSigning = hmac.new(("TC3" + seKey).encode(), timeDate.encode(), digestmod=hashlib.sha256).digest()
    for i in re.findall(r"/([^/]*)", method):
        secretSigning = hmac.new(secretSigning, i.encode(), digestmod=hashlib.sha256).digest()
    secretSigning = hmac.new(secretSigning, stringToSign.encode(), digestmod=hashlib.sha256).hexdigest()

    req.headers["Authorization"] = "TC3-HMAC-SHA256 Credential=" + seId + "/" + timeDate + method + \
        ", SignedHeaders=" + h1text + ", Signature=" + secretSigning
    reqPrepared = req.prepare()
    print(str(reqPrepared.headers["Authorization"]))
    return requests.Session().send(reqPrepared)