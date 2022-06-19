const Admin = require("../../model/admin.model");
const utils = require("../../lib/utils");


exports.loginAdmin = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
 
  if (!email) {
    return res.status(200).json({
      code: 204,
      success: false,
      status: "No Content",
      message: "Please enter your email address.",
    });
  } else if (!password) {
    return res.status(200).json({
      code: 204,
      success: false,
      status: "No Content",
      message: "Please enter a valid password.",
    });
  } else {
    const userEmail = await Admin.findOne({ email });
    if (!userEmail) {
      return res.status(200).json({
        code: 203,
        success: false,
        status: "Bad Request",
        message: "You are not a registerd user. Please register before login",
      });
    } else {
      const isValid = utils.validPassword(
        password,
        userEmail.hash,
        userEmail.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(email);
        console.log("tokenObject.sub",tokenObject.sub);

        res.status(200).json({
          code: 201,
          success: true,
          status: "Login Success",
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          sub: tokenObject.sub,
        });
      } else {
        res.status(200).json({
          code: 203,
          success: false,
          status: "Password Error",
          msg: "You entered the wrong password. Please check again.",
        });
      }
    }
  }
};
