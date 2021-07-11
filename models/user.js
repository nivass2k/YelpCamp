const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportMongoose);
module.exports=mongoose.model('User',UserSchema);