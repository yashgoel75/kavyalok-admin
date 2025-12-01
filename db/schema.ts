import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    bio: String,
    profilePicture: String,

}, { timestamps: true })

const CompetitionSchema = new Schema({
    coverPhoto: { type: String },
    name: { type: String, required: true },
    about: { type: String, required: true },
    participantLimit: { type: Number },
    mode: { type: String },
    venue: { type: String },
    dateStart: { type: String },
    dateEnd: { type: String },
    timeStart: { type: String },
    timeEnd: { type: String },
    category: { type: String },
    fee: { type: Number },
    judgingCriteria: [String],
    prizePool: [String],
    participants: [String],
});

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
}, { timestamps: true });

CommentSchema.index({ post: 1, createdAt: -1 });

const PostSchema = new Schema({
    title: { type: String, required: true, index: true },
    content: { type: String, required: true },
    picture: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tags: [{ type: String, index: true }],
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    color: { type: String, required: false },
}, { timestamps: true });

PostSchema.index({ title: "text", content: "text", tags: "text" });

const NotificationSchema = new Schema({
    type: { type: String, required: true, index: true },
    fromEmail: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", index: true },
    read: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ read: 1, createdAt: -1 });

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    posts: [String],
    bio: String,
    profilePicture: String,
    bookmarks: [String],
    instagram: String,
    snapchat: String,
    followers: [String],
    following: [String],
    isVerified: Boolean,
    likes: [String],
    defaultPostColor: String,
    notifications: [NotificationSchema],
}, { timestamps: true });

UserSchema.index({ username: 1, email: 1 });

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export const Competition = mongoose.models.Competition || mongoose.model("Competition", CompetitionSchema)
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
