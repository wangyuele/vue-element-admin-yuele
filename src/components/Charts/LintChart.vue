<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

// origin model
/*
const _data = [
  { 'Time Serie': '2016-12-14', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3312', 'EURO AREA - EURO/US$': '0.9384', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.3835', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.7870', 'BRAZIL - REAL/US$': '3.3332', 'CANADA - CANADIAN DOLLAR/US$': '1.3123', 'CHINA - YUAN/US$': '6.9025', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7559', 'INDIA - INDIAN RUPEE/US$': '67.43', 'KOREA - WON/US$': '1165.13', 'MEXICO - MEXICAN PESO/US$': '20.2295', 'SOUTH AFRICA - RAND/US$': '13.6725', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4227', 'DENMARK - DANISH KRONE/US$': '6.9777', 'JAPAN - YEN/US$': '115.06', 'MALAYSIA - RINGGIT/US$': '4.444', 'NORWAY - NORWEGIAN KRONE/US$': '8.4628', 'SWEDEN - KRONA/US$': '9.1535', 'SRI LANKA - SRI LANKAN RUPEE/US$': '148.3', 'SWITZERLAND - FRANC/US$': '1.0099', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '31.73', 'THAILAND - BAHT/US$': '35.57' },
  { 'Time Serie': '2016-12-15', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3618', 'EURO AREA - EURO/US$': '0.9639', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4255', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8072', 'BRAZIL - REAL/US$': '3.3933', 'CANADA - CANADIAN DOLLAR/US$': '1.3397', 'CHINA - YUAN/US$': '6.941', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7602', 'INDIA - INDIAN RUPEE/US$': '67.91', 'KOREA - WON/US$': '1185.35', 'MEXICO - MEXICAN PESO/US$': '20.614', 'SOUTH AFRICA - RAND/US$': '14.1025', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4478', 'DENMARK - DANISH KRONE/US$': '7.1648', 'JAPAN - YEN/US$': '118.32', 'MALAYSIA - RINGGIT/US$': '4.462', 'NORWAY - NORWEGIAN KRONE/US$': '8.6916', 'SWEDEN - KRONA/US$': '9.4207', 'SRI LANKA - SRI LANKAN RUPEE/US$': '148.4', 'SWITZERLAND - FRANC/US$': '1.0334', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32', 'THAILAND - BAHT/US$': '35.8' },
  { 'Time Serie': '2016-12-16', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3702', 'EURO AREA - EURO/US$': '0.9564', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4325', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8014', 'BRAZIL - REAL/US$': '3.386', 'CANADA - CANADIAN DOLLAR/US$': '1.3339', 'CHINA - YUAN/US$': '6.958', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7659', 'INDIA - INDIAN RUPEE/US$': '67.82', 'KOREA - WON/US$': '1183.72', 'MEXICO - MEXICAN PESO/US$': '20.417', 'SOUTH AFRICA - RAND/US$': '14.075', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.445', 'DENMARK - DANISH KRONE/US$': '7.1096', 'JAPAN - YEN/US$': '117.74', 'MALAYSIA - RINGGIT/US$': '4.4763', 'NORWAY - NORWEGIAN KRONE/US$': '8.6706', 'SWEDEN - KRONA/US$': '9.3581', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.22', 'SWITZERLAND - FRANC/US$': '1.0258', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '31.94', 'THAILAND - BAHT/US$': '35.81' },
  { 'Time Serie': '2016-12-19', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3767', 'EURO AREA - EURO/US$': '0.9575', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4391', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8052', 'BRAZIL - REAL/US$': '3.3725', 'CANADA - CANADIAN DOLLAR/US$': '1.3395', 'CHINA - YUAN/US$': '6.9506', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7674', 'INDIA - INDIAN RUPEE/US$': '67.83', 'KOREA - WON/US$': '1187.71', 'MEXICO - MEXICAN PESO/US$': '20.412', 'SOUTH AFRICA - RAND/US$': '14.0925', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4458', 'DENMARK - DANISH KRONE/US$': '7.1167', 'JAPAN - YEN/US$': '116.6', 'MALAYSIA - RINGGIT/US$': '4.4765', 'NORWAY - NORWEGIAN KRONE/US$': '8.6555', 'SWEDEN - KRONA/US$': '9.3427', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149', 'SWITZERLAND - FRANC/US$': '1.0226', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '31.98', 'THAILAND - BAHT/US$': '35.85' },
  { 'Time Serie': '2016-12-20', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3789', 'EURO AREA - EURO/US$': '0.9625', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4449', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8092', 'BRAZIL - REAL/US$': '3.3631', 'CANADA - CANADIAN DOLLAR/US$': '1.3376', 'CHINA - YUAN/US$': '6.947', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7658', 'INDIA - INDIAN RUPEE/US$': '67.97', 'KOREA - WON/US$': '1192.13', 'MEXICO - MEXICAN PESO/US$': '20.4305', 'SOUTH AFRICA - RAND/US$': '14.015', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4443', 'DENMARK - DANISH KRONE/US$': '7.1549', 'JAPAN - YEN/US$': '117.86', 'MALAYSIA - RINGGIT/US$': '4.478', 'NORWAY - NORWEGIAN KRONE/US$': '8.6995', 'SWEDEN - KRONA/US$': '9.3557', 'SRI LANKA - SRI LANKAN RUPEE/US$': '148.75', 'SWITZERLAND - FRANC/US$': '1.0282', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.06', 'THAILAND - BAHT/US$': '36' },
  { 'Time Serie': '2016-12-21', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3805', 'EURO AREA - EURO/US$': '0.9592', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4489', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8098', 'BRAZIL - REAL/US$': '3.3335', 'CANADA - CANADIAN DOLLAR/US$': '1.3401', 'CHINA - YUAN/US$': '6.939', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7633', 'INDIA - INDIAN RUPEE/US$': '67.82', 'KOREA - WON/US$': '1193.91', 'MEXICO - MEXICAN PESO/US$': '20.51', 'SOUTH AFRICA - RAND/US$': '13.9385', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4434', 'DENMARK - DANISH KRONE/US$': '7.1317', 'JAPAN - YEN/US$': '117.79', 'MALAYSIA - RINGGIT/US$': '4.477', 'NORWAY - NORWEGIAN KRONE/US$': '8.6671', 'SWEDEN - KRONA/US$': '9.228', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.05', 'SWITZERLAND - FRANC/US$': '1.0262', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.05', 'THAILAND - BAHT/US$': '36' },
  { 'Time Serie': '2016-12-22', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3858', 'EURO AREA - EURO/US$': '0.9568', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4474', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8129', 'BRAZIL - REAL/US$': '3.3153', 'CANADA - CANADIAN DOLLAR/US$': '1.347', 'CHINA - YUAN/US$': '6.9473', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7619', 'INDIA - INDIAN RUPEE/US$': '67.86', 'KOREA - WON/US$': '1204.65', 'MEXICO - MEXICAN PESO/US$': '20.7095', 'SOUTH AFRICA - RAND/US$': '14.0305', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4476', 'DENMARK - DANISH KRONE/US$': '7.1122', 'JAPAN - YEN/US$': '117.48', 'MALAYSIA - RINGGIT/US$': '4.476', 'NORWAY - NORWEGIAN KRONE/US$': '8.7014', 'SWEDEN - KRONA/US$': '9.1911', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.6', 'SWITZERLAND - FRANC/US$': '1.0246', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.19', 'THAILAND - BAHT/US$': '36.01' },
  { 'Time Serie': '2016-12-23', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3939', 'EURO AREA - EURO/US$': '0.9570', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4556', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8162', 'BRAZIL - REAL/US$': '3.2687', 'CANADA - CANADIAN DOLLAR/US$': '1.3533', 'CHINA - YUAN/US$': '6.9432', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7587', 'INDIA - INDIAN RUPEE/US$': '67.84', 'KOREA - WON/US$': '1201.51', 'MEXICO - MEXICAN PESO/US$': '20.611', 'SOUTH AFRICA - RAND/US$': '14.0081', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4469', 'DENMARK - DANISH KRONE/US$': '7.1138', 'JAPAN - YEN/US$': '117.22', 'MALAYSIA - RINGGIT/US$': '4.4725', 'NORWAY - NORWEGIAN KRONE/US$': '8.7043', 'SWEDEN - KRONA/US$': '9.198', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.5', 'SWITZERLAND - FRANC/US$': '1.0268', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.18', 'THAILAND - BAHT/US$': '35.96' },
  { 'Time Serie': '2016-12-26', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': 'ND', 'EURO AREA - EURO/US$': 'ND', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': 'ND', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': 'ND', 'BRAZIL - REAL/US$': 'ND', 'CANADA - CANADIAN DOLLAR/US$': 'ND', 'CHINA - YUAN/US$': 'ND', 'HONG KONG - HONG KONG DOLLAR/US$': 'ND', 'INDIA - INDIAN RUPEE/US$': 'ND', 'KOREA - WON/US$': 'ND', 'MEXICO - MEXICAN PESO/US$': 'ND', 'SOUTH AFRICA - RAND/US$': 'ND', 'SINGAPORE - SINGAPORE DOLLAR/US$': 'ND', 'DENMARK - DANISH KRONE/US$': 'ND', 'JAPAN - YEN/US$': 'ND', 'MALAYSIA - RINGGIT/US$': 'ND', 'NORWAY - NORWEGIAN KRONE/US$': 'ND', 'SWEDEN - KRONA/US$': 'ND', 'SRI LANKA - SRI LANKAN RUPEE/US$': 'ND', 'SWITZERLAND - FRANC/US$': 'ND', 'TAIWAN - NEW TAIWAN DOLLAR/US$': 'ND', 'THAILAND - BAHT/US$': 'ND' },
  { 'Time Serie': '2016-12-27', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3910', 'EURO AREA - EURO/US$': '0.9562', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4514', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8156', 'BRAZIL - REAL/US$': '3.28', 'CANADA - CANADIAN DOLLAR/US$': '1.3553', 'CHINA - YUAN/US$': '6.9491', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7596', 'INDIA - INDIAN RUPEE/US$': '68.01', 'KOREA - WON/US$': '1207.68', 'MEXICO - MEXICAN PESO/US$': '20.7085', 'SOUTH AFRICA - RAND/US$': '13.9325', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.449', 'DENMARK - DANISH KRONE/US$': '7.1098', 'JAPAN - YEN/US$': '117.52', 'MALAYSIA - RINGGIT/US$': '4.476', 'NORWAY - NORWEGIAN KRONE/US$': '8.7092', 'SWEDEN - KRONA/US$': '9.2277', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.2', 'SWITZERLAND - FRANC/US$': '1.0284', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.27', 'THAILAND - BAHT/US$': '36' },
  { 'Time Serie': '2016-12-28', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3918', 'EURO AREA - EURO/US$': '0.9626', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4472', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8182', 'BRAZIL - REAL/US$': '3.283', 'CANADA - CANADIAN DOLLAR/US$': '1.3555', 'CHINA - YUAN/US$': '6.9559', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7575', 'INDIA - INDIAN RUPEE/US$': '68.2', 'KOREA - WON/US$': '1212.22', 'MEXICO - MEXICAN PESO/US$': '20.735', 'SOUTH AFRICA - RAND/US$': '13.8575', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4522', 'DENMARK - DANISH KRONE/US$': '7.155', 'JAPAN - YEN/US$': '117.66', 'MALAYSIA - RINGGIT/US$': '4.48', 'NORWAY - NORWEGIAN KRONE/US$': '8.7485', 'SWEDEN - KRONA/US$': '9.206', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.3', 'SWITZERLAND - FRANC/US$': '1.0313', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.42', 'THAILAND - BAHT/US$': '36' },
  { 'Time Serie': '2016-12-29', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3850', 'EURO AREA - EURO/US$': '0.9537', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4372', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8172', 'BRAZIL - REAL/US$': '3.2456', 'CANADA - CANADIAN DOLLAR/US$': '1.3488', 'CHINA - YUAN/US$': '6.9535', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7549', 'INDIA - INDIAN RUPEE/US$': '67.91', 'KOREA - WON/US$': '1207.05', 'MEXICO - MEXICAN PESO/US$': '20.6755', 'SOUTH AFRICA - RAND/US$': '13.6225', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4482', 'DENMARK - DANISH KRONE/US$': '7.0888', 'JAPAN - YEN/US$': '116.32', 'MALAYSIA - RINGGIT/US$': '4.483', 'NORWAY - NORWEGIAN KRONE/US$': '8.6598', 'SWEDEN - KRONA/US$': '9.1213', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.6', 'SWITZERLAND - FRANC/US$': '1.023', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.26', 'THAILAND - BAHT/US$': '35.89' },
  { 'Time Serie': '2016-12-30', 'AUSTRALIA - AUSTRALIAN DOLLAR/US$': '1.3831', 'EURO AREA - EURO/US$': '0.9477', 'NEW ZEALAND - NEW ZELAND DOLLAR/US$': '1.4372', 'UNITED KINGDOM - UNITED KINGDOM POUND/US$': '0.8106', 'BRAZIL - REAL/US$': '3.2532', 'CANADA - CANADIAN DOLLAR/US$': '1.3426', 'CHINA - YUAN/US$': '6.943', 'HONG KONG - HONG KONG DOLLAR/US$': '7.7534', 'INDIA - INDIAN RUPEE/US$': '67.92', 'KOREA - WON/US$': '1203.73', 'MEXICO - MEXICAN PESO/US$': '20.617', 'SOUTH AFRICA - RAND/US$': '13.7', 'SINGAPORE - SINGAPORE DOLLAR/US$': '1.4465', 'DENMARK - DANISH KRONE/US$': '7.0462', 'JAPAN - YEN/US$': '116.78', 'MALAYSIA - RINGGIT/US$': '4.4845', 'NORWAY - NORWEGIAN KRONE/US$': '8.6107', 'SWEDEN - KRONA/US$': '9.0803', 'SRI LANKA - SRI LANKAN RUPEE/US$': '149.6', 'SWITZERLAND - FRANC/US$': '1.016', 'TAIWAN - NEW TAIWAN DOLLAR/US$': '32.4', 'THAILAND - BAHT/US$': '35.81' }
] */

