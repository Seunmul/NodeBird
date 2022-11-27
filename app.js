// module import
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
const pageRouter = require("./routes/page");
const passportConfig = require("./passport");
const { sequelize } = require("./models");

const app = express(); // express 인스턴스 생성 및 설정
passportConfig(); // passport 설정
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");

//nunjucks html 렌더링
nunjucks.configure("views", {
  express: app,
  watch: true,
});

//db sync 맞추기
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("database connection success");
  })
  .catch((err) => {});

//midleware 설정
app.use(morgan("dev")); // 로그
app.use(express.static(path.join(__dirname, "public"))); // 정적파일 제공
app.use(express.json()); // json 형식의 데이터를 받을 수 있게
app.use(express.urlencoded({ extended: false })); // form 데이터를 받을 수 있게
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 받을 수 있게
app.use( // 세션을 받을 수 있게
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize()); // 요청에 passport 설정을 습니다.
app.use(passport.session());
/* req.session 객체에 passport 정보를 저장합니다.
req.session 객체는 express-session에서 생성합니다.
passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야합니다.
*/

app.use("/", pageRouter); //페이지 라우터 설정

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
