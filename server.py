#!/usr/bin/python3

from flask import Flask
from flask import render_template, redirect, url_for, request

from flask import session
from flask_session import Session

import traceback
import os
import json
import hashlib

def logError(s):
    tb = traceback.format_exc()
    with open("err.log", "a") as f:
        f.write(f"Error: {s}\nTraceback: {tb}\n")

def logInfo(s):
    with open("info.log", "a") as f:
        f.write(f"[INFO] {s}\n")

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config.update(
    SESSION_PERMANENT=False,
    SESSION_TYPE="filesystem",
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SECRET_KEY="83012c07d4bc053fc8028c1d14fc065b65c5feff90e2b44f"
)
Session(app)



def getUserFromUsername(username):
    with open("users.txt", "r") as f:
        users = json.load(f)
    
    for u in users:
        if u["username"] == username:
            return u

    return None




@app.get("/favicon.ico")
def favicon():
    try:
        return redirect(url_for("static", filename="favicon.ico"))
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


@app.get("/")
def index():
    try:
        # If user is not logged in then redirect to login page
        if not session.get("name"):
            return redirect("/login")

        # Get user
        user = getUserFromUsername(session["name"])

        # Redirect to home
        return redirect("/home")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/home", strict_slashes=False)
def home():
    try:
        # If user is not logged in then redirect to login page
        if not session.get("name"):
            return redirect("/")

        user = getUserFromUsername(session["name"])
        return render_template("home.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.route("/logout", strict_slashes=False)
def logout():
    session["name"] = None
    return redirect("/login")


@app.get("/login", strict_slashes=False)
def loginGET():
    try:
        return render_template("/login.html")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.post("/login", strict_slashes=False)
def loginPOST():
    try:
        username = request.form.get("brukernavn")
        password = request.form.get("passord")
        if not username or not password:
            return render_template("login.html", error="Error in form")

        logInfo("Yuuuh got stuff")

        # TODO Check if credentials are an actual user
        #return render_template("login.html", error="Invalid credentials")

        session["name"] = username

        return redirect("/home")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/register", strict_slashes=False)
def registerGET():
    try:
        return render_template("/registrere.html")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.post("/register", strict_slashes=False)
def registerPOST():
    try:
        username = request.form.get("brukernavn")
        password = request.form.get("passord")
        if not username or not password:
            return render_template("registrere.html", error="Error in form")

        with open("users.txt", "r") as f:
            users = json.load(f)

        # Check for duplicates
        for user in users:
            if username == user["username"]:
                logInfo("Username already exists")
                return render_template("registrere.html", error="Username already exists")

        # TODO temporary no hashing
        hashed_password = password
        new_user = {"username": username,
                    "hashedPassword": hashed_password,
                    "name": "Elon Musk 2.0"}

        users.append(new_user)
        with open("users.txt", "w") as f:
            json.dump(new_user, f)

        logInfo("Successfully registered new user")

        session["name"] = username
        return redirect("/home")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/viewprofile")
def viewprofile():
    try:
        username = request.args.get("brukernavn", default=session["name"], type=str)
        user = getUserFromUsername(username)
        return render_template("viewprofile.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/settings")
def settings():
    try:
        user = getUserFromUsername(session["name"])
        return render_template("settings.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/customize")
def customize():
    try:
        user = getUserFromUsername(session["name"])
        return render_template("customize.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


app.run(host="127.0.0.1", port=8080, debug=True)

