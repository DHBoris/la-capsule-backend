const messageModel = require('../models/message');

module.exports = {
    create: async (req, res) => {
        try {
            const { firstName, lastName, email, callNumber, message, politique } = req.body;

            const newMessage = new messageModel({
                firstname: firstName,
                lastname: lastName,
                email: email,
                callNumber: callNumber,
                message: message,
                politique: politique,
            });
            console.log(newMessage);
            const messageSaved = await newMessage.save();

            if (messageSaved) {
                return res.json({
                    result: true,
                });
            } else {
                console.log("Message n'est pas enregistrer");
                return res.json({
                    result: false,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
