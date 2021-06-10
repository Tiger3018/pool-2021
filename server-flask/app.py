#!/bin/env python3

from flask import Flask
from flask_cors import CORS
from pkgMethod import imageProcess
# try:
#     import flask
# except ImportError:
#     print('Please /run "pip install flask".')

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
# stackoverflow python-jsonify-dictionary-in-utf-8
CORS(app, resources=r"/api/*")

@app.route("/api/recognition", methods = ['POST'])
# @cross_origin()
def api_init_recognition():
    dictGet, status_code = imageProcess()
    return {"Version" : "0.0.1", **dictGet}, status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888, debug=True)