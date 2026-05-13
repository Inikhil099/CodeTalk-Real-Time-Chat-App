const { SearchContacts, GetContactsForDmList, GetAllContacts } = require("../controllers/contactController")
const { verifyToken } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/search",verifyToken,SearchContacts)
router.get("/get-contacts-for-dm",verifyToken,GetContactsForDmList)
router.get("/get-all-contacts",verifyToken,GetAllContacts)






module.exports = router;





