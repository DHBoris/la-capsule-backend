const nodemailer = {
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((options, callback) => {
            if (callback) callback(null, { messageId: 'mocked-message-id' });
            return Promise.resolve({ messageId: 'mocked-message-id' });
        }),
    }),
};

module.exports = nodemailer;
