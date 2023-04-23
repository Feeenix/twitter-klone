#!/usr/bin/python3

from flask import Flask
from flask import render_template, redirect, url_for, request

from flask import session
from flask_session import Session

import traceback
import os
import json
import hashlib

from socket import gethostname

import datetime


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
    users = getUsers()
    if username in users:
        return users[username]

    return None


def validateUserCredentials(username, password):
    users = getUsers()
    hashed_password = hashPassword(password)
    return username in users and users[username]["hashedPassword"] == hashed_password


def newPost(username, content):
    with open("posts.txt", "r") as f:
        posts = json.load(f)

    post = {
        "username": username,
        "content": content,
        "timePosted": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "comments": [],
        "retweets": 10,
        "likes": 20,
        "views": 10,
    }

    postID = str(posts["count"])
    posts["posts"][postID] = post
    posts["count"] += 1

    with open("posts.txt", "w") as f:
        json.dump(posts, f, default=str, indent=4)

    users = getUsers()
    users[username]["posts"].append(postID)

    saveUsers(users)

    return postID


def getPosts():
    with open("posts.txt", "r") as f:
        posts = json.load(f)

    posts = posts["posts"]

    for postID in posts:
        posts[postID]["timePosted"] = datetime.datetime.strptime(posts[postID]["timePosted"], "%Y-%m-%d %H:%M:%S")

    return posts


def getUsers():
    with open("users.txt", "r") as f:
        users = json.load(f)

    return users


def saveUsers(users):
    with open("users.txt", "w") as f:
        json.dump(users, f, indent=4)


def prettyFormatTime(cur, posted):
    time = cur - posted

    if time.days > 7:
        return f"{posted.date()}"

    if time.days > 0:
        return f"{time.days}d"

    hours = time.seconds // 3600
    if hours > 0:
        return f"{hours}h"

    minutes = (time.seconds // 60) % 60
    if minutes > 0:
        return f"{minutes}m"

    # Just now?

    return f"{time.seconds}s"


def newUser(username, password, name):
    users = getUsers()

    # Check for duplicates
    if username in users:
        return False

    hashed_password = hashPassword(password)
    new_user = {"username": username,
                "hashedPassword": hashed_password,
                "name": name,
                "profileImage": "default_pfp.png",
                "bannerImage": "default_banner.png",
                "bannerColor": "#808080",
                "posts": [],
                "followers": [],
                "following": [],
                "pinnedPost": None,
                "bio": "Nothing yet...",
                "status": "Offline",
                "location": "Mars",
                "joined": datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S"),
                "settings": {
                    "darkMode": False,
                    "background-color": "#ffffff",
                    "text-color": "#000000",
                    "font": "Inter",
                    "font-size": "1em",
                }}

    users[username] = new_user
    saveUsers(users)

    return True


def getWhoToFollowForUser(user):
    users = getUsers()
    users.pop(user["username"])

    for u in user["following"]:
        users.pop(u)

    whotofollow = []
    for i, username in enumerate(users):
        if i == 20:
            break
        whotofollow.append(users[username])
    return whotofollow


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
        if "username" not in session:
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
        if "username" not in session:
            return redirect("/login")

        username = session["username"]
        user = getUserFromUsername(username)

        if not user:
            return redirect("/login")

        whotofollow = getWhoToFollowForUser(user)
        return render_template("home.html", user=user, whotofollow=whotofollow)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.route("/logout", strict_slashes=False)
def logout():
    session["username"] = None
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
            session["username"] = username
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
        name = request.form.get("navn")
        if not username or not password or not name:
            return render_template("registrere.html", error="Error in form")

        #posts = {
        #   "username": "elonmusk",
        #   "content": "I am a tweet",
        #   "coments": [],
        #   "retweets": 10,
        #   "likes": 10,
        #   "views": 10,
        #}

        # comments follow same structure as posts

        success = newUser(username, password, name)
        if not success:
            logInfo("Username already exists")
            return render_template("registrere.html", error="Username already exists")

        newPost(username, "This is a cool tweet")

        logInfo(f"Successfully registered new user '{username}'")

        session["username"] = username
        return redirect("/customize")
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/viewprofile")
def viewprofile():
    try:
        if "username" not in session:
            return redirect("/login")

        username = session["username"]
        user = getUserFromUsername(username)
        if not user:
            return redirect("/login")

        username = request.args.get("brukernavn", default=session["username"], type=str)
        otherUser = getUserFromUsername(username)
        posts = getPosts()
        #comments = getComments()
        currentTime = datetime.datetime.now()
        whotofollow = getWhoToFollowForUser(user)
        return render_template("viewprofile.html", user=user, whotofollow=whotofollow, otherUser=otherUser, posts=posts, currentTime=currentTime, prettyFormatTime=prettyFormatTime)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/settings")
def settings():
    try:
        username = session["username"]
        user = getUserFromUsername(username)
        whotofollow = getWhoToFollowForUser(user)
        return render_template("settings.html", user=user, whotofollow=whotofollow)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/customize")
def customize():
    try:
        if "username" not in session:
            return redirect("/login")

        username = session["username"]
        user = getUserFromUsername(username)

        if not user:
            return redirect("/login")

        whotofollow = getWhoToFollowForUser(user)
        return render_template("customize.html", user=user, whotofollow=whotofollow)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.get("/search")
def search():
    try:
        if "username" not in session:
            return redirect("/login")

        username = session["username"]
        user = getUserFromUsername(username)

        if not user:
            return redirect("/login")

        whotofollow = getWhoToFollowForUser(user)
        return render_template("sok.html", user=user, whotofollow=whotofollow)
    except Exception as e:
        logError(e)
        return f"Error {e}"


@app.post("/follow")
def followPOST():
    try:
        usernameToFollow = request.form.get("username")
        if not usernameToFollow:
            logError("Error in post in followPOST")
            return "a"

        username = session["username"]

        users = getUsers()
        if username not in users:
            return redirect("/login")

        if usernameToFollow in users[username]["following"]:
            logError("User already following")
            return "a"

        users[username]["following"].append(usernameToFollow)
        users[usernameToFollow]["followers"].append(username)

        saveUsers(users)

        return "a"

    except Exception as e:
        logError(e)
        return f"Error {e}"


if __name__ == '__main__':
    if 'liveconsole' not in gethostname():
        context = ("server.crt", "server.key")
        #app.run(host="127.0.0.1", port=8080, ssl_context=context, debug=True)
        app.run(host="127.0.0.1", port=8080, debug=True)

