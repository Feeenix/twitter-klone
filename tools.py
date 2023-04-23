#!/usr/bin/python3

import json
import sys
import argparse

from random_username.generate import generate_username
import names

import server


EMPTY_USERS = {}
EMPTY_POSTS = {"count": 0, "posts": {}}


def reset():
    with open("users.txt", "w") as f:
        json.dump(EMPTY_USERS, f)

    with open("posts.txt", "w") as f:
        json.dump(EMPTY_POSTS, f)


def createUsers(n):
    usernames = generate_username(n)
    for username in usernames:
        name = names.get_full_name()
        server.newUser(username, "123123", name)

def main():
    parser = argparse.ArgumentParser(
            prog="tools",
            description="Tools for Bark server")

    subparsers = parser.add_subparsers(dest="command")
    #command_group = parser.add_mutually_exclusive_group()

    createUsersParser = subparsers.add_parser(
            "createUsers",
            help="Creates <n> new random users")

    createUsersParser.add_argument(
            "n",
            type=int,
            help="Number of users to create")


    resetParser = subparsers.add_parser(
            "reset",
            help="Resets the server enviroment by wiping all users and posts")


    args = parser.parse_args()
    if args.command == None:
        parser.print_help()
    elif args.command == "createUsers":
        createUsers(args.n)
    elif args.command == "reset":
        reset()

if __name__ == "__main__":
    main()

