const passport = require("passport/lib");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  // 로그인 시 실행, req.session에 어떤 데이터를 저장할 지 정하는 메서드
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 매 요청 시 실행, passport.session() 미들웨어가 이 메서드를 호출
  // user.id가 id로 들어오면, req.user에 그에 해당하는 사용자 정보를 저장
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });

  local();
  kakao();
};
