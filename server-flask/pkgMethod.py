from flask import request
from requests import get as reqget
import re, base64, time

def imageProcess():
    try:
        ty1 = request.mimetype
        ty2 = request.files['image'].mimetype
        if ty1 != "multipart/form-data" or not re.match('image/*', ty2):
            return {"warning": ty1 + ' or ' + ty2 + " not allowed."}, 400
    except NameError:
        return {"warning": "Empty mimetype (request/id='image') not allowed."}, 400
    imageObj = request.files['image']
    # request.files['image'].filename
    baseObj = base64.b64encode(imageObj.read())
    tenAPIObj = reqget("https://ocr.tencentcloudapi.com", params={
		"Action": "GeneralHandwritingOCR",
		"Region": "ap-guangzhou",
		"Version": "2018-11-19",
        "ImageBase64": baseObj,
        "EnableWordPolygon": True
        }, headers={
        "X-TC-Action": "GeneralHandwritingOCR",
        "X-TC-Region": "ap-guangzhou",
        "X-TC-Version": "2018-11-19",
        "X-TC-Timestamp": str(int(time.time()))
    })
    print(tenAPIObj.status_code, tenAPIObj.content, len(baseObj) * 3.0 / 4096, sep='\n')
    # request.charset
    # request.cookies[]
    return "200"