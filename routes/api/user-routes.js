const User = require("../../models/User");

const router = require("express").Router();

//GET all users
router.get("", (req, res) => {
    User.find() //equivalent to sequelize's findAll
        .select("-__v")
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// GET single user by _id
router.get("/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-__v")
        .populate("thoughts")
        .populate("friends")
        .then((dbUserData) => {
            // if no user found, send 404
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user found with this id!",
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// POST new user
router.post("/", ({ body }, res) => {
    User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
});

// PUT update user by _id
router.put("/:id", ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true, //knows to validate any new info
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user found with this id!",
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
});

// DELETE remove user by _id
router.delete("/:id", ({ params }, res) => {
    User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user found with this id!",
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
});

// POST add new friend to user's friend list :userId/friends/:friendId
router.post("/:userId/friends/:friendId", ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
    )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user found with this id!",
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
});

// DELETE remove friend from user's friend list :userId/friends/:friendId
router.post(":userId/friends/:friendId", ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
    )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user found with this id!",
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
});

module.exports = router;
