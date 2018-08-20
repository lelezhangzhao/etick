/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2018/8/20 14:25:13                           */
/*==============================================================*/


drop table if exists etick_advice;

drop table if exists etick_antiwave_football_banker;

drop table if exists etick_antiwave_football_banker_competition_guessing;

drop table if exists etick_antiwave_football_competition_guessing;

drop table if exists etick_antiwave_football_lead_competition_guessing;

drop table if exists etick_antiwave_football_lead_info;

drop table if exists etick_antiwave_football_match;

drop table if exists etick_antiwave_football_welfare_competition_guessing;

drop table if exists etick_arbitration;

drop table if exists etick_betting_record;

drop table if exists etick_credit_record;

drop table if exists etick_direct_buying;

drop table if exists etick_direct_saling;

drop table if exists etick_entrustment_buying;

drop table if exists etick_entrustment_saling;

drop table if exists etick_eti_record;

drop table if exists etick_football_match_team;

drop table if exists etick_football_match_type;

drop table if exists etick_latest_thirty_trade;

drop table if exists etick_leader;

drop table if exists etick_lol_banker;

drop table if exists etick_lol_banker_competition_guessing;

drop table if exists etick_lol_competition_guessing;

drop table if exists etick_lol_lead_competition_guessing;

drop table if exists etick_lol_lead_info;

drop table if exists etick_lol_match;

drop table if exists etick_lol_match_team;

drop table if exists etick_lol_match_type;

drop table if exists etick_lol_welfare_competition_guessing;

drop table if exists etick_team_profit;

drop table if exists etick_tel_identify;

drop table if exists etick_the_anti_fortune;

drop table if exists etick_the_fortune;

drop table if exists etick_the_last_one;

drop table if exists etick_the_last_one_record;

drop table if exists etick_user;

