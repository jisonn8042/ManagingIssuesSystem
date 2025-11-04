# 課題管理システム🗃️

***

## 目次

1. [システム紹介](#システム紹介)
2. [開発日程](#開発日程)
3. [開発環境、技術スタック](#開発環境と技術スタック)
4. [プロジェクトフォルダ構造](#プロジェクトフォルダ構造)
5. [機能紹介](#機能紹介)
6. [重要機能詳細](#重要機能詳細)
7. [改善点](#改善点)
8. [感想](#感想)

***

## システム紹介

Excel方式で管理しながら感じた改善点を適用した進化した課題管理システム

- システム上で全課題を確認できるため、会社でチーム単位で行うとき、様々な課題管理ファイルを個別に管理する必要がない。

- 文書を作成するとき、課題内容作成に集中できるよう自動的に入力できる項目に関して入力を自動化。

- 作成した課題を他のユーザに課題のURLを送信できて依頼や共有しやすい。

- ローグ機能でシステム上行ったことに関して確認できる。

- ユーザ管理機能を使って課題の削除や、他のユーザの権限を編集を管理できます。

***

## 開発日程

2025.03.03 ~ 2025.06.06

| 期間 | 内容 |
| :----: | :--: |
| 02.10 ~ 02.26 | 要件定義 |
| 02.27 ~ 03.24 | 外部設計 |
| 03.25 ~ 05.20 | プログラミング |
| 05.21 ~ 06.06 | テスト |
| 06.06 ~ | 運用・保守 |

***

## 開発環境と技術スタック

> 文書作成とコミュニケーション

| Excel | PowerPoint | Teams |
| :---: | :---: | :---: |
| <img alt="Excel logo" src="/Presentation/assets/readmelogos/Excel_logo.svg" width="45" height="45"> | <img alt="powerpoint logo" src="/Presentation/assets/readmelogos/Powerpoint_logo.svg" width="45" height="45"> | <img alt="teams logo" src="/Presentation/assets/readmelogos/Teams_logo.svg" width="45" height="45"> |

> 開発ツール

| Figma | Cursor | Git | GitHub | Gemini | ChatGPT |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img alt="figma logo" src="/Presentation/assets/readmelogos/Figma_logo.svg" width="45" height="45"> | <img alt="cursor logo" src="/Presentation/assets/readmelogos/Cursor_logo.svg" width="45" height="45"> | <img alt="git logo" src="/Presentation/assets/readmelogos/Git_Iogo.svg" width="45" height="45" > | <img alt="github logo" src="/Presentation/assets/readmelogos/Github_logo.svg" width="45" height="45"> | <img alt="gemini logo" src="/Presentation/assets/readmelogos/Gemini_logo.svg" width="45" height="45"> | <img alt="chatgpt logo" src="/Presentation/assets/readmelogos/Chatgpt_logo.svg" width="45" height="45"> |

> フロントエンド

| HTML | CSS | JavaScript |
| :---: | :---: | :---: |
| <img alt="html logo" src="/Presentation/assets/readmelogos/Html_logo.svg" width="45" height="45"> | <img alt="css logo" src="/Presentation/assets/readmelogos/Css_logo.svg" width="45" height="45"> | <img alt="javascript logo" src="/Presentation/assets/readmelogos/Javascript_logo.svg" width="45" height="45"> |

> バックエンド

| Node.js |　PostgreSQL |
| :---: | :---: |
| <img alt="nodejs logo" src="/Presentation/assets/readmelogos/Node.js_logo.svg" width="45" height="45"> | <img alt="postgresql logo" src="/Presentation/assets/readmelogos/Postgresql_logo.svg" width="45" height="45"> |

***

## プロジェクトフォルダ構造

```text

TaskManagingSystem
├── Presentation
│   ├── assets
│   │   └── images
│   │       └── taskmanagesystem-login.png
│   ├── components
│   │   ├── checkbox
│   │   |    ├── checkbox.css
│   │   |    ├── checkbox.html
│   │   |    └── checkbox.js
│   │   ├── dropbox
│   │   |    ├── dropbox.css
│   │   |    ├── dropbox.html
│   │   |    └── dropbox.js
│   │   ├── profilecard
│   │   |    ├── profilecard.css
│   │   |    ├── profilecard.html
│   │   |    └── profilecard.js
│   │   └── userlistdropbox
│   │        ├── userlistdropbox.css
│   │        ├── userlistdropbox.html
│   │        └── userlistdropbox.js
│   ├── detail
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── list
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── login
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── registrationfix
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── signin
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── usermanage
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   └── middlewares
│       └── checkAuth.js
└── server
    ├── api.js
    └── writeexcel.js

```

***

## 機能紹介

### ウェブアプリケーション

> ユーザ管理機能

<img alt="showup-tms-manageusers-img" src="/Presentation/assets/readmedisplay/manage_users_pic.png" width="960" height="540">

> 課題検索機能

<img alt="showup-tms-manageusers-img" src="/Presentation/assets/readmedisplay/tms-search.webp" width="960" height="540">

> 課題登録修正削除機能

登録

<img alt="showup-tms-taskregist-img" src="/Presentation/assets/readmedisplay/tms-taskregist.webp" width="960" height="540">

修正

<img alt="showup-tms-taskfix-img" src="/Presentation/assets/readmedisplay/tms-taskfix.webp" width="960" height="540">

削除

<img alt="showup-tms-delete-img" src="/Presentation/assets/readmedisplay/tms-taskdelete.webp" width="960" height="540">


> ログ出力機能

いつ、誰が、何を、その結果をログとして閲覧することができます。

<img alt="showup-tms-log-img" src="/Presentation/assets/readmedisplay/tms-log.webp" width="960" height="540">

> 課題情報をメール送信機能

送信された状況を見せることが難しため、コードを見せます。

```javascript

if (method === "POST" && pathUrl === "/sendmail"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const mailData = JSON.parse(body);
                    const mailOptions = {
                        from: 'test@mail.com',
                        to: mailData.to,
                        subject: '課題管理システム課題依頼',
                        text: `課題依頼されたページは以下のURLです。\n${mailData.pageUrl}\n\n依頼メッセージ：\n${mailData.to}`
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.writeHead(404, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "メール送信に失敗しました" }));
                            logger.info(`End   ${req.method}, ${req.url}, failed-to-send-mail ${user}`);
                            return;
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "メールを送信しました" }));
                            logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                            return;
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                }
            });

        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
}


```

### ウェブアプリケーションサーバー

> ウェブリソース提供

送信された状況を見せることが難しため、コードを見せます。

```javascript

    if (pageRoutes[pathUrl] && !pathUrl.includes("/detail")) {
        const [folder, file] = pageRoutes[pathUrl];
        const filePath = path.join(__dirname, "../Presentation", folder, file);
        
        fs.readFile(filePath, (err, data) => {
            if(err){
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
            res.end(data);
            logger.info(`Move ${req.method}, ${req.url}`);
        });
    }

    const ext = path.extname(pathUrl);
    if(ext && !pathUrl.includes("/detail")){
        const segments = pathUrl.split("/");
        const folder = segments[1];
        const restPath = segments.slice(2).join("/");
        const filePath = path.join(__dirname, "../Presentation", folder, restPath);

        fs.readFile(filePath, (err, data) => {
            if(err){
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": mimeTypes[ext] });
            res.end(data);
        });
    }

```

> 必要な機能やデータをapiを構築し、提供

> 課題情報をメール送信機能

***

（作成中）


## 重要機能詳細

> ユーザ管理機能

> 課題検索機能

> 課題登録修正削除機能

> ログ出力機能

> ウェブリソース提供

> 必要な機能やデータをapiを構築し、提供

***

## 改善点

- ### コード構造

> 課題情報をメール送信機能

async/awaitを活用して簡潔化


- ### 性能


- ### セキュリティ

> HTTPで通信が行っている

- HTTPSより全然ではない

> ウェブリソース提供

- ディレクトリ・トラバーサル方法をもっと安全に

> 

## 感想

- 実際に開発が終わってコードを見たらロジック構造、性能、セキュリティ全体的に不足している部分が沢山ありました。

- 構造面ではaync/awaitとthenの使いところや統一性、プロジェクトフォルダ構造、画面レンダリング方式、WEBサーバとアプリケーションサーバの分割、AWSを活用したサーバ構築など

- 性能面ではHTTPではなくHTTP3を採用、ウェブビルド など

- セキュリティ面ではCORS設定やトランザクション活用など

- 危機対策として色んな国にサーバを複製など

- 色んな考慮しなければならない部分があるということを分かりました。

- なんで今の状況になったのか考えてみると開発するサービスを構築した経験がないからだと思いました。

- 今後、このシステムを使えるシステムに改善しながら必要な経験を積んでいきたいと思います。