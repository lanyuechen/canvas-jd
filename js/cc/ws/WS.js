/**
 * Created by Molay on 15/10/30.
 */
var WS = {};
WS.client = 'JD Co.';
WS.project = 'JD 2015 Double 11';
WS.description = 'Beijing Webstudio Information Technology Inc.';
if (console == null) console = {
    log: function () {
    },
    info: function () {
    },
    clear: function () {
    }
};
WS.output = function ()
{
    console.log('%c 北京万博思图信息技术有限公司\n %c http://www.cn-wbst.cn', 'font-size: 12px;', '');
};
WS.output();