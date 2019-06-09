#!/bin/bash
npm install -registry=https://registry.npm.taobao.org
pm2 start pm2start.json --env production --watch