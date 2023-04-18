#!/usr/bin/python3

from flask import Flask
from flask import render_template
import traceback

def log(s):
    tb = traceback.format_exc()
    with open("app.log", "a") as f:
        f.write(f"Error: {s}\nTraceback: {tb}\n")

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route("/")
def index():
    try:
        return render_template("index.html")
    except Exception as e:
        log(e)
        return f"Error {e}"

@app.route("/home", strict_slashes=False)
def home():
    try:
        return render_template("home.html")
    except Exception as e:
        log(e)
        return f"Error {e}"

app.run(host="127.0.0.1", port=8080)

