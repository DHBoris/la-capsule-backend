const OrderHistory = require('../models/orderHistory');

module.exports = {
    saveOrder: async (req, res) => {
        const { items, total, stripeRef } = req.body;
        const userEmail = res.locals.userInfo;
        try {
            const order = new OrderHistory({ userEmail, items, total, stripeRef });
            await order.save();
            return res.json({ result: true });
        } catch (error) {
            return res.status(500).json({ result: false, error: error.message });
        }
    },

    getOrders: async (req, res) => {
        const userEmail = res.locals.userInfo;
        try {
            const orders = await OrderHistory.find({ userEmail }).sort({ date: -1 });
            return res.json({ result: true, orders });
        } catch (error) {
            return res.status(500).json({ result: false, error: error.message });
        }
    },
};
