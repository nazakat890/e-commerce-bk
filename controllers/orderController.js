const OrderModel = require("../models/Orders");
const OrderItem = require("../models/OrderItems");



const createOrder = async (req, res) => {

    const orderItemsIds =  Promise.all(req.body.orderItems.map( async orderItem => {
         let newOrderItem = new OrderItem({
           quantity: orderItem.quantity,
           product: orderItem.product
         })
         newOrderItem = await newOrderItem.save();
         return newOrderItem._id;
    } ));
        let orderItemsIdsResolved = await orderItemsIds;

        // calculate total price againts each order

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
          let orderItem = await OrderItem.findById(orderItemId).populate('product')
           const totalPrice =  (orderItem.product.price * orderItem.quantity);
           return totalPrice
        }))
       
        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  try {
    const order = new OrderModel({ 
    orderItems :orderItemsIdsResolved,
    shippingAddress1 :req.body.shippingAddress1,
    shippingAddress2 :req.body.shippingAddress2,
    city :req.body.city,
    state :req.body.state,
    zip : req.body.zip,
    phone : req.body.phone,
    country : req.body.country,
    orderDate : req.body.orderDate,
    order_status : req.body.order_status,
    order_totalPrice : totalPrice,
    users : req.body.users
    });
    await order.save();
    res.status(201).json({order:order, message: "Order created successfully" });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};



const getOrder = async (req, res) => {

  try {
    const order = await OrderModel.findById(req.params.id)
    .populate('users', 'username')
    .populate({
       path: 'orderItems', populate:{
       path: 'product', populate:'category'
     }
    })

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate('users','username').sort({'orderDate': -1});
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const updateOrder = async (req, res) => {
  try {
       const order = await OrderModel.findByIdAndUpdate(
           req.params.id,
        {
          order_status : req.body.order_status,
        },
       { new: true }
      ) 
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteOrder = async (req, res) => {
  try {
      let order = await OrderModel.findByIdAndDelete(req.params.id)
      if(order) {
          order.orderItems.map( async orderItem => {
           await OrderItem.findByIdAndDelete(orderItem._id)
       })
       return  res.status(200).json({ message: "Order deleted successfully" });
   }
   else {
    return res.status(404).json({ error: "Order not found" });
   }
}
catch (error) {}
}



const gettotalSales = async (req, res) => {
  try {
        const result = await OrderModel.aggregate([
        { $group: { _id: null, order_totalPrice : { $sum : '$order_totalPrice' } } }
    ]);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "The Order sales cannot be generated" });
    }
    const totalSales = result[0].order_totalPrice
                // result.pop().order_totalPrice
    
    res.status(200).json({ totalsales: totalSales });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

 const getOrderCount = async (req, res) => {
  try { 
      const orderCount = await OrderModel.countDocuments({}).exec();
      if(!orderCount) return res.status(404).json({message:'orders not exist'})
        res.status(200).json({orderCount : orderCount})
  }
  catch(err) {
      res.status(400).json({success: false, error: err.message})
  }
}

const getUserOrder = async (req, res) => {

  try {
    const userOrderList = await OrderModel.findById(req.params.id)
    .populate('users', 'username')
    .populate({
       path: 'orderItems', populate:{
       path: 'product', populate:'category'
     }
    })

    if (!userOrderList) return res.status(404).json({ error: "User Order not found" });
    res.status(200).json(userOrderList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  gettotalSales,
  getOrderCount,
  getUserOrder
  
};
