const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Products',
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                additions: String,
                price: Number,
                vendor:String,
                address:Object,
            },
        ],
        totalPrice: Number,
        totalAfterDiscount: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);