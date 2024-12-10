import userSchema from "../models/user.model.js";
import postSchema from "../models/post.model.js";
import commentSchema from "../models/comments.model.js";

function updateTimestamp(next) {
  this.set({ updatedAt: Date.now() });
  next();
}

// Aplicar en los esquemas
/*
userSchema.pre("findOneAndUpdate", updateTimestamp);
userSchema.pre("updateOne", updateTimestamp);

commentSchema.pre("findOneAndUpdate", updateTimestamp);
commentSchema.pre("updateOne", updateTimestamp);

postSchema.pre("findOneAndUpdate", updateTimestamp);
postSchema.pre("updateOne", updateTimestamp);
*/
