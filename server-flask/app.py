#!/bin/env python3

from flask import Flask, request
from flask_cors import CORS
from pkgMethod import imageProcess
# try:
#     import flask
# except ImportError:
#     print('Please /run "pip install flask".')

app = Flask(__name__)
version_str = "0.0.1"
app.config['JSON_AS_ASCII'] = False
# stackoverflow python-jsonify-dictionary-in-utf-8
CORS(app, resources=r"/*", origins="*")

@app.route("/recognition", methods = ['POST'])
@app.route("/api/recognition", methods = ['POST'])
# @cross_origin()
def api_init_recognition():
    dictGet, status_code = imageProcess()
    dictGet["Version"] = version_str
    # dictGet["Message"] = dictGet["Warning"] + '\n'
    return dictGet, status_code

@app.route("/")
@app.route("/api/")
def api_init():
    return {"List": [{"Route": "{}".format(request.path + "recognition"), "Method": "POST"}], "Version": version_str}, 200

@app.errorhandler(404)
def error_404(e):
    return {"Warning": "API route not found.", "Version": version_str}, 404

@app.errorhandler(405)
@app.errorhandler(500)
def error_405(e):
    return {"Warning": str(e.description), "Version": version_str}, e.code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888, debug=True)