/*
const countryMap = {
  'AUSTRALIA - AUSTRALIAN DOLLAR/US$': {
    'text': '澳元',
    'color': 'rgb(61, 234, 211)'
  },
  'EURO AREA - EURO/US$': {
    'text': '欧元',
    'color': 'rgb(75, 197, 224)'
  },
  'NEW ZEALAND - NEW ZELAND DOLLAR/US$': {
    'text': '纽元',
    'color': 'rgb(157, 75, 224)'
  },
  'UNITED KINGDOM - UNITED KINGDOM POUND/US$': {
    'text': '英镑',
    'color': 'rgb(222, 75, 224)'
  },
  'BRAZIL - REAL/US$': {
    'text': '巴西雷亚尔',
    'color': 'rgb(224, 75, 132)'
  },
  'CANADA - CANADIAN DOLLAR/US$': {
    'text': '加元',
    'color': 'rgb(75, 224, 126)'
  },
  'CHINA - YUAN/US$': {
    'text': '人民币',
    'color': 'rgb(218, 224, 75)'
  },
  'HONG KONG - HONG KONG DOLLAR/US$': {
    'text': '港币',
    'color': 'rgb(224, 204, 75)'
  },
  'INDIA - INDIAN RUPEE/US$': {
    'text': '印度卢比',
    'color': 'rgb(142, 139, 180)'
  },
  'KOREA - WON/US$': {
    'text': '韩元',
    'color': 'rgb(61, 235, 197)'
  },
  'MEXICO - MEXICAN PESO/US$': {
    'text': '墨西哥元',
    'color': 'rgb(147, 212, 184)'
  },
  'SOUTH AFRICA - RAND/US$': {
    'text': '南非兰特',
    'color': 'rgb(253, 213, 110)'
  },
  'SINGAPORE - SINGAPORE DOLLAR/US$': {
    'text': '新加坡元',
    'color': 'rgb(255, 243, 185)'
  },
  'DENMARK - DANISH KRONE/US$': {
    'text': '丹麦克朗',
    'color': 'rgb(123, 193, 251)'
  },
  'JAPAN - YEN/US$': {
    'text': '日元',
    'color': 'rgb(254, 219, 206)'
  },
  'MALAYSIA - RINGGIT/US$': {
    'text': '马来林吉特',
    'color': 'rgb(254, 220, 230)'
  },
  'NORWAY - NORWEGIAN KRONE/US$': {
    'text': '挪威克朗',
    'color': 'rgb(253, 133, 164)'
  },
  'SWEDEN - KRONA/US$': {
    'text': '瑞典克朗',
    'color': 'rgb(230, 46, 42)'
  },
  'SRI LANKA - SRI LANKAN RUPEE/US$': {
    'text': '斯里兰卡卢比',
    'color': 'rgb(230, 221, 177)'
  },
  'SWITZERLAND - FRANC/US$': {
    'text': '法郎',
    'color': 'rgb(165, 179, 138)'
  },
  'TAIWAN - NEW TAIWAN DOLLAR/US$': {
    'text': '台币',
    'color': 'rgb(78, 175, 162)'
  },
  'THAILAND - BAHT/US$': {
    'text': '泰铢',
    'color': 'rgb(241, 198, 88)'
  }
} */

