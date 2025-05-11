import dotenv from "dotenv";
import mongodbConnection from "./db/index.js"
import {app} from "./app.js";
 
dotenv.config()



const PORT = process.env.PORT || 8080;
mongodbConnection()
.then(() => {
  app.on("error", (err) => {
    console.log(`Server error ${err}`);
    throw err;
  });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})

.catch((err) => {
    console.log("DATABASE CONNECTION FAILED", err);
  });

  app.get("/", (req, res) => {
    
    res.send("Server is running");
  })