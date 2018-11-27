# Application Security Project

This app is run using Python3 v3.7.0, Node.js v9.11.1, and MongoDB.

**Install required dependencies:**

```
pip3 install autocorrect
```

```
npm install
```

**To get started:**

Run MongoDB local in the terminal

```
mongod
```

Start the Node server

```
nodemon server.js
```

Now the app can be seen hosted on http://localhost:4000/

**User functionality:**

Users can sign up for an account, login/logout, and upload a file to spellcheck, which will then be processed and downloaded on to the user's machine.

**Security Considerations:**

Secure web application implementation can be seen [here](Assignment_2.pdf).

**Update - Third Submission:**

Logging: I use express-winston to log user actions to a file. This included request metadata, header information, timestamp, user actions by logging request routes, and the timestamp.

Security updates: I included user functionality to save spellchecked files in MongoDB. Also, users can now invoke the "Remember me" utility, and their sessions will be saved using cookies for 24 hours. I am still working on how to validate uploaded text files.
