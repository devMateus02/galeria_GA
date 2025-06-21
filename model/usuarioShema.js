import mongoose from "mongoose";
;


const usuarios = new mongoose.Schema(
    {
      id: mongoose.Schema.Types.ObjectId,
      nome:{
         type: String,
         required:true,
         unique:true
      },
      senha: {
         type: String,
         required:true
      },
      status: {
         type: String
      },
      data:{
         type: Date,
         default: new Date()
      }
    }
)

export default mongoose.model('usuarios', usuarios)