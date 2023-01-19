const { connect, set } = require("mongoose");
// Connect to Database
exports.dbConnection = () => {
  set("strictQuery", false);
  connect(process.env.MONGO_URL).then((connect) => {
    console.log(`Success Connect to Database: ${connect.connection.host}`);
  });
};
