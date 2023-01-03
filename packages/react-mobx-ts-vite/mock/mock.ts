import Mock from 'mockjs';

const getTable = Mock.mock(location.origin + '/api/getTable.json', 'get', {
    result: [
        {
            orderId: '61011727',
            customerName: '小红',
            placeOrder: '自主下单',
            goodsName: '智能机器人',
            price: '￥199',
            placeOrderTime: '2018-12-17'
        },
        {
            orderId: '73580830',
            customerName: '小明',
            placeOrder: '自主下单',
            goodsName: '智能机器人',
            price: '￥199',
            placeOrderTime: '2018-12-17'
        },
    ]
});

export { getTable };
