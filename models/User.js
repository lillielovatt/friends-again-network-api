const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: "You need to provide a username",
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: "You need to provide an email",
            unique: true,
            // validate email
            match: [/.+@.+\..+/, "Must match an email address!"],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});

// create the model using the schema
const User = model("User", UserSchema);

// export model
module.exports = User;
