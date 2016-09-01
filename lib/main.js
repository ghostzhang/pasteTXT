/**
 * @author ghost
 * @time 2011-10-24
 */
var main = function(){
    function onExit(event){
        air.NativeApplication.nativeApplication.icon.bitmaps = [];
        air.NativeApplication.nativeApplication.exit();
    }
    function pasteTXT(){
        var t = air.Clipboard.generalClipboard.getData(air.ClipboardFormats.TEXT_FORMAT);
        if (t) {
            doSaveTxt(t);
        }
        else {
            alert("剪贴板没有文本内容！")
        }
    }
    function doSaveTxt(cont){
        var txtName = {
            time: function(){
                var today = new Date();
                var m, d;
                m = today.getMonth() + 1;
                if (m < 10) {
                    m = "0" + m;
                }
                d = today.getDate();
                if (d < 10) {
                    d = "0" + d;
                }
                return today.getFullYear() + "" + m + "" + d + "_" + this.getRandom(1000) + this.getRandom(1000);
            },
            getRandom: function(n){
                return Math.floor(Math.random() * n + 1);
            },
            name: function(){
                return this.time() + ".txt"
            }
        }
        var path = txtName.name();
        
        
        try {
            var file = air.File.desktopDirectory.resolvePath(path);
            
            var stream = new air.FileStream();
            stream.open(file, air.FileMode.WRITE);
            stream.writeMultiByte(cont, "utf-8");
            stream.close();
            alert("已保存到桌面 " + path);
        } 
        catch (error) {
            alert("保存失败");
        }
    }
    function loadApp(){
        var parser, xml_obj, root, gAppVersion, gAppName, tempBounds = [];
        var appinfo = "";
        //程序信息
        parser = new DOMParser();
        xml_obj = parser.parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml");
        root = xml_obj.getElementsByTagName("application")[0];
        gAppVersion = root.getElementsByTagName("version")[0].firstChild.data;
        gAppName = root.getElementsByTagName("filename")[0].firstChild.data;
        appinfo = gAppName + " v" + gAppVersion + " | 2011 by TID Ghostzhang";
        
        function openAbout(){
            var note = "";
            note += "程序名：" + gAppName + "\n";
            note += "版本：" + gAppVersion + "\n";
            note += "使用说明：左键单击任务栏图标，即可将剪贴板中的文本信息保存到桌面。";
            alert(note);
        }
        
        //任务栏图标
        if (air.NativeApplication.supportsSystemTrayIcon) {
            var iconLoad, iconMenu, moveable, i, exitCmd = [];
            iconMenu = new air.NativeMenu();
            exitCmd[0] = iconMenu.addItem(new air.NativeMenuItem("关于"));
            exitCmd[0].addEventListener(air.Event.SELECT, openAbout);
            exitCmd[1] = iconMenu.addItem(new air.NativeMenuItem("退出"));
            exitCmd[1].addEventListener(air.Event.SELECT, onExit);
            iconLoad = new air.Loader();
            iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, function(event){
                air.NativeApplication.nativeApplication.icon.bitmaps = [event.target.content.bitmapData];
            });
            iconLoad.load(new air.URLRequest("/icons/AIRApp_16.png"));
            air.NativeApplication.nativeApplication.icon.tooltip = "" + appinfo + "";
            air.NativeApplication.nativeApplication.icon.menu = iconMenu;
            air.NativeApplication.nativeApplication.icon.addEventListener("click", function(event){
                pasteTXT();
            });
        }
    }
    return {
        loadApp: loadApp
    }
}();
