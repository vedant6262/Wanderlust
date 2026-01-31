const express = require("express");
const router = express.Router();

const wrapasync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedin,isOwner,validatelisting } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});


router
.route("/")
.get( wrapasync(listingcontroller.index))
.post(
  isLoggedin,
upload.single("listing[image]"),
  validatelisting,
  wrapasync(listingcontroller.createlisting)
);



// NEW
router.get("/new", isLoggedin, listingcontroller.rendernewform);

router
  .route("/:id")
  .get(wrapasync(listingcontroller.showlisting))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapasync(listingcontroller.updatelisting)
  )
.delete(
  isLoggedin,
  isOwner,
  wrapasync(listingcontroller.destroyListing)
);

// EDIT - form
router.get(
  "/:id/edit",
  isLoggedin,
  wrapasync(listingcontroller.rendereditform)
);

module.exports = router;