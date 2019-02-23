var express = require('express');
var router = express.Router();
var usermodels = require("../models/usermodels")
var path = require("path")
var randomstring = require("randomstring")
var mymail = require("../models/mymail")
var otpGenerator = require("otp-generator")
var io = require('socket.io')()


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
    usermodels.userregister("register", email, otp, function (result,data) {
      if (result) {
        res.send(JSON.stringify(data[0]) )
       
        msg = "Your Otp is :" + otp
        sub = "OTP for Secure Sanchar"
        mymail.sendmail(email, msg, sub, function (result) {
          if (result) {
            console.log(data)
          
           
          }
          else {
            res.send(false)
          }
        })
       
      }
      else{
        res.send(false)
      }
        
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

router.get('/home', function (req, res, next) {
  res.render('home');
});
*/

/* add detail after register*/
router.all("/add",function(req,res,next){
var data=req.body
var photo = req.files.dp
if (photo!= null) {
  dp = randomstring.generate() + "-" + photo.name
  var des = path.join(__dirname, "../public/uploads", dp)
  photo.mv(des, function (error) {
    if (error)
      console.log(error)
  })
}
else
dp=null

usermodels.add("register",data,dp,function(result){
if(result)
res.send({"result":result})
else
res.send({"result":result})

})
})



/*create workspace */

router.all("/createWorkspace", function (req, res, next) {
   var data = req.body
    var photo = req.files.dp
    if (photo!= null) {
      dp = randomstring.generate() + "-" + photo.name
      var des = path.join(__dirname, "../public/uploads", dp)
      photo.mv(des, function (error) {
        if (error)
          console.log(error)
      })
    }
    else
    {dp=null}

      usermodels.createWorkspace("workspace", data,dp, function (result,wid) {
          if (result) {
            res.send({"result":result,"wid":wid})
            users = data['user']
            for(var i = 0; i < users.length; i++) 
            {   if(user[i]!="")
               {
                url = "http://localhost:3000/sendEmail/" + user[i] +"/"+wid
                mymail.sendmail(user[i], url, function (result) {
                  if (!result) {
                    console.log(error)
                  }
                })
               }
            }  
            }
          else
          res.send({"result":result,"wid":""})
        })
      
    })



/* workspace approve*/

router.get('/sendEmail/:email/:wid', function (req, res, next) {
 email = req.params.email
  wid=req.params.wid
  usermodels.workspaceAccept(email,wid, function (result) {
    if (result) {
      res.send({"result":result})
    }
    else
    res.send({"result":result})
  })
});

/* search private chat*/
router.all("/search",function(req,res,next){
  var email=req.body.email
  usermodels.search("register",email,function(result)
  {if(result)
    res.send({"result":result})
    else
    res.send({"result":false})

  })
})

/* create private chat */
router.all("/createprivatechat", function (req, res, next) {
    var data = req.body
    usermodels.createprivatechat("priavtechat", data, function (result) {
          if (result) {
            res.send({"result":result})
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
      
    
  
})



module.exports = router;