// added by yuele for test
const _data = [
  { 'Time Serie': '2020-06-01', 'ap_sys': '10', 'wcn_sys': '15', 'aud_cp_sys': '36', 'gpu_sys': '41', 'mm__sys': '62', 'wtl_cp_sys': '80', 'pub_sys': '190', 'top': '300' },
  { 'Time Serie': '2020-06-02', 'ap_sys': '20', 'wcn_sys': '16', 'aud_cp_sys': '30', 'gpu_sys': '42', 'mm__sys': '65', 'wtl_cp_sys': '81', 'pub_sys': '180', 'top': '310' },
  { 'Time Serie': '2020-06-03', 'ap_sys': '10', 'wcn_sys': '17', 'aud_cp_sys': '31', 'gpu_sys': '43', 'mm__sys': '66', 'wtl_cp_sys': '82', 'pub_sys': '170', 'top': '320' },
  { 'Time Serie': '2020-06-04', 'ap_sys': '14', 'wcn_sys': '18', 'aud_cp_sys': '32', 'gpu_sys': '45', 'mm__sys': '67', 'wtl_cp_sys': '83', 'pub_sys': '160', 'top': '330' },
  { 'Time Serie': '2020-06-05', 'ap_sys': '16', 'wcn_sys': '19', 'aud_cp_sys': '33', 'gpu_sys': '47', 'mm__sys': '70', 'wtl_cp_sys': '84', 'pub_sys': '150', 'top': '340' },
  { 'Time Serie': '2020-06-06', 'ap_sys': '18', 'wcn_sys': '12', 'aud_cp_sys': '34', 'gpu_sys': '49', 'mm__sys': '78', 'wtl_cp_sys': '85', 'pub_sys': '140', 'top': '350' },
  { 'Time Serie': '2020-06-07', 'ap_sys': '19', 'wcn_sys': '11', 'aud_cp_sys': '35', 'gpu_sys': '50', 'mm__sys': '80', 'wtl_cp_sys': '86', 'pub_sys': '140', 'top': '360' },
  { 'Time Serie': '2020-06-08', 'ap_sys': '30', 'wcn_sys': '10', 'aud_cp_sys': '36', 'gpu_sys': '56', 'mm__sys': '85', 'wtl_cp_sys': '87', 'pub_sys': '135', 'top': '370' },
  { 'Time Serie': '2020-06-09', 'ap_sys': '40', 'wcn_sys': '17', 'aud_cp_sys': '37', 'gpu_sys': '70', 'mm__sys': '90', 'wtl_cp_sys': '88', 'pub_sys': '120', 'top': '380' }
]

