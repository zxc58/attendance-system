# Attendance-system
### 此專案為attendance專案的後端API伺服器
前端連結: https://github.com/zxc58/attendance \
API文件: https://attendance-system-production.up.railway.app/api-doc/
### 環境要求
nodejs : ^16.16.0\
redis : ^3.0.504\
mysql : ^8.0.27
### 專案框架
express, sequelize, swagger, passport
## 環境變數(參考)
https://github.com/zxc58/attendance-system/blob/main/.env.example
## 本地架設
### 下載專案
```
$ git clone https://github.com/zxc58/attendance-system.git
```
### 建立.env檔案
若使用本地開發環境，請建立.env檔案供專案使用，環境變數請參考上述連結
```
$ cat .env
```
### 下載相依套件
```
$ npm install
```
### 建立資料庫與種子資料
請先確定連線url，本專案開發時使用MySQL並具有預設url，也可使用自己的資料庫,erd圖
https://github.com/zxc58/attendance-system/blob/main/public/ERD.png
#### 建立資料庫架構
```
$ npx sequelize db:migrate --url <YOUR_DATABASE_URL>
```
#### 建立種子資料
專案中種子資料包含2022/2023行事曆，員工、部門、出勤資料，
可視需求在Seeder資料夾中進行增修(建議至少留下行事曆資料)
```
$ npx sequelize db:seed:all --url <YOUR_DATABASE_URL>
```
### 開始專案
```
$ npm start
```
