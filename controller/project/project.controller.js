const Project = require("../../model/project.model");

exports.registerProject = async function (req, res) {

const { name, description, pm_id, create_date, end_date, developer_id } = req.body;
  console.log("data", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        Success: false,
        message: "All field must be entered.",
      });
    } else {

      const newProject = new Project({
        name,
        description,
        pm_id,
        create_date,
        end_date,
        developer_id,
     
      });

      await newProject.save();
      return res.status(200).json({
        code: 200,
        status: "Success",
        Success: true,
        projectDetails: newProject,
      });
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: error.message,
    });
  }
};


exports.getprojectbyId = async (req, res) => {

  id = req.params.id;
  console.log("id ", id);

  await Project.findById({ _id: id })
    .then(data => {
      res.status(200)
        .send({ message: "Success", data: data });
    }

    )
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

exports.getAllproject = async (req, res) => {

  // id = req.params.id;
  //  console.log("id ",id);

  await Project.find({})
    .then(data => {
      res.status(200)
        .send({ message: "Success", data: data });
    }

    )
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

exports.deleteprojectbyId = async (req, res) => {

  id = req.params.id;
  console.log("id ", id);

  await Project.findOneAndDelete({ _id: id })
    .then(data => {
      res.status(200)
        .send({ message: "Success", data: data });
    }

    )
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
}

exports.updateprojectbyId = async (req, res) => {
  try {
    if (req.params && req.params.id) {
      const {
        description, name, pm_id
      } = req.body;

      await Project.findByIdAndUpdate(req.params.id, {
        description, name, pm_id
      });

      const newLoan = await Project.findById(req.params.id);

      return res.status(200).json({
        code: 200,
        status: "Success",
        Success: true,
        LoanDetails: newLoan,
      });
    }
  } catch (err) {
    return res.status(500).json({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: err.message,
    });
  }
}