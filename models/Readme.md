# sequelize 객체 디자인 패턴 및 폴더구조

index.js에서 sequelize 객체를 선언하고(싱글톤 패턴)
db모델에 연결한 다음에
관계를 정의해준다.

또한 해당 output 객체를 export하여 
다른 코드베이스에서 접근할 수 있다.

config.json 설정 후 
npx sequelize db:create 명령해주면
명령줄에서 sequlize를 통해 로컬 Mysql 데이터베이스가 생성된다.