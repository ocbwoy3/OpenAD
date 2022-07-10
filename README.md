# OpenAD

This repository contains the API for OpenAD, which is a project made by me. OpenAD is a REST API written in NodeJS and is used by Roblox game servers, to request an ad.

This file contains everything on how to get started using OpenAD.
Keep in mind that this is work in progress, and that the API is not stable yet.
And also, the API is written in NodeJS, and not in some other language.

## Getting started

First of all, you need to clone the repository and then cd into it.

```bash
git clone https://github.com/ocboy3/OpenAD.git && cd OpenAD
```

Then, you need to set up node.

```bash
npm init
```

.. and install the dependencies because OpenAD uses the "express" library.

```bash
npm install express
```

And you're done!

Make sure you have changed the user passwords in the users file! And also make sure to disable DevelMode in index.js and change the developer account username and password!

```bash
npm start .
```