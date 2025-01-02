const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  data: [
    {
      folderName:{
        type: String,
        required: true
      },
      files:[
        {
          fileName:{
            type: String,
            required: true
          },
          fileData:[
            {
              
            }
          ]
        }
      ]
    }
  ]
});