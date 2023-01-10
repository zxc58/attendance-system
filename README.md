# Attendance-system
### 此專案為attendance專案的後端API伺服器
前端連結: https://github.com/zxc58/attendance \
API文件: https://attendance-system-production.up.railway.app/api-doc/
### 環境要求
nodejs : ^16.16.0<br/>
redis : ^3.0.504<br/>
mysql : ^8.0.27<br/>
### 專案框架、套件
express/sequelize/swagger/passport
## 環境變數(參考)
https://github.com/zxc58/attendance-system/blob/main/.env.example
## 本地架設
### 下載專案
```
$ git clone https://github.com/zxc58/attendance-system.git
```
### 第三方圖片儲存
本專案預設使用AWS S3儲存服務，請先至AWS S3服務中建立儲存庫，以及AWS IAM 中建立一個使用者，給使用者S3服務權限，並創建access key,在接下來環境變數中使用。
### 建立.env檔案
若使用本地開發環境，請在跟目錄下建立.env檔案供專案使用，環境變數請參考上述連結
```
$ touch .env
```
### 下載相依套件
```
$ npm install
```
### 建立資料庫與種子資料
請先確定DB連線url，本專案開發時使用MySQL並具有預設url，也可使用自己的資料庫<br/>
erd圖
![image](https://github.com/zxc58/attendance-system/blob/main/public/ERD.png)
#### 建立資料庫架構
```
$ npx sequelize db:migrate --url <YOUR_DATABASE_URL>
```
#### 建立種子資料
專案中種子資料包含2022/2023行事曆，以及模擬員工、部門、出勤資料，
可視需求在Seeder目錄下進行增修(建議至少留下行事曆資料)
```
$ npx sequelize db:seed:all --url <YOUR_DATABASE_URL>
```
### 開始專案
```
$ npm start
```
### 登入資料
預設的員工資料
| 帳號 | 密碼  | 權限 |
|:----:|:----:|:----:|
|titansoft|titaner|employee|
|alphacamp|titaner|employee|
|admin|tiadmin|admin|
