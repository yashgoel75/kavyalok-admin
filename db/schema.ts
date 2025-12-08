import mongoose, { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema({
    label: { type: String, required: true },
    type: { 
        type: String, 
        enum: ["text", "number", "select", "radio", "checkbox"], 
        required: true 
    },
    required: { type: Boolean, default: false },
    options: [String],
});

const ParticipationOption = new Schema({
    label: { type: String, required: true },
    price: { type: Number, required: true },
});

const AdminSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    bio: String,
    profilePicture: String,
}, { timestamps: true });

const CompetitionSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true }, 

    coverPhoto: String,
    name: { type: String, required: true },
    about: { type: String, required: true },

    participantLimit: Number,
    registrationDeadline: Date,

    mode: String,
    venue: String,

    dateStart: Date,
    dateEnd: Date,

    timeStart: String,
    timeEnd: String,

    participationOptions: [ParticipationOption],
    customQuestions: [QuestionSchema],

    judgingCriteria: [String],
    prizePool: [String],
    
}, { timestamps: true });

const RegistrationSchema = new Schema({
    competition: { type: Schema.Types.ObjectId, ref: "Competition", required: true, index: true },
    
    participantName: String,
    participantEmail: { type: String, required: true },
    
    chosenParticipationOption: { 
        label: String, 
        price: Number 
    },

    responses: [{
        questionId: { type: Schema.Types.ObjectId, required: true }, 
        questionLabel: String,
        answer: Schema.Types.Mixed 
    }],

    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    status: { type: String, enum: ["registered", "attended", "cancelled"], default: "registered" }

}, { timestamps: true });

RegistrationSchema.index({ competition: 1, participantEmail: 1 }, { unique: true });

const PostSchema = new Schema({
    title: { type: String, required: true, index: true },
    content: { type: String, required: true },
    picture: String,
    tags: [{ type: String, index: true }],
    likes: { type: Number, default: 0 },
    color: { type: String },
}, { timestamps: true });

export const Admin = models.Admin || model("Admin", AdminSchema);
export const Competition = models.Competition || model("Competition", CompetitionSchema);
export const Registration = models.Registration || model("Registration", RegistrationSchema);
export const Post = models.Post || model("Post", PostSchema);
