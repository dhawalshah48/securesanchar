var nodemailer = require('nodemailer');
function sendmail(from,email, sub, msg, cb) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'securesanchar.hexane@gmail.com',
            pass: 'Securesanchar@6'
        }
    });
    
    var mailOptions = {
        from: from,
        to: email,
        subject: sub,
        html: msg
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            cb(false)
        } else {
            cb(true)
        }
    });
}
module.exports = {sendmail:sendmail}