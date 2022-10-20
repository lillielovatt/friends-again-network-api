const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

// GET all thoughts
router.get("/", (req, res) => {
    Thought.find() //equivalent to sequelize's findAll
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// GET a single thought by id
router.get("/:id", (req, res) => {
    Thought.findOne({ _id: req.params.id })
        .then((dbThoughtData) => {
            // if no thought found, send 404
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found with this id!",
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// POST create a new thought
// don't forget to push the created thought's _id to the associated Thought's thoughts array field
router.post("/", ({ body }, res) => {
    Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
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

// PUT update thought by id
router.post("/:id", ({ params, body }, res) => {
    Thought.findOneAndUpdate(
        { _id: params.id },
        { $set: body },
        { runValidators: true, new: true }
    )
        .then((dbThoughtData) => {
            // if no thought found, send 404 (and help)
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found with this id!",
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// DELETE remove thought by id
router.delete("/:id", ({ params }, res) => {
    Thought.findOneAndRemove({ _id: params.id })
        .then((dbThoughtData) => {
            // if no thought found, send 404 (and help)
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found with this id!",
                });
                return;
            }

            // res.json(dbThoughtData); still need to update the User to remove the thought

            // pulls thought from thoughts array
            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
        })
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

// POST create reaction /:thoughtId,
router.post("/:thoughtId/reactions", ({ params, body }, res) => {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { runValidators: true, new: true }
    )
        .then((dbThoughtData) => {
            // if no thought found, send 404 (and help)
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found with this id!",
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// DELETE pull/remove reaction by reactionId value /:thoughtId, /api/thoughts/:thoughtId/reactions, same idea as with user and friends
router.delete("/:thoughtId/reactions/:reactionId", ({ params }, res) => {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { runValidators: true, new: true }
    )
        .then((dbThoughtData) => {
            // if no thought found, send 404 (and help)
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought found with this id!",
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;
