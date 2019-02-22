var nodemailer = require('nodemailer');
function sendmail(email, msg, sub, cb) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pratikshagupta789@gmail.com',
            pass: 'spanishtoll'
        }
    });
    
    var mailOptions = {
        from: 'pratikshagupta789@gmail.com',
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