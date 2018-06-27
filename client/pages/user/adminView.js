//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

var app = getApp();

Page({
    data: {
        index: 0,
        detail: {}, // 产品详情
        sales: [], // 显示用
        salesList: [] // 原始数据
    },
    onReady: function(){
        this.setData({
            activeIndex: app.data.orderActiveIndex,
            userType: app.data.user.type
        });
    },
    onLoad: function () {
        var that = this;
        // wx.previewImage({
        //   current: 'https://pro.modao.cc/uploads3/images/1940/19401098/raw_1524634700.png', // 当前显示图片的http链接
        //   urls: ['https://pro.modao.cc/uploads3/images/1940/19401098/raw_1524634700.png'] // 需要预览的图片http链接列表
        // })

        // 订单详情
        wx.request({
            url: config.service.adminOrderDetailUrl,
            data: {
                order_id: app.data.orderDetailId,
                userkey: app.data.user && app.data.user.userKey
            },
            success: function(res) {
                if (res.data.resultCode == 0 && res.data.data){
                    that.setData({
                        detail: res.data.data
                    });
                }
            },
            fail: function(res) {
                console.log('失败', res)
            }
        });

        // 业务员列表
        wx.request({
            url: config.service.adminOrderSalesUrl,
            data: {
                order_id: app.data.orderDetailId,
                userkey: app.data.user && app.data.user.userKey
            },
            success: function(res) {
                if (res.data.resultCode == 0 && res.data.data){
                    var sales = [];
                    res.data.data.forEach(function(o, i){
                        sales.push(o.real_name + ' ' + o.mobile);
                    });
                    that.setData({
                        sales: sales,
                        salesList: res.data.data
                    });
                }
            },
            fail: function(res) {
                console.log('失败', res)
            }
        });
    },
    calling: function(e){ // 拨打电话
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        });
    },
    receive: function(){ // 接单
        var that = this;

        wx.request({
            url: config.service.adminOrderReceiveUrl,
            data: {
                order_id: app.data.orderDetailId,
                userkey: app.data.user && app.data.user.userKey
            },
            success: function(res) {
                if (res.data.resultCode == 0 && res.data.data){
                    wx.showToast({
                      title: '接单成功',
                      icon: 'success',
                      duration: 2000
                    });
                    // setTimeout(function(){
                    //     wx.navigateBack();
                    // }, 2000);
                    that.setData({
                        'detail.order_status' : 1
                    });
                }
                else {
                    wx.showToast({
                      title: res.data.msg || '系统繁忙，请稍后再试',
                      icon: 'none',
                      duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('失败', res)
            }
        });
    },
    create: function(){ // 生成购销单
        var that = this;

        wx.request({
            url: config.service.adminOrderCreateUrl,
            data: {
                order_id: app.data.orderDetailId,
                userkey: app.data.user && app.data.user.userKey
            },
            success: function(res) {
                if (res.data.resultCode == 0 && res.data.data){
                    wx.showToast({
                      title: '生成购销单成功',
                      icon: 'success',
                      duration: 2000
                    });
                    setTimeout(function(){
                        wx.navigateBack();
                    }, 2000);
                }
                else {
                    wx.showToast({
                      title: res.data.msg || '系统繁忙，请稍后再试',
                      icon: 'none',
                      duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('失败', res)
            }
        });
    },
    deal: function(){ // 完成ERP
        var that = this;

        wx.request({
            url: config.service.adminOrderDealUrl,
            data: {
                order_id: app.data.orderDetailId,
                userkey: app.data.user && app.data.user.userKey
            },
            success: function(res) {
                if (res.data.resultCode == 0 && res.data.data){
                    wx.showToast({
                      title: '完成ERP成功',
                      icon: 'success',
                      duration: 2000
                    });
                    setTimeout(function(){
                        wx.navigateBack();
                    }, 2000);
                }
                else {
                    wx.showToast({
                      title: res.data.msg || '系统繁忙，请稍后再试',
                      icon: 'none',
                      duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('失败', res)
            }
        });
    },
    bindPickerChange: function(e) { // 转单
        var that = this;
        
        this.setData({
            index: e.detail.value
        });
        
        if (that.data.salesList[e.detail.value]){
            wx.request({
                url: config.service.adminOrderTransferUrl,
                data: {
                    order_id: app.data.orderDetailId,
                    sale_id: that.data.salesList[e.detail.value].id,
                    userkey: app.data.user && app.data.user.userKey
                },
                success: function(res) {
                    if (res.data.resultCode == 0 && res.data.data){
                        wx.showToast({
                          title: '转单成功',
                          icon: 'success',
                          duration: 2000
                        });
                    }
                    else {
                        wx.showToast({
                          title: res.data.msg || '系统繁忙，请稍后再试',
                          icon: 'none',
                          duration: 2000
                        });
                    }
                },
                fail: function(res) {
                    console.log('失败', res)
                }
            });
        }
        // else {
        //     wx.showToast({
        //       title: '请选择业务员',
        //       icon: 'none',
        //       duration: 2000
        //     });
        // }
    }
})
