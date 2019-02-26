var db = require('./conn')


/*user register table*/

function userregister(tbl_nm, email, otp, cb) {
    db.collection(tbl_nm).find().sort({ 'id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, result2) {
                if (result2.length > 0) {
                    db.collection(tbl_nm).updateOne({ "email": email }, { $set: { "otp": otp } }, function (err, result) {
                        if (err)
                            console.log(err)
                        else {
                            db.collection(tbl_nm).find({ "email": email }, { "publicKey": 0, "_id": 0 }).toArray(function (err, res2) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    //  console.log(res2)
                                    cb(result, res2)
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
                            db.collection(tbl_nm).find({ "email": email }, { "publicKey": 0, "_id": 0 }).toArray(function (err, result3) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    cb(result, result3)
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
/*create profile details*/

function addDetail(tbl_nm, data, cb) {
    if (data.org_name == null) {
        data.org_name = ""
    }
    if (data.org_designation == null) {
        data.org_designation = ""
    }
    console.log(data)
    var id = parseInt(data.id)
    console.log(id)
    db.collection(tbl_nm).updateOne({ "id": id }, { $set: { "name": data.name, "org_name": data.org_name, "org_designation": data.org_designation } }, function (err, result) {
        if (err)
            console.log(err)
        else {
            db.collection("workspace").find({ "users.uid": data.id ,"users.status":1}, { "_id": 0, "w_id": 1,"w_name":1 }).toArray(function (err, result1) {
                if (err) {
                    console.log(err)
                }
                else {
                    db.collection("privatechat").find({$or:[{ "between.u1": data.id },{"between.u2":data.id}]}, { "_id": 0, "publicKey": 1 }).toArray(function (err, result) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                
                            cb(result)
                        }
                    })
                    
                }
            })

            cb(result)
        }
    })
}


/*add public key*/

function addKey(tbl_nm, data, cb) {
    db.collection(tbl_nm).updateOne({ "email": data.email }, { $set: { "publicKey": data.publicKey } }, function (err, result) {
        if (err)
            console.log(err)
        else
            cb(result)

    })
}


/* get public key */
function getKey(tbl_nm, data, cb) {
    db.collection(tbl_nm).find({ "email": data.email }, { "_id": 0, "publicKey": 1 }).toArray(function (err, result) {
        if (err) {
            console.log(err)
        }
        else {

            cb(result)
        }
    })
}


/* create wprkspace*/


function createWorkspace(tbl_nm, data, dp, cb) {
    if (data.description == null)
        data.description = ""
    db.collection(tbl_nm).find().sort({ 'w_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            /* admin id needed to change*/
            data1 = { "w_id": result1[0].w_id + 1, "w_name": data.w_name, "w_info": { "creation_date": data.creation_date, "description": data.description, "dp": dp }, "admin_id": data.id }
            var wid = data1.w_id
            data1.users = []
            let users = data['user']
            for (var i = 0; i < users.length; i++) {
                if (user[i] != "") {
                    db.collection(register).find({ "email": user[i] }).toArray(function (err, result3) {
                        if (err)
                            console.log(err)
                        else
                            data1["users"].push({ "uid": result3.id, "status": 0 })
                    })

                }
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
                else {
                    cb(result, wid)
                }
            })
        }
    })
}
/* workspace accept*/

function workspaceAccept(email, wid, cb) {
    db.collection(register).find({ "email": email }).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            db.collection('workspace').updateOne({ "w_id": wid, "users.uid": result1.id }, { $set: { "users.$.status": 1 } }, function (err, result) {
                if (err)
                    console.log(err)
                else {
                    cb(result)
                }
            })
        }
    })
}
/* db.collection("workspace").find({'w_id':parseInt(wid)},{projection:{"user":1}}).toArray(function (err, result2){
     if(err)
     console.log(err)
     else{
         var dat=JSON.stringify(result2)
         console.log(dat)
     }
 })
 */



/*search private chat*/
function search(tbl_nm, email, cb) {
    db.collection(tbl_nm).find({ "email": { $regex: email } }, { "_id": 0, "email": 1, "id": 1 }).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            cb(result1)

        }
    })
}


/*CREATE PRIVATE CHAT*/
function createprivatechat(tbl_nm, data, cb) {
    db.collection(tbl_nm).find().sort({ 'p_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            data1 = { "p_id": result1[0].p_id + 1, "between": { "u1": data.u1, "u2": data.u2 }, "status": 0 }
            db.collection(tbl_nm).insertOne(data1, function (err, result) {
                if (err)
                    console.log(err)
                else {
                    db.collection("register").find({ "id": data.u1 }).toArray(function (err, result2) {
                        if (err) { }
                        else {
                            db.collection("register").find({ "id": data.u2 }).toArray(function (err, result3) {
                                if (err) { }
                                else {
                                    cb(result, result2.email, result3.email)
                                }
                            }
                            )
                        }
                    })


                }
            })
        }
    })
}


/* private chat accept*/

function privateAccept(tbl_nm, data, cb) {
    db.collection(tbl_nm).find({ "p_id": data.p_id }).sort({ 'p_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            data1 = { "p_id": result1[0].p_id + 1, "between": { "u1": data.u1, "u2": data.u2 }, "status": 0 }
            db.collection(tbl_nm).insertOne(data1, function (err, result) {
                if (err)
                    console.log(err)
                else {
                    db.collection("register").find({ "id": data.u1 }).toArray(function (err, result2) {
                        if (err) { }
                        else {
                            db.collection("register").find({ "id": data.u2 }).toArray(function (err, result3) {
                                if (err) { }
                                else {
                                    cb(result, result2.email, result3.email)
                                }
                            }
                            )
                        }
                    })


                }
            })
        }
    })
    db.collection('privatechat').updateOne({ $and: [{ "between.u1": u1, "between.u2": u2 }] }, { $set: { 'status': 1 } }, function (err, result) {
        if (err)
            console.log(err)
        else {
            cb(result)
        }
    })
}

/* insert messages in private chat*/
function insertMessage(tbl_nm, data, cb) {
    db.collection(tbl_nm).find({ "p_id": data.p_id }).sort({ "id": -1 }).limit(1).toArray(function (err, result) {
        if (err) {
            console.log(err)
        }
        else {
            if (result == null) {
                data["message"][0] = [{"msg_id":1}]
            }
            else {
                data["message"][data["message"].length] = {"msg_id":result.id + 1}
            }
            db.collection(tbl_nm).updateOne({ "p_id": data.p_id }, { $set: {"message.$.msg_id":""} }, function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    cb(result)
                }
            })
        }
    })
}



module.exports = { insertMessage: insertMessage, getKey: getKey, addKey: addKey, privateAccept: privateAccept, search: search, addDetail: addDetail, createprivatechat: createprivatechat, workspaceAccept: workspaceAccept, createWorkspace: createWorkspace, userregister: userregister }