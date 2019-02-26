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



var us1 = null;
var us2 = null;


/* GET register page. */

router.all("/register", function (req, res, next) {

  var otp = otpGenerator.generate(6, { alphabets: false, specialChars: false, upperCase: false, digits: true });
  var email = req.body.email

  // var photo = req.files.dp
  // var dp = randomstring.generate() + "-" + photo.name
  // var des = path.join(__dirname, "../public/uploads", dp)
  usermodels.userregister("register", email, otp, function (result, data) {
    if (result) {
      res.send(JSON.stringify(data[0]))
      res.end()
      msg = "Your Otp is :" + otp
      sub = "OTP for Secure Sanchar"
      from = 'securesanchar.hexane@gmail.com'
      mymail.sendmail(from, email, sub, msg, function (result) {
        if (result) {
          console.log(data)
        }
        else {

        }
      })
    }
    else {

    }
  })
})


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

router.get('/home', function (req, res, next) {
  res.render('home');
});
*/

/* add detail after register*/
router.all("/add", function (req, res, next) {
  var data = req.body
  /*var photo = req.files.dp
  if (photo != null) {
    dp = randomstring.generate() + "-" + photo.name
    var des = path.join(__dirname, "../public/uploads", dp)}
    else {
      dp = ""
    }
    photo.mv(des, function (error) {
      if (error)
        console.log(error)
        else{
          
        }
    })
  */
  result1 = true

  usermodels.addDetail("register", data, function (result) {

    if (result) {
      res.send({ "result": true })
    }
    else {
      res.send({ "result": false })
    }
  })
})

/*create workspace */

router.all("/createWorkspace", function (req, res, next) {
  var data = req.body
  var photo = req.files.dp
  if (photo != null) {
    dp = randomstring.generate() + "-" + photo.name
    var des = path.join(__dirname, "../public/uploads", dp)
    photo.mv(des, function (error) {
      if (error)
        console.log(error)
    })
  }
  else { dp = null }

  usermodels.createWorkspace("workspace", data, dp, function (result, wid) {
    if (result) {
      res.send({ "result": result, "wid": wid })
      users = data['user']
      sub = "cnfrmation mail"
      from = 'securesanchar.hexane@gmail.com'
      for (var i = 0; i < users.length; i++) {
        if (user[i] != "") {
          url = "http://localhost:3000/sendEmail/" + user[i] + "/" + wid
          mymail.sendmail(from, user[i], sub, url, function (result) {
            if (!result) {
              console.log(error)
            }
          })
        }
      }
    }
    else { }
  })

})



/* workspace approve*/

router.get('/sendEmail/:email/:wid', function (req, res, next) {
  email = req.params.email
  wid = req.params.wid
  result = ""
  usermodels.workspaceAccept(email, wid, function (result) {
    if (result) {
      result = result
    }
    else
      result = result
  })
  res.send({ "result": result })
});

/* search private chat*/
router.all("/search", function (req, res, next) {
  var email = req.body.email
  result = ""
  usermodels.search("register", email, function (result) {
    if (result)
      result = result
    else
      result = result

  })
  res.send({ "result": result })
})

/* create private chat */
router.all("/createprivatechat", function (req, res, next) {
  var data = req.body
  usermodels.createprivatechat("priavtechat", data, function (result, from, to) {
    if (result) {
      res.send({ "result": result })
      sub = "cnfrmation for private chat"
      url = "http://localhost:3000/confirmemail/" + data.u1 + "/" + data.u2
      mymail.sendmail(from, to, sub, url, function (result) {
        if (!result) {
          console.log(error)
        }
      })
    }
    else { }
  })
})


/* private chat approve*/

router.get('/confirmemail/:u1/:u2', function (req, res, next) {
  u1 = req.params.u1
  u2 = req.params.u2
  result = ""
  usermodels.privateAccept(u1, u2, function (result) {
    if (result) {
      result = result
    }
    else
      result = result
  })
  res.send({ "result": result })
});



module.exports = router;