const sysMap = {
  'ap_sys': {
    'text': 'ap_sys',
    'color': 'rgb(61, 234, 211)'
  },
  'wcn_sys': {
    'text': 'wcn_sys',
    'color': 'rgb(70, 234, 211)'
  },
  'aud_cp_sys': {
    'text': 'aud_cp_sys',
    'color': 'rgb(75, 197, 224)'
  },
  'gpu_sys': {
    'text': 'gpu_sys',
    'color': 'rgb(157, 75, 224)'
  },
  'mm__sys': {
    'text': 'mm__sys',
    'color': 'rgb(222, 75, 224)'
  },
  'wtl_cp_sys': {
    'text': 'wtl_cp_sys',
    'color': 'rgb(224, 75, 132)'
  },
  'pub_sys': {
    'text': 'pub_sys',
    'color': 'rgb(241, 198, 88)'
  },
  'top': {
    'text': 'top',
    'color': 'rgb(78, 175, 162)'
  }
}

let timeRange = ['2018-12-01', '2020-12-31']
const _seriesData = []
const xAxisData = []
const _dataObj = {}
let legendData = []
let _lengedMax = 0
console.log('Time:06-29,timeRange', timeRange, _lengedMax)

initData()
function initData() {
  _data.forEach((item, index) => {
    console.log('Time:06-30,item,index', item, index)
    xAxisData.push(item['Time Serie'])
    Object.keys(item).forEach(sys => {
      if (sys !== 'Time Serie') {
        if (index === 0) {
          _dataObj[sys] = {
            name: sysMap[sys].text,
            type: 'line',
            data: [+item[sys]],
            symbol: 'none',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' }
                // {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ],
              lineStyle: {
                color: sysMap[sys].color,
                opacity: 0.3
              }
            },
            lineStyle: {
              color: sysMap[sys].color,
              width: 2,
              smooth: true,
              shadowBlur: {
                shadowColor: 'rgba(255, 255, 255, 0.5)',
                shadowBlur: 10
              }
            }
          }
        } else {
          _dataObj[sys].data.push(+item[sys])
        }
      }
    })
  })
  Object.keys(_dataObj).forEach(sys => {
    _seriesData.push(_dataObj[sys])
  })
}
console.log('Time:06-30,_seriesData', _seriesData)

