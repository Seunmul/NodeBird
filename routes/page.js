const express = require("express");
const {isLoggedIn, isNotLoggedIn} = require("./middlewares");
const router = express.Router();

router.use((res, req, next) => {
  // 객체 선언방식은 이렇게 하도록 하자.
  // res가 타입 선언이 안되어있어서 에러뜨는듯.
  res.locals = {
    user: null,
    followerCount: 0,
    followingCount: 0,
    followerIdList: [],
  };

  next();
});
//isLoggedIn 미들웨어의 req.isAuthenthicated()가 true여야 next가 호출됩니다.
router.get("/profile",isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});
//isLoggedIn 미들웨어의 req.isAuthenthicated()가 false여야 next가 호출됩니다.
router.get("/join",isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
  });
});

module.exports = router;
