var express = require("express");
const { route } = require(".");
var router = express.Router();

const todos = [{
    id: 1,
    name: "Learn NodeJS",
    completed: false
}]

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json(todos)
});

router.get('/:id', (req, res) => {
    const todo = todos.find(todo => todo.id === Number(req.params.id))
    res.json(todo)
})

module.exports = router;
