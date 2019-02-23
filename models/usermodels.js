var db = require('./conn')


/*user register table*/

function userregister(tbl_nm, email, otp, cb) {
    db.collection(tbl_nm).find().sort({ 'id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, result2) {
                if (result2.length > 0) {
                    db.collection(tbl_nm).update({ "email": email }, { $set: { "otp": otp } }, function (err, result) {
                        if (err)
                            console.log(err)
                        else {
                            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, res) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log(res)
                                    cb(result, res)
                                }
                            })
                        }
                    })
                    cb(false)
                }
                else {
                    data = {}
                    data['id'] = result1[0].id + 1
                    data['email'] = email
                    data['otp'] = otp
                    db.collection(tbl_nm).insertOne(data, function (err, result) {
                        if (err)
                            console.log(err)
                        else {
                            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, res) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    cb(result, res)
                                }
                            })
                        }

                    })
                }

            })
        }
    })
}

/* user authentication after register

function loginauthentication(verification_key, cb) {
    //var query = "update register set status=1 where unm='" + emailid + "';"
    db.collection('register').update({ 'verification_key': verification_key }, { $set: { 'status': 1 } }, function (err, result) {
        if (err)
            console.log(err)
        else {
            cb(result)
        }
    })
}
*/

/* user login 
function userlogin(tbl_nm, data, cb) {
    //var query = "select * from " + tbl_nm + " where unm='" + data.unm + "' and pass='" + data.pass + "' and status=1;"
    db.collection(tbl_nm).find({ 'email': data.email, 'password': data.password, 'status': 1 }).toArray(function (err, result) {
        if (err)
            console.log(err)
        else
            cb(result)
    })
}
*/

/* create wprkspace*/


function createWorkspace(tbl_nm, data, cb) {
    db.collection(tbl_nm).find().sort({ 'w_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
/* admin id needed to change*/
            data1 = { "w_id": result1[0].w_id + 1, "w_name": data.w_name, "w_info": { "creation_date": data.creation_date, "description": data.description, "icon": data.icon }, "admin_id": 0 }
            var wid=data1.w_id
            data1.users=[]
            let users = data['user']
            for(var i = 0; i < users.length; i++) 
            {   if(user[i]!="")
                data1["users"].push({"email":users[i],"status":0})
                
            }  
           
            /*
            var wid=data1.w_id
            i = 1
            key = "u_" + i
            data1["users"] = {}
            data2 = data1["users"]
            while (data[key]) {
                data2[key] = {}
                data2[key] = { "m_id": data[key], "status": 0 }
                i = i + 1
                key = "u_" + i
            }*/
            db.collection(tbl_nm).insertOne(data1, function (err, result) {
                if (err)
                    console.log(err)
                else
                {   
                    cb(result,wid)
             } })
        }
    })
}

/* workspace accept*/

function workspaceAccept(mid, uid,wid, cb) {
         db.collection('workspace').update({ 'users': {u_id: { 'm_id': mid } } }, { $set: { 'status': 1 } }, function (err, result) {
        if (err)
            console.log(err)
        else {
            cb(result)
        }
    })
    db.collection("workspace").find({'w_id':parseInt(wid)},{projection:{"user":1}}).toArray(function (err, result2){
        if(err)
        console.log(err)
        else{
            var dat=JSON.stringify(result2)
            console.log(dat)
        }
    })
    
}



function createprivatechat(tbl_nm, u2, cb) {
    db.collection(tbl_nm).find().sort({ 'p_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
/* admin id needed to change*/
            data1 = { "p_id": result1[0].p_id + 1,  "between": { "u_1": "pratikshagupta789@gmail.com", "u2":u2}, "status": 0 }
            db.collection(tbl_nm).insertOne(data1, function (err, result) {
                if (err)
                    console.log(err)
                else
                {   
                    cb(result)
             } })
        }
    })
}

module.exports = { "createprivatechat":createprivatechat,"workspaceAccept": workspaceAccept, "createWorkspace": createWorkspace, "userregister": userregister }