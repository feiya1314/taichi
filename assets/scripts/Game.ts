import { _decorator, Component, Node, Color, PhysicsSystem2D, sys, log, director } from 'cc';
const { ccclass, property } = _decorator;
import { Player } from "./Player";
import { GiftCollector } from "./GiftCollector";
import { ObstacleSet } from "./ObstacleSet";
import { GameResult } from "./GameResult";

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    private operateTipNode: Node = null;

    @property([Color])
    private colors: Color[] = [];

    @property(Player)
    private player: Player = null;

    @property(GiftCollector)
    private giftCollector: GiftCollector = null;

    @property(ObstacleSet)
    private obstacleSet: ObstacleSet = null;

    /**
     * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，
     * 这能用于安排脚本的初始化顺序。该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，
     * 不可在其它地方直接调用该方法。
     * https://docs.cocos.com/creator/3.8/api/zh/class/Component?id=onLoad
     */
    override onLoad(): void {

        // 打开碰撞检测,默认是开启的
        PhysicsSystem2D.instance.enable = true;
        this.player.game = this;

        this.node.once(Node.EventType.TOUCH_START, this.hideOperateTip, this);

        // 监听玩家跳跃,这里第三个参数是启动callback函数的对象，
        // 通过将 this.player 作为第三个参数传递，确保在 this.player.jump 方法被调用时，this 关键字指向 this.player 对象。
        // 这样可以在 jump 方法内部正确访问 player 对象的属性和方法。
        // this.player.jump() 会立即执行而不是被回调
        this.node.on(Node.EventType.TOUCH_START, this.player.jump, this.player);

        this.getUserInfo();
    }

    private hideOperateTip() {
        // 隐藏操作提示框
        this.operateTipNode.active = false;
        this.operateTipNode.parent.removeChild(this.operateTipNode);
        delete this.operateTipNode;
    }

    public gameOver() {
        this.node.off(Node.EventType.TOUCH_START, this.player.jump, this.player);

        // 获取该节点的GameResult组件
        this.node.getComponent(GameResult).setNewScore(this.giftCollector.getScore());

        // director 一个管理你的游戏的逻辑流程的单例对象,通过场景名称进行加载场景
        director.loadScene('GameOver');
    }

    private getUserInfo() {

        // 使用 wx.login 获取用户的登录凭证（code），然后通过后端服务器换取用户的 OpenID 和 SessionKey。
        // 使用 wx.getUserProfile 获取用户的昵称、头像等信息。
        // 使用 wx.shareAppMessage 设置分享内容。
        // 支付功能使用 wx.requestPayment 发起支付请求。
        // 微信广告 wx.createRewardedVideoAd 创建激励视频广

        log("platfom :" + sys.platform)
        log("os :" + sys.os)
        if (sys.platform !== sys.Platform.WECHAT_GAME) {
            return;
        }

        const wx = window['wx'];
        const systemInfo = wx.getSystemInfoSync();//立即获取系统信息
        // wx.cloud.init();
        // WX.cloud.callFunction({
        //     name: 'getUserInfo',
        //     data: {},
        //     success: res => {
        //         log('getUserInfo:' + JSON.stringify(res.result));
        //         window.userInfo = res.result;
        //         WX.getOpenDataContext().postMessage({ type: 'userInfo', userInfo: window.userInfo });
        //     },
        //     fail: error => {
        //         error(error);
        //     }
        // });

        ////获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
        //   wx.getSetting(
        //     {
        //       success(res) {
        //         //如果用户已经授权
        //         if (res.authSetting["scope.userInfo"]) {
        //           wx.getUserInfo({
        //             success(res) {
        //               console.log("授权成功")
        //               this.userInfo = res.userInfo;
        //               console.log("用户已经授权,用户信息" + res.userInfo.nickName);
        //               console.log("nickName:" + this.userInfo.nickName);
        //               console.log("avatarUrl:" + this.userInfo.avatarUrl);
        //               self.setAvatar(this.userInfo.avatarUrl);
        //               self.name_Label.string = this.userInfo.nickName as string;
        //             }
        //           });
        //           //如果用户没有授权
        //         } else {
        //           console.log("创建全屏透明==[createUserInfoButton]");
        //           let button = wx.createUserInfoButton({
        //             type: 'text',
        //             text: '登录',
        //             style: {
        //               left: w/2-45,
        //               top: h - 30,
        //               width: 90,
        //               height: 40,
        //               lineHeight: 40,
        //               backgroundColor: "#66CC00",
        //               color: "#FFFFFF",
        //               textAlign: "center",
        //               fontSize: 18,
        //               borderRadius: 10
        //             }
        //           });
        //           //用户授权确认
        //           button.onTap((res) => {
        //             if (res.userInfo) {
        //               console.log("用户同意授权:", res.userInfo.nickName);
        //               this.userInfo = res.userInfo;
        //               self.setAvatar(this.userInfo.avatarUrl);
        //               self.name_Label.string = this.userInfo.nickName as string;
        //               button.destroy();
        //             } else {
        //               console.log("用户拒绝授权:");
        //               button.destroy();
        //             }
        //           });
        //         }
        //       }
        //     }
        //   );
        // }

        // //设置头像
        // setAvatar(url): void {
        //   let spire = this.avatar.getComponent(Sprite)
        //   assetManager.loadRemote<ImageAsset>(url + "?aaa=aa.jpg", { ext: '.jpg' }, (_err, imageAsset) => {
        //     let sp = new SpriteFrame();
        //     let texture = new Texture2D();
        //     texture.image = imageAsset;
        //     sp.texture = texture
        //     spire.spriteFrame = sp;
        //   })
        // }

    }


    public captureStar(score: number) {

        this.giftCollector.captureStar(score);
    }
    /**
     * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。
     *
     * Learnmore https://docs.cocos.com/creator/3.8/api/zh/class/Component?id=start
     */
    override start() {

    }

    // override update(deltaTime: number) {

    // }
}


