# Attendance-system

### 此專案為 attendance 專案的後端 API 伺服器

前端連結: https://github.com/zxc58/attendance \

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

本專案使用imgur儲存庫，請先至imgur申請一個app id。

### Email服務

本專案使用gmail服務，先申請一組APP帳密供本專案使用。

### 建立.env 檔案

若使用本地開發環境，請在跟目錄下建立.env 檔案供專案使用，環境變數請參考上述連結

```
$ touch .env
```

### 下載相依套件

```
$ npm install
```

### 建立資料庫與種子資料

請先確定 DB 連線 url，本專案開發時使用 MySQL 並具有預設 url，也可使用自己的資料庫<br/>
erd 圖
![image](https://github.com/zxc58/attendance-system/blob/main/public/ERD.png)

#### 建立資料庫架構

```
$ npx sequelize db:migrate --url <YOUR_DATABASE_URL>
```

#### 建立種子資料

專案中種子資料包含 2022/2023 行事曆，以及模擬員工、部門、出勤資料，
可視需求在 Seeder 目錄下進行增修(建議至少留下行事曆資料)

```
$ npx sequelize db:seed:all --url <YOUR_DATABASE_URL>
```

### 開始專案

```
$ npm start
```

### 登入資料

預設的員工資料
| 帳號 | 密碼 | 權限 |
|:----:|:----:|:----:|
|titansoft|titaner|employee|
|alphacamp|titaner|employee|
|admin|tiadmin|admin|

### Docker開發

本專案有建立 development docker-compose，若是想使用 docker 進行後續開發，可以在建立 .env 檔案後使用下面指令

```
npm run docker:up:dev
```
此指令會建立3個container，包含memory store、database和本專案，並會建立資料庫架構與種子資料。
註:請先空出 3000 和 3305 PORT 給server和database
