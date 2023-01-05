# Attendance-system
### 此專案為attendance專案的後端API伺服器
前端連結: https://github.com/zxc58/attendance \
API文件: https://attendance-system-production.up.railway.app/api-doc/
### 環境要求
nodejs : ^16.16.0\
redis : ^3.0.504\
mysql : ^8.0.27
## 環境變數(參考)
https://github.com/zxc58/attendance-system/blob/main/.env.example
## 本地架設
### 下載專案
```
$ git clone https://github.com/zxc58/attendance-system.git
```
### 建立.env檔案
```
$ cat .env
```
環境變數請參考上述連結
### 下載相依套件
```
$ npm install
```
### 建立資料庫與種子資料
請確定連線url
```
$ npm initDB
```
### 開始專案
```
$ npm start
```