var option = {
  backgroundColor: '#000',
  title: [{
    text: 'Sub_sys LINT_Total(P0+P1)',
    textStyle: {
      fontSize: 25,
      fontWeight: 'normal',
      color: '#fff'
    }
  }, {
    text: 'Sub_sys',
    right: 0,
    textAlign: 'center',
    textStyle: {
      fontSize: 25,
      fontWeight: 'normal',
      color: '#fff'
    }
  }],
  grid: {
    right: 100
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: 'vertical',
    top: '6%',
    x: 'right',
    itemGap: 20,
    selected: {
      '韩元': false
    },
    itemWidth: 200,
    itemHeight: 15,
    textStyle: {
      fontWeight: 'normal',
      color: '#fff'
    },
    data: legendData
  },
  color: [
    'rgb(61, 234, 211)',
    'rgb(75, 197, 224)',
    'rgb(157, 75, 224)',
    'rgb(222, 75, 224)',
    'rgb(224, 75, 132)',
    'rgb(75, 224, 126)',
    'rgb(218, 224, 75)',
    'rgb(224, 204, 75)',
    'rgb(142, 139, 180)',
    'rgb(61, 235, 197)',
    'rgb(147, 212, 184)',
    'rgb(253, 213, 110)',
    'rgb(255, 243, 185)',
    'rgb(123, 193, 251)',
    'rgb(254, 219, 206)',
    'rgb(254, 220, 230)',
    'rgb(253, 133, 164)',
    'rgb(230, 46, 42)',
    'rgb(230, 221, 177)',
    'rgb(165, 179, 138)',
    'rgb(78, 175, 162)',
    'rgb(241, 198, 88)'
  ],
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
      textStyle: {
        color: '#65abe7'
      }
    },
    {
      type: 'inside'

    }
  ],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxisData,
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0)', 'rgba(30,144,255,0.2)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisLabel: {
      color: '#3f64b5'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.1)'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisLabel: {
      color: '#3f64b5'
    }
  },
  series: _seriesData
}

