#!/bin/bash

mongod &
echo $! > mongod.pid

nodemon app.js &
echo $! > nodemon.pid

open http://localhost:3000/