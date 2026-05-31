# Environment Variables

이 문서는 프로젝트 실행에 필요한 환경변수 목록과 각 변수의 역할을 설명한다.

실제 환경변수 값은 .env, .env.local, 서버 환경변수, 또는 Secret 저장소에서 관리한다.
GitHub에는 실제 값이 포함된 .env 파일을 업로드하지 않고, .env.example 또는 이 문서처럼 양식만 공유한다.

1. Server
2. Database switch
3. PostgreSQL
4. Node mailer
5. File storage
6. example

---

## 1. Server

서버 실행 환경과 포트 번호를 설정한다.

### PORT

Node.js 서버가 실행될 포트 번호를 의미한다.

로컬 개발 환경에서는 일반적으로 5500을 사용한다.
클라우드 환경이나 운영 환경에서는 배포 방식에 따라 다른 포트를 사용할 수 있다.

```
PORT=5500
```

### NODE_ENV

현재 서버가 어떤 환경에서 실행 중인지 구분하기 위한 값이다.

사용 가능한 값:

```
NODE_ENV=local
NODE_ENV=dev
```

local: 개발자 개인 PC에서 실행하는 환경
dev: 팀 개발용 서버 또는 클라우드 테스트 환경

---

## 2. Database Switch

DB 연결을 사용할지 여부를 설정한다.

### USE_DB

서버 실행 시 PostgreSQL 데이터베이스 연결을 사용할지 결정한다.

```
USE_DB=false
```

사용 가능한 값:

```
USE_DB=true
USE_DB=false
```

true: DB 연결 사용
false: DB 연결 비활성화

DB가 아직 구축되지 않았거나, 웹서버/정적 파일/API 라우팅만 먼저 테스트하고 싶을 때는 false로 설정한다.

---

## 3. PostgreSQL

PostgreSQL 데이터베이스 접속에 필요한 정보를 설정한다.

DB 연결을 사용하는 경우 USE_DB=true로 설정하고, 아래 항목들을 환경에 맞게 작성해야 한다.

### DB_USER

PostgreSQL 접속 계정 이름이다.

```
DB_USER=
```

### DB_PASSWORD

PostgreSQL 접속 계정의 비밀번호이다.

이 값은 민감 정보이므로 GitHub에 업로드하면 안 된다.

```
DB_PASSWORD=
```

### DB_HOST

PostgreSQL 서버 주소이다.

로컬 DB를 사용하는 경우 보통 localhost를 사용한다.
클라우드 DB를 사용하는 경우 클라우드에서 제공하는 DB 호스트 주소를 입력한다.

```
DB_HOST=
```

### DB_PORT

PostgreSQL 접속 포트 번호이다.

PostgreSQL의 기본 포트는 5432이다.

```
DB_PORT=5432
```

### DB_NAME

접속할 PostgreSQL 데이터베이스 이름이다.

```
DB_NAME=
```

---

## 4. Node Mailer

메일 발송 및 인증 기능에서 사용하는 환경변수를 설정한다.

### JWT_SECRET

JWT 토큰 생성 및 검증에 사용하는 Secret 값이다.

이 값이 유출되면 인증 보안에 문제가 생길 수 있으므로 GitHub에 업로드하면 안 된다.

```
JWT_SECRET=
```

### GMAIL_USER

메일 발송에 사용할 Gmail 계정이다.

```
GMAIL_USER=
```

### GMAIL_APP_PASSWORD

Gmail SMTP 인증에 사용할 앱 비밀번호이다.

일반 Gmail 비밀번호가 아니라, Gmail 계정에서 별도로 발급한 앱 비밀번호를 사용한다.
이 값은 민감 정보이므로 GitHub에 업로드하면 안 된다.

```
GMAIL_APP_PASSWORD=
```

---

## 5. File DIR

서버에서 사용할 파일 저장 경로를 설정한다.

### PRESENTATION_DIR

presentation 폴더의 위치를 지정한다.

로컬 환경에서는 상대 경로를 사용할 수 있다.

```
PRESENTATION_DIR=./presentation
```

클라우드 VM 환경에서는 절대 경로를 사용하는 것이 더 안전하다.

```
PRESENTATION_DIR=/home/azureuser/app/presentation
```

이 값을 환경변수로 분리하면 로컬과 클라우드에서 파일 경로가 달라져도 코드 수정 없이 설정만 변경할 수 있다.

---

## 6. Example

아래는 로컬 개발 환경에서 사용할 수 있는 예시이다.

# Server
PORT=5500
NODE_ENV=local

# Database Switch
USE_DB=false

# PostgreSQL
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
DB_NAME=

# Node Mailer
JWT_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=

# File DIR
PRESENTATION_DIR=./presentation