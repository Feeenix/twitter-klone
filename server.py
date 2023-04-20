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


def hashPassword(password):
    return hashlib.sha256(password.encode()).hexdigest()

def getUserFromUsername(username):
    with open("users.txt", "r") as f:
        users = json.load(f)
    
    for u in users:
        if u["username"] == username:
            return u

    return None


def validateUserCredentials(username, password):
    with open("users.txt", "r") as f:
        users = json.load(f)

    hashed_password = hashPassword(password)
    for user in users:
        if user["username"] == username and user["hashedPassword"] == hashed_password:
            return True

    return False

def userLoggedIn():
    return session.get("user")

def newPost(post):
    with open("posts.txt", "r") as f:
        posts = json.load(f)

    posts["count"] += 1
    posts["posts"][posts["count"]] = post

    with open("posts.txt", "w") as f:
        json.dump(posts, f)

@app.get("/favicon.ico")
def favicon():
    try:
        return redirect(url_for("static", filename="favicon.ico"))
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.after_request
def after_request(response):
    logInfo(f"response {request.url}")
    if "logout" in request.url:
        #response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers['Clear-Site-Data'] = '"cache"'
    return response


@app.get("/")
def index():
    try:
        # If user is not logged in then redirect to login page
        if not session.get("name"):
            return redirect("/login")

        # Redirect to home
        return redirect("/home")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/home", strict_slashes=False)
def home():
    try:
        # If user is not logged in then redirect to login page
        if not userLoggedIn():
            return redirect("/")

        user = session["user"]
        return render_template("home.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.route("/logout", strict_slashes=False)
def logout():
    session["user"] = None
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

        if validateUserCredentials(username, password):
            user = getUserFromUsername(username)
            session["user"] = user
            return redirect("/home")
        else:
            return render_template("login.html", error="Invalid credentials")

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

        #posts = {
        #   "username": "elonmusk",
        #   "content": "I am a tweet",
        #   "coments": [],
        #   "retweets": 10,
        #   "likes": 10,
        #   "views": 10,
        #}

        # comments follow same structure as posts

        post = {
            "content": "This is a cool tweet",
            "coments": [],
            "retweets": 10,
            "likes": 20,
            "views": 10,
        };
        newPost(post)

        hashed_password = hashPassword(password)
        new_user = {"username": username,
                    "hashedPassword": hashed_password,
                    "name": "Elon Musk 2.0",
                    "pfp": "mypfp.png",
                    "pfb": "mybanner.png",
                    "posts": [0],
                    "followers": [],
                    "following": [],
                    "pinnedPost": None,
                    "bio": "Nothing yet...",
                    "status": "Offline",
                    "location": "Mars",
                    "settings": {
                        "darkMode": False,
                        "background-color": "#ffffff",
                        "text-color": "#000000",
                        "font": "Inter",
                        "font-size": "1em",
                    }}

        users.append(new_user)
        with open("users.txt", "w") as f:
            json.dump(users, f)

        logInfo(f"Successfully registered new user '{username}'")

        session["user"] = new_user
        return redirect("/home")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/viewprofile")
def viewprofile():
    try:
        user = session["user"]
        username = request.args.get("brukernavn", default=user["username"], type=str)
        otherUser = getUserFromUsername(username)
        return render_template("viewprofile.html", user=user, otherUser=otherUser)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/settings")
def settings():
    try:
        user = session["user"]
        return render_template("settings.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/customize")
def customize():
    try:
        user = session["user"]
        return render_template("customize.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/search")
def search():
    try:
        user = session["user"]
        return render_template("sok.html", user=user)
    except Exception as e:
        logError(e)
        return f"Error {e}"


if __name__ == '__main__':
    context = ("server.crt", "server.key")
    #app.run(host="127.0.0.1", port=8080, ssl_context=context, debug=True)
    app.run(host="127.0.0.1", port=8080, debug=True)

