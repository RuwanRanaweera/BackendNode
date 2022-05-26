const EMP = require("../../model/user.model");
const utils = require("../../lib/utils");
const { MACCE_GENERAL_CI } = require("mysql/lib/protocol/constants/charsets");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
//mongodb+srv://LoanApp:LoanApp@loanapp.53haq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


const mailgun = require("mailgun-js");
const { result } = require("lodash");
const DOMAIN = "sandbox63347f33bc91456f99fc0644f3a7a175.mailgun.org";
const mg = mailgun({ apiKey: "400a6c63e23b42a17b83a0b23d189da6-dbc22c93-fa1644a7", domain: DOMAIN });

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

exports.registerUser = async function (req, res, next) {

  const { email, name, join_date,end_date,user_type,salary,interviewer,image} = req.body;
  console.log("data", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        Success: false,
        message: "All field must be entered.",
      });
    }
    else if (!email) {
      return res.status(200).json({
        code: 204,
        status: "Bad Request",
        Success: false,
        message: "Please enter a valid email.",
      });
    } else if (!name) {
      return res.status(200).json({
        code: 204,
        status: "Bad Request",
        Success: false,
        message: "Please enter a valid name.",
      });
    } else if (!user_type) {
      return res.status(200).json({
        code: 204,
        status: "Bad Request",
        Success: false,
        message: "Please enter a valid user type.",
      });
    }
    else if (!validateEmail(email)) {
      return res.status(200).json({
        code: 204,
        success: false,
        status: "Bad Request",
        message: "Email is invalid, Please enter a valid email",
      });
    } else {
      const userEmail = await EMP.findOne({ email });
      if (userEmail) {
        return res.status(200).json({
          code: 208,
          success: false,
          status: "Email Exist",
          message: "This email is already exists.",
        });
      }

      const Name = await EMP.findOne({ name });
      if (Name) {
        return res.status(200).json({
          code: 208,
          success: false,
          status: "Name Exist",
          message: "This name is already exists.",
        });
      }

      const newUser = new EMP({
        email,
        name,
        join_date,
        end_date,
        user_type,
        salary,
        interviewer,
        image
  
      });
      const tokenObject = utils.issueJWT(newUser);
      console.log("Ruwan >>>");
      await newUser.save();
      console.log("Ruwan >>> 2222");
      return res.status(200).json({
        code: 200,
        status: "Success",
        Success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
        sub: tokenObject.sub,
        UserDetails: newUser,
      });
    }
  } catch (error) {
    console.log("error.message",error.message);
    return res.status(400).json({
      code: 401,
      status: "Bad Request",
      Success: false,
      message: error.message,
    });
  }
};




exports.getuserbyId = async (req, res) => {

  id = req.params.id;
  console.log("id ", id);

  await EMP.findById({ _id: id })
    .then(data => {
      res.status(200)
        .send({ message: "Success", data: data });
    }

    )
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}
exports.getuserbyType = async (req, res) => {

  type = req.params.type;
  console.log("id ", type);

  await EMP.find({ user_type: type })
    .then(data => {
      res.status(200)
        .send({ message: "Success", data: data });
    }

    )
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

exports.updateUserbyId = async (req, res) => {
  try {
    if (req.params && req.params.id) {
      const { name, email, join_date, end_date,salary } = req.body;

      // const saltHash = utils.genPassword(user_password);
      // const salt = saltHash.salt;
      // const hash = saltHash.hash;

      await EMP.findByIdAndUpdate(req.params.id, { name, email, join_date,end_date, salary});

      const newUser = await EMP.findById(req.params.id);
      console.log("newUsers", newUser)

      return res.status(200).json({
        code: 200,
        status: "Success",
        Success: true,
        UserDetails: newUser,
      });
    }
  } catch (err) {
    console.log("error",err.message);
    return res.status(500).json({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: err.message,
    });
  }
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  EMP.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User with this email does not exists" });
    }
    //const token = utils.issueJWT({_id: user._id},process.env.RESET_PASSWORD_KEY,);
    const token = jwt.sign({ _id: user.id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m' });

    console.log("token", token);
    const data = {
      from: "Mailgun Sandbox <postmaster@sandbox63347f33bc91456f99fc0644f3a7a175.mailgun.org>",
      to: "hasthiyait@gmail.com",
      subject: "Hello",
      text: "Testing some Mailgun awesomness!",
      html: `
        <h2>please click on given link to reset your password</h2>
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
    `
    };

    console.log("token >>> 2", token);
    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "reset password link error" })
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              error: err.message
            })
          }
          return res.json({ message: "Email has been sent, kindly follow the instruction" });
        });

      }

    })

  })
}

exports.resetPassword = (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
      if (error) {
        return res.status(401).json({
          error: "Incorrect token or it is expired"
        })
      }
      USER.findOne({ resetLink }, (error, user) => {
        if (error || !user) {
          return res.status(400).json({ error: "User with this token does not exists" });
        }
        const obj = {
          password: newPass
        }
        user = _.extend(user, obj);
        user.save((error, result) => {
          if (error) {
            return res.status(400).json({ error: "reset password error" })
          } else {
            return res.status(200).json({ message: "Your password has been changed" });
          }

        })

      })


    })
  } else {
    return res.status(401).json({ error: "Authentication error !!" });

  }

}