function createdLegendData() {
  legendData = []
  const _newDataObj = {}
  const _startTime = Date.parse(timeRange[0])
  const _endTime = Date.parse(timeRange[1])
  _data.forEach((item, index) => {
    const _currentTime = Date.parse(item['Time Serie'])
    console.log('Tiem:06-30: _currentTime', _currentTime)
    if (_startTime <= _currentTime && _currentTime <= _endTime) {
      Object.keys(item).forEach(country => {
        if (country !== 'Time Serie') {
          if (!_newDataObj[country]) {
            _newDataObj[country] = {
              name: sysMap[country].text,
              _name: country,
              data: [+item[country] || 0]
            }
          } else {
            _newDataObj[country].data.push(+item[country] || 0)
          }
        }
      })
    }
  })
  const maxWidth = 1000
  let newData = []
  Object.keys(_newDataObj).forEach(country => {
    const _max = Math.max.apply(null, _newDataObj[country].data)
    newData.push({
      name: _newDataObj[country].name,
      max: _max,
      _name: country

    })
    if (_lengedMax < _max) _lengedMax = _max
  })
  newData = newData.sort(function(a, b) {
    return a.max - b.max
  })
  newData.forEach(item => {
    const _num = Math.log10(Math.round(item.max))
    const _max = Math.log10(Math.round(_lengedMax))
    const _numWidth = Math.round(_num / _max * maxWidth)
    const _dataWidth = _numWidth > 20 ? _numWidth : 20
    item.textStyle = {
      color: sysMap[item._name].color
    }
    item.icon = `image://data:image/svg+xml,` +
        `%3Csvg xmlns='http://www.w3.org/2000/svg'%3E` +
            `%3Cpath d='M0 260h${_dataWidth}v270H0z' fill='${sysMap[item._name].color}'/%3E` +
            `%3Cpath fill='rgba(0, 0,0,0)' d='M${_dataWidth} 60h${maxWidth - _dataWidth}v100H100z'/%3E` +
            `%3Ctext x='${_dataWidth}' y='0' style='color: red' %3E${item.max}%3C/text%3E` +
        `%3C/svg%3E`// `path://M10 60 H ${_a / _max * maxWidth} V 70 H 10 Z`
    legendData.push(item)
  })
}

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      test: {},
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      console.log('Time:06-30: this.chart.on >>>', this.chart)
      console.log('Time:06-30: optin.xAxis[0] >>>', option.xAxis)
      // var test = this.chart.getModel.option
      console.log('Time:06-30: test >>>', this.chart.getModel)
      this.chart.on('datazoom', function(params) {
        console.log('Time:06-30 params', params)
        // var xAxis = this.chart.getModel().option.xAxis[0]
        var xAxis = this.chart.getModel().option
        var startTime = xAxis.data[xAxis.rangeStart]
        var endTime = xAxis.data[xAxis.rangeEnd]
        timeRange = [startTime, endTime]
        console.log('Time: 06-30 updateLegend start')
        // this.updateLegend()
      })
      this.updateLegend()
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: option.title,
        tooltip: option.tooltip,
        grid: option.grid,
        legend: option.legend,
        calculable: true,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        dataZoom: option.dataZoom,
        series: option.series
      })
    },
    updateLegend() {
      console.log('Time:06-30: updateLegend funcs', this.chart)
      // this.createdLegendData()
      this.chart.setOption({
        legend: {
          data: legendData
        }
      })
    }
  }
}
</script>
