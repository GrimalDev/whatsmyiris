import express from "express";
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const options = {
    'date': await getDate()
  }

  res.render('index', options);
});

//get current date
async function getDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today.toLocaleDateString("fr-EU", options);
}

export default router;