/*==============================================================*/
/* Table: etick_advice                                          */
/*==============================================================*/
create table etick_advice
(
   id                   int not null auto_increment,
   userid               int,
   advice               varchar(2048),
   advicetime           timestamp,
   status               int comment '建议状态
            0 未读
            1 未采纳
            2 已采纳',
   statusinfo           varchar(30),
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_advice comment '建议';

/*==============================================================*/
/* Table: etick_antiwave_football_banker                        */
/*==============================================================*/
create table etick_antiwave_football_banker
(
   id                   int not null auto_increment,
   userid               int,
   antiwavefootballmatchid int,
   status               int comment '庄家单状态
            0 未开赛
            1 盈利
            2 亏损',
   statusinfo           varchar(30),
   frozeneti            float(12,2),
   profiteti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker comment '庄家单';

/*==============================================================*/
/* Table: etick_antiwave_football_banker_competition_guessing   */
/*==============================================================*/
create table etick_antiwave_football_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   antiwavefootballbankerid int,
   antiwavefootballmatchtype int comment '比赛类型，为3=》开庄单',
   type                 int comment '竞猜类型：
            0 全场
            1 半场
            2 角球',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 下单人未中奖（不是开庄人）
            2 下单人中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker_competition_guessing comment '庄家单竞猜';

/*==============================================================*/
/* Table: etick_antiwave_football_competition_guessing          */
/*==============================================================*/
create table etick_antiwave_football_competition_guessing
(
   id                   int not null auto_increment,
   antiwavefootballmatchid int,
   antiwavefootballmatchtype int comment '反波胆赛事类型
            0 正常赛事',
   caption              varchar(30),
   type                 int comment '竞猜类型：
            0 全场
            1 半场
            2 角球',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 未中奖
            2 中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2) comment '冻结eti
            作假用的，冻结部分可投额度，计算时，要算到已投额度中
            ',
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_competition_guessing comment '赛事竞猜';

/*==============================================================*/
/* Table: etick_antiwave_football_lead_competition_guessing     */
/*==============================================================*/
create table etick_antiwave_football_lead_competition_guessing
(
   id                   int not null auto_increment,
   userid               int,
   caption              varchar(30),
   type                 int comment '竞猜类型：
            0 全场
            1 半场
            2 角球',
   typeinfo             varchar(30),
   antiwavefootballmatchid int,
   antiwavefootballcompetitionguessingidlist varchar(1024),
   etiperpart           float(12,2) comment '一份方案所需eti',
   count                int comment '下注此方案份数',
   status               int comment '方案状态
            0 未开奖
            1 未中奖 ： 收益小于等于投资
            2 中奖 ：收益大于投资
            3 取消',
   statusinfo           varchar(30),
   profitetiperpart     float(12,2) comment '每份净收益
            
            未中奖为负
            中奖为正 ',
   profitetitotal       float(12,2) comment '带单 人分得总收益',
   antiwavefootballmatchtype int comment '赛事类型，永远为1=>带单赛事',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_lead_competition_guessing comment '带单，只有赢利单，才能与下注人分成
每一份结算大于投资 
每一份结算分成后大于投资
';

/*==============================================================*/
/* Table: etick_antiwave_football_lead_info                     */
/*==============================================================*/
create table etick_antiwave_football_lead_info
(
   id                   int not null auto_increment,
   userid               int,
   leadmatchtimes       int comment '带单场 次',
   profittimes          int comment '盈利场次',
   losstimes            int comment '亏损场次',
   profitrate           float(12,4) comment '盈利率',
   profitetitotal       float(12,2) comment '带单总盈利',
   followpersoncount    int comment '总跟单人次',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_lead_info comment '带单信息
成功率，收益率..';

/*==============================================================*/
/* Table: etick_antiwave_football_match                         */
/*==============================================================*/
create table etick_antiwave_football_match
(
   id                   int not null auto_increment,
   footballmatchtypeid  int,
   footballmatchteamhostid int,
   footballmatchteamguestid int,
   caption              varchar(30),
   types                int comment '反波胆赛事类型
            0 正常
            1 带单
            2 福利
            3 开庄',
   typesinfo            varchar(30),
   status               int comment '比赛状态：
            0 未开赛
            1 已开赛
            2 比赛推迟
            3 比赛取消
            4 比赛取消结算成功
            5 只比上半场
            6 只比上半场结算成功
            7 比赛结束结算成功
            ',
   statusinfo           varchar(30),
   matchtime            timestamp,
   displaytime          timestamp comment '显示给用户时间',
   disappeartime        timestamp comment '用户界面，消失时间',
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_match comment '反波胆比赛';

/*==============================================================*/
/* Table: etick_antiwave_football_welfare_competition_guessing  */
/*==============================================================*/
create table etick_antiwave_football_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   antiwavefootballmatchid int,
   antiwavefootballmatchtype int comment '比赛类型，为2=》福利局',
   type                 int comment '竞猜类型：
            0 全场
            1 半场
            2 角球',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 中奖
            2 未中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_welfare_competition_guessing comment '福利单';

/*==============================================================*/
/* Table: etick_arbitration                                     */
/*==============================================================*/
create table etick_arbitration
(
   id                   int not null auto_increment,
   userid               int,
   theotheruserid       int,
   arbitrationuserid    int,
   description          varchar(2048),
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   ordernumber          varchar(10),
   result               int comment '仲裁结果
            0 提出人胜
            1 对方胜',
   resultinfo           varchar(128),
   leaderarbitrated     bool,
   adminresult          int comment '仲裁结果
            0 提出人胜
            1 对方胜',
   adminresultinfo      varchar(128),
   adminarbitrated      bool,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_arbitration comment '仲裁';

/*==============================================================*/
/* Table: etick_betting_record                                  */
/*==============================================================*/
create table etick_betting_record
(
   id                   int not null auto_increment,
   userid               int,
   ordernumber          varchar(10) comment '订单号',
   type                 int comment '下注类型
            10 足球反波胆
            11 足球反波胆正常竞猜
            12 足球反波胆带单竞猜
            13 足球反波胆福利竞猜
            14 足球反波胆庄家竞猜
            
            20 足球正波胆
            21 足球正波胆正常竞猜
            22 足球正波胆带单竞猜
            23 足球正波胆福利竞猜
            24 足球正波胆庄家竞猜
            
            30 lol
            31 正常竞猜
            32 带单竞猜
            33 福利竞猜
            34 庄家竞猜
            ',
   typeinfo             varchar(30),
   competitionguessingid int,
   bettingeti           float(12,2),
   status               int comment '注单状态
            0 未结算
            1 盈利
            2 亏损
            3 比赛取消
            4 撤销',
   statustype           varchar(30),
   profit               float(12,2),
   bettingtime          timestamp,
   balancetime          timestamp,
   etistatus            int comment '下注eti类型
            0 eti
            1 tasteeti
            2 frozeneti
            什么类型eti下注，收益便是什么类型',
   etistatusinfo        varchar(30),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_betting_record comment '下注记录';

/*==============================================================*/
/* Table: etick_credit_record                                   */
/*==============================================================*/
create table etick_credit_record
(
   id                   int not null auto_increment,
   userid               int,
   type                 int comment '加减信用分类型
            0 注册
            1 买积分
            2 卖积分
            ',
   typeinfo             varchar(30),
   tableid              int comment '这个ID对应的表，根据type类型而定',
   credit               float(5,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_credit_record comment '信用分记录';

/*==============================================================*/
/* Table: etick_direct_buying                                   */
/*==============================================================*/
create table etick_direct_buying
(
   id                   int not null auto_increment,
   userid               int,
   entrustmentsalingid  int,
   eticount             int,
   etiperrmb            float(5,2),
   eti                  float(12,2),
   status               int comment '交易状态
            0 买家锁定
            1 买家打款
            2 卖家确认
            3 买家撤销
            4 卖家撤销
            5 仲裁单
            ',
   statusinfo           varchar(30),
   lockedtime           timestamp,
   paytime              timestamp,
   revoketime           timestamp,
   theothersiderevoketime timestamp,
   theothersideconfirmtime timestamp,
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   creditdescription    varchar(30) comment '一方撤销时，该字段记录扣除信用分相关信息',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_direct_buying comment '直接买入记录';

/*==============================================================*/
/* Table: etick_direct_saling                                   */
/*==============================================================*/
create table etick_direct_saling
(
   id                   int not null auto_increment,
   userid               int,
   entrustmentbuyingid  int,
   eticount             int,
   etiperrmb            float(5,2),
   eti                  float(12,2),
   status               int comment '交易状态
            0 卖家锁定
            1 买家锁定
            2 买家打款
            3 卖家确认
            4 卖家撤销
            5 买家撤销
            6 仲裁单',
   statusinfo           varchar(30),
   lockedtime           timestamp,
   theothersidelockedtime timestamp,
   theothersidepaytime  timestamp,
   revoketime           timestamp,
   theothersiderevoketime timestamp,
   confirmtime          timestamp,
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   creditdescription    varchar(30) comment '一方撤销时，该字段记录扣除信用分相关信息',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_direct_saling comment '直接卖出积分记录';

/*==============================================================*/
/* Table: etick_entrustment_buying                              */
/*==============================================================*/
create table etick_entrustment_buying
(
   id                   int not null auto_increment,
   userid               int,
   eticount             int,
   etiperrmb            float(5,2),
   eti                  float(12,2),
   mineti               int,
   maxeti               int,
   successfuleti        float(12,2),
   lockedeti            float(12,2),
   remaineti            float(12,2),
   status               int comment '挂买积分状态
            0 挂买中
            1 已完成
            2 已撤销',
   statusinfo           varchar(30),
   publishtime          timestamp,
   endtime              timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_entrustment_buying comment '委托买入';

/*==============================================================*/
/* Table: etick_entrustment_saling                              */
/*==============================================================*/
create table etick_entrustment_saling
(
   id                   int not null auto_increment,
   userid               int,
   eticount             int,
   etiperrmb            float(5,2),
   eti                  float(12,2),
   mineti               int,
   maxeti               int,
   successfuleti        float(12,2),
   lockedeti            float(12,2),
   remaineti            float(12,2),
   status               int comment '挂单状态：
            0 正在挂单
            1 完成
            2 撤销',
   statusinfo           varchar(30),
   publicshtime         timestamp,
   endtime              timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_entrustment_saling comment '委托卖出';

/*==============================================================*/
/* Table: etick_eti_record                                      */
/*==============================================================*/
create table etick_eti_record
(
   id                   int not null auto_increment,
   userid               int,
   type                 int comment '积分类型：
            0 注册 +
            1 下注 -
            2 赢注 +
            3 下注撤销 +
            4 带单 -
            5 游戏 -
            6 游戏 +
            7 推荐奖 +
            8 庄家 -
            9 庄家 +
            10 买入积分 +
            11 卖出积分 -
            12 签到 +
            13 抽奖 +
            14 建议采纳 +
            15 领导人分红+',
   typeinfo             varchar(30),
   eti                  float(12,2),
   profittime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_eti_record comment 'eti记录';

/*==============================================================*/
/* Table: etick_football_match_team                             */
/*==============================================================*/
create table etick_football_match_team
(
   id                   int not null auto_increment,
   caption              varchar(30),
   teamlogo             varchar(100) comment '队标，是个路径',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_football_match_team comment '比赛队';

/*==============================================================*/
/* Table: etick_football_match_type                             */
/*==============================================================*/
create table etick_football_match_type
(
   id                   int not null auto_increment,
   caption              varchar(30),
   zonelogo             varchar(100) comment '赛区logo，是个路径',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_football_match_type comment '比赛类型（亚超，世界杯）';

/*==============================================================*/
/* Table: etick_latest_thirty_trade                             */
/*==============================================================*/
create table etick_latest_thirty_trade
(
   id                   int not null auto_increment,
   userid               int,
   intergraltradeid     int,
   status               int comment '交易状态
            0 交易成功
            1 交易失败',
   statusinfo           varchar(30) comment '交易失败详情：
            ',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_latest_thirty_trade comment '最近30天交易，每天第一次登录时更新（删除30天以外记录）
只插入成功的交易和扣自己信用分的失败交易';

/*==============================================================*/
/* Table: etick_leader                                          */
/*==============================================================*/
create table etick_leader
(
   id                   int not null auto_increment,
   userid               int,
   reuniontimes         int comment '蝉联次数',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_leader comment '领导人';

/*==============================================================*/
/* Table: etick_lol_banker                                      */
/*==============================================================*/
create table etick_lol_banker
(
   id                   int not null auto_increment,
   userid               int,
   lolmatchid           int,
   status               int comment '庄家单状态
            0 未开赛
            1 盈利
            2 亏损',
   statusinfo           varchar(30),
   frozeneti            float(12,2),
   profiteti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_banker comment 'lol庄家单';

/*==============================================================*/
/* Table: etick_lol_banker_competition_guessing                 */
/*==============================================================*/
create table etick_lol_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '3 开庄赛事',
   lolmatchid           int,
   type                 int comment '竞猜类型：
            0 输赢竞猜
            1 一血
            2 一塔
            3 一小龙
            4 峡谷先锋
            5 一大龙
            6 总人头数
            7 比赛时长
            ',
   typeinfo             varchar(30),
   competitionguessinfo varchar(30),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 下单人未中奖（不是开庄人）
            2 下单人中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_banker_competition_guessing comment 'lol庄家单竞猜';

/*==============================================================*/
/* Table: etick_lol_competition_guessing                        */
/*==============================================================*/
create table etick_lol_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '0 正常赛事',
   lolmatchid           int,
   type                 int comment '竞猜类型：
            0 输赢竞猜
            1 一血
            2 一塔
            3 一小龙
            4 峡谷先锋
            5 一大龙
            6 总人头数
            7 比赛时长
            
            ',
   typeinfo             varchar(30),
   competitionguessinfo varchar(30),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 未中奖
            2 中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_competition_guessing comment 'lol竞猜';

/*==============================================================*/
/* Table: etick_lol_lead_competition_guessing                   */
/*==============================================================*/
create table etick_lol_lead_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '1 带单赛事',
   userid               int,
   lolmatchid           int,
   lolmatchcompetitionguessingidlist varchar(1024),
   etiperpart           float(12,2),
   count                int,
   status               int comment '方案状态
            0 未开奖
            1 未中奖 ： 收益小于等于投资
            2 中奖 ：收益大于投资
            3 取消',
   statusinfo           varchar(30),
   profitetiperpart     float(12,2),
   profitetitotal       float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_lead_competition_guessing comment 'lol带单';

/*==============================================================*/
/* Table: etick_lol_lead_info                                   */
/*==============================================================*/
create table etick_lol_lead_info
(
   id                   int not null auto_increment,
   userid               int,
   leadmatchtimes       int,
   profittimes          int,
   losstimes            int,
   profitrate           float(12,4),
   profitetitotal       float(12,4),
   followpersoncount    int,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_lead_info comment 'lol带单 人信息';

/*==============================================================*/
/* Table: etick_lol_match                                       */
/*==============================================================*/
create table etick_lol_match
(
   id                   int not null auto_increment,
   caption              varchar(30),
   types                int comment '竞猜类型
            0 正常
            1 带单
            2 福利
            3 开庄',
   typesinfo            varchar(30),
   matchtypeid          int,
   matchteamhostid      int,
   matchteamguestid     int,
   status               int comment '比赛状态：
            0 未开赛
            1 已开赛
            2 比赛推迟
            3 比赛取消
            4 比赛取消结算成功
            5 比赛结束结算成功
            ',
   statusinfo           varchar(30),
   matchtime            timestamp,
   displaytime          timestamp comment '在界面显示时间',
   disappeartime        timestamp comment '从界面消失时间',
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match comment 'lol比赛';

/*==============================================================*/
/* Table: etick_lol_match_team                                  */
/*==============================================================*/
create table etick_lol_match_team
(
   id                   int not null auto_increment,
   caption              varchar(30),
   teamlogo             varchar(100) comment '队标，是个路径',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match_team comment '比赛队';

/*==============================================================*/
/* Table: etick_lol_match_type                                  */
/*==============================================================*/
create table etick_lol_match_type
(
   id                   int not null auto_increment,
   caption              varchar(30),
   zonelogo             varchar(100) comment '赛区logo，是个路径',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match_type comment '比赛类型（lpl,lck,msi..）';

/*==============================================================*/
/* Table: etick_lol_welfare_competition_guessing                */
/*==============================================================*/
create table etick_lol_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '2 福利赛事',
   lolmatchid           int,
   type                 int comment '竞猜类型：
            0 输赢竞猜
            1 一血
            2 一塔
            3 一小龙
            4 峡谷先锋
            5 一大龙
            6 总人头数
            7 比赛时长
            ',
   typeinfo             varchar(30),
   competitionguessinfo varchar(30),
   theodds              float(12,4),
   status               int comment '竞猜状态
            0 未开奖
            1 中奖
            2 未中奖
            3 取消',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_welfare_competition_guessing comment 'lol福利单';

/*==============================================================*/
/* Table: etick_team_profit                                     */
/*==============================================================*/
create table etick_team_profit
(
   id                   int not null auto_increment,
   teamcount            int,
   profitrate           float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_team_profit comment '团队人数对应奖励';

/*==============================================================*/
/* Table: etick_tel_identify                                    */
/*==============================================================*/
create table etick_tel_identify
(
   id                   int not null auto_increment,
   ip                   varchar(15),
   firsttime            timestamp,
   secondtime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_tel_identify comment '获取手机验证码，同一IP每240秒只能获取两个手机验证码';

/*==============================================================*/
/* Table: etick_the_anti_fortune                                */
/*==============================================================*/
create table etick_the_anti_fortune
(
   id                   int not null auto_increment,
   userid               int,
   chipintime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_the_anti_fortune comment '反幸运玩家
不是10的整数倍楼结算
100元档';

/*==============================================================*/
/* Table: etick_the_fortune                                     */
/*==============================================================*/
create table etick_the_fortune
(
   id                   int not null auto_increment,
   userid               int,
   chipintime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_the_fortune comment '幸运玩家
逢2楼结算
100元档';

/*==============================================================*/
/* Table: etick_the_last_one                                    */
/*==============================================================*/
create table etick_the_last_one
(
   id                   int not null auto_increment,
   userid               int,
   chipintime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_the_last_one comment '游戏人生赢家';

/*==============================================================*/
/* Table: etick_the_last_one_record                             */
/*==============================================================*/
create table etick_the_last_one_record
(
   id                   int not null auto_increment,
   userid               int,
   eti                  float(12,2),
   chipintime           timestamp,
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_the_last_one_record comment '人生赢家获奖记录';

/*==============================================================*/
/* Table: etick_user                                            */
/*==============================================================*/
create table etick_user
(
   id                   int not null auto_increment,
   uuid                 varchar(32) comment '系统随机生成32位UUID，邀请人时用',
   username             varchar(30),
   password             varchar(30),
   passwordmd5          varchar(32),
   secondpassword       varchar(30),
   secondpasswordmd5    varchar(32),
   idcard               varchar(18),
   tel                  varchar(11),
   banknum              varchar(30),
   bankname             varchar(60),
   alipaynum            varchar(30),
   eti                  float(12,2),
   frozeneti            float(12.2),
   tasteeti             float(12,2),
   credit               float(5,1) comment '信用分 0-100',
   latestthirtytraderate float(4,2) comment '最近30天交易成交率',
   role                 smallint comment '用户角色
            0 普通用户
            1 管理员',
   status               smallint comment '用户状态
            0 正常
            1 封号',
   statusinfo           varchar(50),
   rankpre              varchar(30),
   teamonecount         int,
   teamcount            int,
   islead               bool comment '是否带单师',
   isleader             bool,
   isbanker             bool,
   registertime         timestamp,
   lastlogintime        timestamp,
   logouttime           timestamp,
   issigntoday          bool,
   invoke               varchar(100) comment '预留接口',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

