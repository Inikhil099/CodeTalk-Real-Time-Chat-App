const mongoose = require("mongoose")

const channelModelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        required:true

    }],
    admin:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        required:true,
    },
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:"messages",
        required:false
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },


})


channelModelSchema.pre("save",function(next){
    this.updatedAt = Date.now()
    next()
})

channelModelSchema.pre("findOneAndUpdate",function(next){
    this.set({updatedAt : Date.now()})
    next()
})

const CHANNEL = mongoose.model("channels",channelModelSchema)

module.exports = CHANNEL