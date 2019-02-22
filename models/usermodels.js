var db = require('./conn')

function userlogin(tbl_nm, data, cb) {
    //var query = "select * from " + tbl_nm + " where unm='" + data.unm + "' and pass='" + data.pass + "' and status=1;"
    db.collection(tbl_nm).find({ 'email': data.email, 'password': data.password, 'status': 1 }).toArray(function (err, result) {
        if (err)
            console.log(err)
        else
            cb(result)
    })
}

function userregister(tbl_nm, email, otp, cb) {
    //var query = "insert into " + tbl_nm + " values(NULL,'" + data.nm + "','" + data.unm + "','" + data.pass + "','" + data.address + "','" + data.mob + "','" + data.city + "','" + data.gender + "','user',0);"
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

function createWorkspace(tbl_nm, data, cb) {
    //var query = "select * from " + tbl_nm + " where unm='" + data.unm + "' and pass='" + data.pass + "' and status=1;"
    db.collection(tbl_nm).find().sort({ 'w_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
            data1 = { "w_id": result1[0].w_id + 1, "w_name": data.w_name, "w_info": { "creation_date": data.creation_date, "description": data.description, "icon": data.icon }, "admin_id": 0 }
            i = 1
            key = "u_" + i
            data1["users"] = {}
            data2 = data1["users"]
            while (data[key]) {
                data2[key] = {}
                data2[key] = { "m_id": data[key], "status": 0 }
                i = i + 1
                key = "u_" + i
            }
            db.collection(tbl_nm).insertOne(data1, function (err, result) {
                if (err)
                    console.log(err)
                else
                    cb(result)
            })
        }
    })
}

function workspaceAccept(mid, uid, cb) {
    //var query = "update register set status=1 where unm='" + emailid + "';"
    u_id = uid
    db.collection('workspace').update({ 'users': { u_id: { 'm_id': mid } } }, { $set: { 'status': 1 } }, function (err, result) {
        if (err)
            console.log(err)
        else {
            cb(result)
        }
    })
}
module.exports = { "workspaceAccept": workspaceAccept, "createWorkspace": createWorkspace, "userregister": userregister, "loginauthentication": loginauthentication, "userlogin": userlogin }