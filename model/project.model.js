 const Mongoose = require("mongoose");



const ProjectSchema = Mongoose.Schema(
  {
    description: {
        type: String,
        required: true,
      },
    pm_id: {
        type: String,
        required: true,
      },
    name: {
      type: String,
      required: true,
    },
    create_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    developer_id: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = Mongoose.model("Project", ProjectSchema);