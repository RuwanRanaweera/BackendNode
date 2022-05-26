const Mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const EmployeeSchema = Mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    join_date:{
        type: Date,
        required: true,
    },
    end_date:{
        type: Date,
        required: true,
    },
    user_type: {
      type: String,
      required: true,
    },
    salary: {
        type: String,
        required: true,
      },
      interviewer: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    hash: {
      type: String,
    },
    salt: {
      type: String,
    },
    resetLink:{
      data:String,
      default:''
    }
  },
  {
    timestamps: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = Mongoose.model("Employee", EmployeeSchema);
