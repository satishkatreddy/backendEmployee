const mongoose = require('mongoose');



const connnectedDb = async (req, res) => {

   try {
      const DB_URL = process.env.MONGO_URL;
      const Db =  await mongoose.connect(DB_URL);
      console.log('Db is connected successfully');
      return Db;
   }
   catch (error) {
      throw new Error(error)
   }
}

 module.exports = connnectedDb;