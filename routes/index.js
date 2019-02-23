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

/* GET register page. */

router.all("/register", function (req, res, next) {
  
    var otp = otpGenerator.generate(6, { alphabets: false, specialChars: false, upperCase: false, digits: true });
    var email = req.body.email
    
   // var photo = req.files.dp
   // var dp = randomstring.generate() + "-" + photo.name
   // var des = path.join(__dirname, "../public/uploads", dp)
    usermodels.userregister("register", email, otp, function (result,data) {
      if (result) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(JSON.stringify(data) )
         res.render("register", { "result": JSON.stringify(data) })
        msg = "Your Otp is :" + otp
        sub = "OTP for Secure Sanchar"
        mymail.sendmail(email, msg, sub, function (result) {
          if (result) {
            console.log(data)
            
           
          }
          else {
            res.render("register", { "result": "mail not send HERE...." })
          }
        })
      }
      else
        res.render("register", { "result": JSON.stringify(data)})
    })

  }
)


/*authentication after register

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
*/


/* login
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
*/
router.get('/home', function (req, res, next) {
  res.render('home');
});


/*create workspace */

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
        usermodels.createWorkspace("workspace", data, function (result,wid) {
          if (result) {
            i = 1
            key = "u_" + i
            while (data[key]) {
              url = "http://localhost:3000/sendEmail/" + data[key] + "/" + key+"/"+wid
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

/* workspace approve*/

router.get('/sendEmail/:mid/:uid/:wid', function (req, res, next) {
  mid = req.params.mid
  u_id = req.params.uid
  w_id=req.params.wid
  console.log(w_id);
  usermodels.workspaceAccept(mid, u_id,w_id, function (result) {
    if (result) {
      res.render("login")
    }
    else
      res.redirect("/register")
  })
});

/* create private chat */
router.all("/createprivatechat", function (req, res, next) {
  if (req.method == "GET") {
    res.render("createprivatechat", { "result": "" })
  }
  else {
    var u2 = req.body.user2
    usermodels.createprivatechat("priavtechat", u2, function (result) {
          if (result) {
            url = "http://localhost:3000/cnfrmmail/" + u2
              mymail.sendmail(u2, url, function (result) {
                if (!result) {
                  console.log(error)
                  res.render("createprivatechat", { "result": u2 + " mail not sent" })
                }
              })
            
            res.render("home", { "result": "start chat..." })
          }
          else
            res.render("home", { "result": "not posssible" })
        })
      
    
  }
})



module.exports = router;
