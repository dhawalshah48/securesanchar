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
                            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, res2) {
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
                            db.collection(tbl_nm).find({ "email": email }).toArray(function (err, result3) {
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

function add(tbl_nm, data,dp, cb) {
    if(data.org_name==null)
     {data.org_name=""}
    if(data.org_designation==null)
    {data.org_designation=""}
    
    db.collection(tbl_nm).update({"id":parseInt(data.id)},{$set: { "name":data.name,"org_name":data.org_name,"org_designation":data.org_designation,"dp":dp }},function(err,result){
        if(err)
        console.log(err)
        else
        cb(result)

    })}


/* create wprkspace*/


function createWorkspace(tbl_nm, data,dp, cb) {
    if(data.description==null)
    data.description=""
    db.collection(tbl_nm).find().sort({ 'w_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
/* admin id needed to change*/
            data1 = { "w_id": result1[0].w_id + 1, "w_name": data.w_name, "w_info": { "creation_date": data.creation_date, "description": data.description, "dp": dp }, "admin_id": data.id }
            var wid=data1.w_id
            data1.users=[]
            let users = data['user']
            for(var i = 0; i < users.length; i++) 
            {   if(user[i]!="")
                {db.collection(register).find({ "email": user[i] }).toArray(function (err, result3){
                    if(err)
                    console.log(err)
                    else
                    data1["users"].push({"uid":result3.id,"status":0})
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
                else
                {   
                    cb(result,wid)
             } })
        }
    })
}

/* workspace accept*/

function workspaceAccept(email,wid, cb) {
    db.collection(register).find({ "email": email }).toArray(function (err, result1){
        if(err)
        console.log(err)
        else
        {
            db.collection('workspace').update({ "w_id":wid,"users.uid":result1.id }, { $set: { 'users.status': 1 } }, function (err, result) {
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
function search(tbl_nm,email, cb) {
    db.collection(tbl_nm).find({ "email":{$regex: email } },{"_id":0,"email":1,"id":1}).toArray(function (err, result1){
        if(err)
        console.log(err)
        else
        {
           cb(result1)
        
        }
    })}
    


function createprivatechat(tbl_nm, data, cb) {
    db.collection(tbl_nm).find().sort({ 'p_id': -1 }).limit(1).toArray(function (err, result1) {
        if (err)
            console.log(err)
        else {
/* admin id needed to change*/
            data1 = { "p_id": result1[0].p_id + 1,  "between": { "u_1": data.u1, "u2":data.u2}, "status": 0 }
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

module.exports = {search:search, add:add,createprivatechat:createprivatechat,workspaceAccept: workspaceAccept, createWorkspace: createWorkspace, userregister: userregister }