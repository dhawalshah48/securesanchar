var express = require('express');
var router = express.Router();
var usermodels = require("../models/usermodels")
var path = require("path")
var randomstring = require("randomstring")
var mymail = require("../models/mymail")
var otpGenerator = require("otp-generator")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});


router.all("/register/:email", function (req, res, next) {
  if (req.method == "GET") {
    var otp = otpGenerator.generate(6, { alphabets: false, specialChars: false, upperCase: false, digits: true });
    console.log(otp)
    email = req.params.email
    usermodels.userregister("register", email, otp, function (result) {
      if (result) {
        msg = "Your Otp is :" + otp
        sub = "OTP for Secure Sanchar"
        mymail.sendmail(email, msg, sub, function (result, data) {
          if (result) {
            res.render("verification", { "result": data })
          }
          else {
            console.log(error)
            res.render("verification", { "result": "user registeration failed HERE...." })
          }
        })
      }
      else
        res.render("register", { "result": "user registeration failed...." })
    })
  }
  else {
    var data = req.body
    var photo = req.files.dp
    var dp = randomstring.generate() + "-" + photo.name
    var des = path.join(__dirname, "../public/uploads", dp)
    photo.mv(des, function (error) {
      if (error) {
        console.log(error)
      }
      else {
        usermodels.userregister("register", data, verification_key, dp, function (result) {
          if (result) {
            url = "http://localhost:3000/userauthentication/" + verification_key
            mymail.sendmail(data.email, url, function (result) {
              if (result) {
                res.render("register", { "result": data })
              }
              else {
                console.log(error)
                res.render("register", { "result": "user registeration failed HERE...." })
              }
            })
          }
          else
            res.render("register", { "result": "user registeration failed...." })
        })
      }
    })
  }
})



router.get('/userauthentication/:verificationkey', function (req, res, next) {
  console.log(req.params.verificationkey)
  verification_key = req.params.verificationkey
  usermodels.loginauthentication(verification_key, function (result) {
    if (result) {
      res.render("login")
    }
    else
      res.redirect("/register")
  })
});




router.all('/login', function (req, res, next) {

  if (req.method == 'GET')
    res.render('login', { 'result': '' })
  else {
    var data = req.body
    usermodels.userlogin('register', data, function (result) {
      if (result.length == 0) {
        res.render('login', { 'result': 'Login Failed' })
      }
      else {
        res.render('home')
      }

    })
  }
});




router.all("/createWorkspace", function (req, res, next) {
  if (req.method == "GET") {
    res.render("createWorkspace", { "result": "" })
  }
  else {
    var data = req.body
    var photo = req.files.icon
    var icon = randomstring.generate() + "-" + photo.name
    var des = path.join(__dirname, "../public/uploads", icon)
    data["icon"] = icon
    photo.mv(des, function (error) {
      if (error) {
        console.log(error)
      }
      else {
        usermodels.createWorkspace("workspace", data, function (result) {
          if (result) {
            i = 1
            key = "u_" + i
            while (data[key]) {
              url = "http://localhost:3000/sendEmail/" + data[key] + "/" + key
              mymail.sendmail(data[key], url, function (result) {
                if (!result) {
                  console.log(error)
                  res.render("createWorkspace", { "result": data[key] + " mail not sent" })
                }
              })
              i++
              key = "u_" + i
            }
            res.render("home", { "result": "workspace is created...." })
          }
          else
            res.render("createWorkspace", { "result": "workspace not created" })
        })
      }
    })
  }
})

router.get('/sendEmail/:mid/:uid', function (req, res, next) {
  mid = req.params.mid
  u_id = req.params.uid
  usermodels.workspaceAccept(mid, u_id, function (result) {
    if (result) {
      res.render("login")
    }
    else
      res.redirect("/register")
  })
});



module.exports = router;
