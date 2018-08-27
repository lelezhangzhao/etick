/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2018/8/27 14:11:32                           */
/*==============================================================*/


drop table if exists etick_advice;

drop table if exists etick_antiwave_football_banker;

drop table if exists etick_antiwave_football_banker_competition_guessing;

drop table if exists etick_antiwave_football_competition_guessing;

drop table if exists etick_antiwave_football_lead_competition_guessing;

drop table if exists etick_antiwave_football_lead_info;

drop table if exists etick_antiwave_football_match;

drop table if exists etick_antiwave_football_welfare_competition_guessing

drop table if exists etick_arbitration;

drop table if exists etick_betting_record;

drop table if exists etick_credit_record;

drop table if exists etick_direct_purchase;

drop table if exists etick_entrustment_purchase;

drop table if exists etick_eti_record;

drop table if exists etick_etick_match_type;

drop table if exists etick_latest_thirty_trade;

drop table if exists etick_leader;

drop table if exists etick_lol_banker;

drop table if exists etick_lol_banker_competition_guessing;

drop table if exists etick_lol_competition_guessing;

drop table if exists etick_lol_lead_competition_guessing;

drop table if exists etick_lol_lead_info;

drop table if exists etick_lol_match;

drop table if exists etick_lol_welfare_competition_guessing;

drop table if exists etick_match_team;

drop table if exists etick_match_type;

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
   updatetime           timestamp,
   advicetime           datetime,
   status               int comment '����״̬
            0 δ��
            1 δ����
            2 �Ѳ���',
   statusinfo           varchar(30),
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_advice comment '����';

/*==============================================================*/
/* Table: etick_antiwave_football_banker                        */
/*==============================================================*/
create table etick_antiwave_football_banker
(
   id                   int not null auto_increment,
   userid               int,
   matchid              int,
   status               int comment 'ׯ�ҵ�״̬
            0 δ����
            1 ӯ��
            2 ����',
   statusinfo           varchar(30),
   frozeneti            float(12,2),
   profiteti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker comment 'ׯ�ҵ�';

/*==============================================================*/
/* Table: etick_antiwave_football_banker_competition_guessing   */
/*==============================================================*/
create table etick_antiwave_football_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   bankerid             int,
   guessingtype         int comment '�������ͣ�Ϊ3=����ׯ��',
   guessingtypeinfo     varchar(30),
   type                 int comment '�������ͣ�
            0 ȫ��
            1 �볡
            2 ����',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 �µ���δ�н������ǿ�ׯ�ˣ�
            2 �µ����н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker_competition_guessing comment 'ׯ�ҵ�����';

/*==============================================================*/
/* Table: etick_antiwave_football_competition_guessing          */
/*==============================================================*/
create table etick_antiwave_football_competition_guessing
(
   id                   int not null auto_increment,
   matchid              int,
   guessingtype         int comment '��������������
            0 ��������',
   guessingtypeinfo     varchar(30),
   caption              varchar(30),
   type                 int comment '�������ͣ�
            0 ȫ��
            1 �볡
            2 ����',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 δ�н�
            2 �н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2) comment '����eti
            �����õģ����Ჿ�ֿ�Ͷ��ȣ�����ʱ��Ҫ�㵽��Ͷ�����
            ',
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_competition_guessing comment '���¾���';

/*==============================================================*/
/* Table: etick_antiwave_football_lead_competition_guessing     */
/*==============================================================*/
create table etick_antiwave_football_lead_competition_guessing
(
   id                   int not null auto_increment,
   userid               int,
   caption              varchar(30),
   type                 int comment '�������ͣ�
            0 ȫ��
            1 �볡
            2 ����',
   typeinfo             varchar(30),
   guessingtype         int comment '�������ͣ���ԶΪ1=>��������',
   guessingtypeinfo     varchar(30),
   matchid              int,
   guessingidlist       varchar(1024),
   etiperpart           float(12,2) comment 'һ�ݷ�������eti',
   count                int comment '��ע�˷�������',
   status               int comment '����״̬
            0 δ����
            1 δ�н� �� ����С�ڵ���Ͷ��
            2 �н� ���������Ͷ��
            3 ȡ��',
   statusinfo           varchar(30),
   profitetiperpart     float(12,2) comment 'ÿ�ݾ�����
            
            δ�н�Ϊ��
            �н�Ϊ�� ',
   profitetitotal       float(12,2) comment '���� �˷ֵ�������',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_lead_competition_guessing comment '������ֻ��Ӯ��������������ע�˷ֳ�
ÿһ�ݽ������Ͷ�� 
ÿһ�ݽ���ֳɺ����Ͷ��
';

/*==============================================================*/
/* Table: etick_antiwave_football_lead_info                     */
/*==============================================================*/
create table etick_antiwave_football_lead_info
(
   id                   int not null auto_increment,
   userid               int,
   leadmatchtimes       int comment '������ ��',
   profittimes          int comment 'ӯ������',
   losstimes            int comment '���𳡴�',
   profitrate           float(12,4) comment 'ӯ����',
   profitetitotal       float(12,2) comment '������ӯ��',
   followpersoncount    int comment '�ܸ����˴�',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_lead_info comment '������Ϣ
�ɹ��ʣ�������..';

/*==============================================================*/
/* Table: etick_antiwave_football_match                         */
/*==============================================================*/
create table etick_antiwave_football_match
(
   id                   int not null auto_increment,
   matchtypeid          int comment '�������ͣ��г����ǹ�',
   matchteamhostid      int,
   matchteamguestid     int,
   caption              varchar(30),
   status               int comment '����״̬��
            0 δ����
            1 �ѿ���
            2 �����Ƴ�
            3 ����ȡ��
            4 ����ȡ������ɹ�
            5 ֻ���ϰ볡
            6 ֻ���ϰ볡����ɹ�
            7 ������������ɹ�
            ',
   statusinfo           varchar(30),
   updatetime           timestamp,
   matchtime            datetime,
   displaytime          datetime comment '��ʾ���û�ʱ��',
   disappeartime        datetime comment '�û����棬��ʧʱ��',
   balancetime          datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_match comment '����������';

/*==============================================================*/
/* Table: etick_antiwave_football_welfare_competition_guessing  */
/*==============================================================*/
create table etick_antiwave_football_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   matchid              int,
   guessingtype         int comment '�������ͣ�Ϊ2=��������',
   guessingtypeinfo     varchar(30),
   type                 int comment '�������ͣ�
            0 ȫ��
            1 �볡
            2 ����',
   typeinfo             varchar(30),
   score                varchar(10),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 �н�
            2 δ�н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_welfare_competition_guessing comment '������';

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
   ordernumber          varchar(20),
   result               int comment '�ٲý��
            0 �����ʤ
            1 �Է�ʤ',
   resultinfo           varchar(128),
   leaderarbitrated     bool,
   adminresult          int comment '�ٲý��
            0 �����ʤ
            1 �Է�ʤ',
   adminresultinfo      varchar(128),
   adminarbitrated      bool,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_arbitration comment '�ٲ�';

/*==============================================================*/
/* Table: etick_betting_record                                  */
/*==============================================================*/
create table etick_betting_record
(
   id                   int not null auto_increment,
   userid               int,
   ordernumber          varchar(20) comment '������',
   etickmatchtype       int comment 'ƽ̨���� ����
            
            0 ������
            1 LOL',
   etickmatchtypeinfo   varchar(30),
   guessingtype         int comment '��������
            0 ����
            1 ����
            2 ����
            3 ��ׯ',
   guessingtypeinfo     varchar(30),
   matchid              int,
   guessingid           int,
   bettingeti           float(12,2),
   status               int comment 'ע��״̬
            0 δ����
            1 �����Ƴ�
            2 ����ȡ��
            3 �ѿ�����δ����
            4 ֻ�����ϰ볡������ 
            5 ������������
            6 ����
            ',
   statusinfo           varchar(30),
   profit               float(12,2),
   updatetime           timestamp,
   bettingtime          datetime,
   balancetime          datetime,
   canceltime           datetime comment '����ȡ��ʱ��',
   reverttime           datetime,
   revertstatus         int comment '����ԭ��
            0 ��������
            1 �����Ƴٳ���
            ',
   revertstatusinfo     varchar(30),
   etistatus            int comment '��עeti����
            0 eti
            1 tasteeti
            2 frozeneti
            ʲô����eti��ע���������ʲô����',
   etistatusinfo        varchar(30),
   bettingresult        int comment '���½��
            0 ӯ��
            1 ����
            2 --',
   bettingresultinfo    varchar(30),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_betting_record comment '��ע��¼';

/*==============================================================*/
/* Table: etick_credit_record                                   */
/*==============================================================*/
create table etick_credit_record
(
   id                   int not null auto_increment,
   userid               int,
   type                 int comment '�Ӽ����÷�����
            0 ע��
            1 �����
            2 ������
            ',
   typeinfo             varchar(30),
   tableid              int comment '���ID��Ӧ�ı�����type���Ͷ���',
   credit               float(5,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_credit_record comment '���÷ּ�¼';

/*==============================================================*/
/* Table: etick_direct_purchase                                 */
/*==============================================================*/
create table etick_direct_purchase
(
   id                   int not null auto_increment,
   userid               int,
   anotheruserid        int,
   entrustmentid        int,
   eticount             int,
   rmbpereti            float(5,2),
   eti                  float(12,2),
   status               int comment '����״̬
            0 ���������ȴ����
            1 �Ѵ��ȴ�ȷ��
            2 �������
            3 �����룬ϵͳ����
            4 �������룬ϵͳ����
            
            ',
   statusinfo           varchar(30),
   updatetime           timestamp,
   publishtime          datetime,
   lockedtime           datetime,
   paytime              datetime,
   reverttime           datetime,
   confirmtime          datetime,
   proofone             varchar(128),
   prooftwo             varchar(128),
   proofthree           varchar(128),
   proofhasuploaded     bool,
   description          varchar(30) comment 'һ������ʱ�����ֶμ�¼�۳����÷������Ϣ',
   directtype           int comment '0 ֱ����
            1 ֱ����
            ',
   directtypeinfo       varchar(30),
   ordernumber          varchar(20),
   purchasetype         int comment '1 direct
            ',
   pruchasetypeinfo     varchar(30),
   directpurchasestatus int comment '        // 0 ��������
                    // 1 ������
                    // 2 ����ȷ��
                    // 3 ������ҳ���
                    // 4 �������ҳ���
                    // 5 ֱ��������
                    // 6 ֱ������
                    // 7 ֱ����ȷ��
                    // 8 ֱ������ҳ���
                    // 9 ֱ�������ҳ���
                    // 10 ��������
                    // 11 �������
                    // 12 ����ȷ��
                    // 13 ������ҳ���
                    // 14 �������ҳ���
                    // 15 ֱ��������
                    // 16 ֱ�������
                    // 17 ֱ����ȷ��
                    // 18 ֱ������ҳ���
                    // 19 ֱ�������ҳ���
            ',
   directpurchasestatusinfo varchar(30),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_direct_purchase comment 'ֱ�ӽ��� ��¼';

/*==============================================================*/
/* Table: etick_entrustment_purchase                            */
/*==============================================================*/
create table etick_entrustment_purchase
(
   id                   int not null auto_increment,
   userid               int,
   eticount             int,
   rmbpereti            float(5,2),
   eti                  float(12,2),
   mineti               int,
   maxeti               int,
   successfuleti        float(12,2),
   status               int comment '�������״̬
            0 �ҵ���
            1 �����
            2 �ѳ���
            3 �ҵ��У���ʣ����',
   statusinfo           varchar(30),
   remaineti            float(12,2),
   updatetime           timestamp,
   publishtime          datetime,
   endtime              datetime,
   entrustmenttype      int comment '0 ����
            1 ����',
   entrustmenttypeifo   varchar(30),
   ordernumber          varchar(20),
   purchasetype         int comment '0 entrustment
            ',
   pruchasetypeinfo     varchar(30),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_entrustment_purchase comment 'ί�н���';

/*==============================================================*/
/* Table: etick_eti_record                                      */
/*==============================================================*/
create table etick_eti_record
(
   id                   int not null auto_increment,
   userid               int,
   type                 int comment '�������ͣ�
            0 ע�� +
            1 ��ע -
            2 Ӯע +
            3 ��ע���� +
            4 ���� -
            5 ��Ϸ -
            6 ��Ϸ +
            7 �Ƽ��� +
            8 ׯ�� -
            9 ׯ�� +
            10 ������� +
            11 �������� -
            12 ǩ�� +
            13 �齱 +
            14 ������� +
            15 �쵼�˷ֺ�+
            16 �ٲ�+-
            ',
   typeinfo             varchar(30),
   eti                  float(12,2),
   updatetime           timestamp,
   profittime           datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_eti_record comment 'eti��¼';

/*==============================================================*/
/* Table: etick_etick_match_type                                */
/*==============================================================*/
create table etick_etick_match_type
(
   id                   int not null auto_increment,
   etickmatchtypeinfo   varchar(30) comment '1 ���򷵲���
            2 Ӣ�����˷�����',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_etick_match_type comment '��������
';

/*==============================================================*/
/* Table: etick_latest_thirty_trade                             */
/*==============================================================*/
create table etick_latest_thirty_trade
(
   id                   int not null auto_increment,
   userid               int,
   intergraltradeid     int,
   status               int comment '����״̬
            0 ���׳ɹ�
            1 ����ʧ��',
   statusinfo           varchar(30) comment '����ʧ�����飺
            ',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_latest_thirty_trade comment '���30�콻�ף�ÿ���һ�ε�¼ʱ���£�ɾ��30�������¼��
ֻ����ɹ��Ľ��׺Ϳ��Լ����÷ֵ�ʧ�ܽ���';

/*==============================================================*/
/* Table: etick_leader                                          */
/*==============================================================*/
create table etick_leader
(
   id                   int not null auto_increment,
   userid               int,
   reuniontimes         int comment '��������',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_leader comment '�쵼��';

/*==============================================================*/
/* Table: etick_lol_banker                                      */
/*==============================================================*/
create table etick_lol_banker
(
   id                   int not null auto_increment,
   userid               int,
   lolmatchid           int,
   status               int comment 'ׯ�ҵ�״̬
            0 δ����
            1 ӯ��
            2 ����',
   statusinfo           varchar(30),
   frozeneti            float(12,2),
   profiteti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_banker comment 'lolׯ�ҵ�';

/*==============================================================*/
/* Table: etick_lol_banker_competition_guessing                 */
/*==============================================================*/
create table etick_lol_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   guessingtype         int comment '3 ��ׯ����',
   guessingtypeinfo     varchar(30),
   matchid              int,
   type                 int comment '�������ͣ�
            0 ��Ӯ����
            1 һѪ
            2 һ��
            3 һС��
            4 Ͽ���ȷ�
            5 һ����
            6 ����ͷ��
            7 ����ʱ��
            ',
   typeinfo             varchar(30),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 �µ���δ�н������ǿ�ׯ�ˣ�
            2 �µ����н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_banker_competition_guessing comment 'lolׯ�ҵ�����';

/*==============================================================*/
/* Table: etick_lol_competition_guessing                        */
/*==============================================================*/
create table etick_lol_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   guessingtype         int comment '0 ��������',
   guessingtypeinfo     varchar(30),
   matchid              int,
   type                 int comment '�������ͣ�
            0 ��Ӯ����
            1 һѪ
            2 һ��
            3 һС��
            4 Ͽ���ȷ�
            5 һ����
            6 ����ͷ��
            7 ����ʱ��
            
            ',
   typeinfo             varchar(30),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 δ�н�
            2 �н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_competition_guessing comment 'lol����';

/*==============================================================*/
/* Table: etick_lol_lead_competition_guessing                   */
/*==============================================================*/
create table etick_lol_lead_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   guessingtype         int comment '1 ��������',
   guessingtypeinfo     varchar(30),
   userid               int,
   matchid              int,
   guessingidlist       varchar(1024),
   etiperpart           float(12,2),
   count                int,
   status               int comment '����״̬
            0 δ����
            1 δ�н� �� ����С�ڵ���Ͷ��
            2 �н� ���������Ͷ��
            3 ȡ��',
   statusinfo           varchar(30),
   profitetiperpart     float(12,2),
   profitetitotal       float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_lead_competition_guessing comment 'lol����';

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
engine = InnoDB
auto_increment = 0;

alter table etick_lol_lead_info comment 'lol���� ����Ϣ';

/*==============================================================*/
/* Table: etick_lol_match                                       */
/*==============================================================*/
create table etick_lol_match
(
   id                   int not null auto_increment,
   caption              varchar(30),
   guessingtypes        int comment '��������
            0 ����
            1 ����
            2 ����
            3 ��ׯ',
   guessingtypesinfo    varchar(30),
   matchtypeid          int,
   matchteamhostid      int,
   matchteamguestid     int,
   status               int comment '����״̬��
            0 δ����
            1 �ѿ���
            2 �����Ƴ�
            3 ����ȡ��
            4 ����ȡ������ɹ�
            5 ������������ɹ�
            ',
   statusinfo           varchar(30),
   updatetime           timestamp,
   matchtime            datetime,
   displaytime          datetime comment '�ڽ�����ʾʱ��',
   disappeartime        datetime comment '�ӽ�����ʧʱ��',
   balancetime          datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_match comment 'lol����';

/*==============================================================*/
/* Table: etick_lol_welfare_competition_guessing                */
/*==============================================================*/
create table etick_lol_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   guessingtype         int comment '2 ��������',
   guessingtypeinfo     varchar(30),
   matchid              int,
   type                 int comment '�������ͣ�
            0 ��Ӯ����
            1 һѪ
            2 һ��
            3 һС��
            4 Ͽ���ȷ�
            5 һ����
            6 ����ͷ��
            7 ����ʱ��
            ',
   typeinfo             varchar(30),
   theodds              float(12,4),
   status               int comment '����״̬
            0 δ����
            1 �н�
            2 δ�н�
            3 ȡ��',
   statusinfo           varchar(30),
   totaleti             float(12,2),
   frozeneti            float(12,2),
   remaineti            float(12,2),
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_lol_welfare_competition_guessing comment 'lol������';

/*==============================================================*/
/* Table: etick_match_team                                      */
/*==============================================================*/
create table etick_match_team
(
   id                   int not null auto_increment,
   caption              varchar(30),
   teamlogo             varchar(100) comment '�ӱ꣬�Ǹ�·��',
   etickmatchtypeid     int,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_match_team comment '������';

/*==============================================================*/
/* Table: etick_match_type                                      */
/*==============================================================*/
create table etick_match_type
(
   id                   int not null auto_increment,
   caption              varchar(30),
   zonelogo             varchar(100) comment '����logo���Ǹ�·��',
   etickmatchtypeid     int,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_match_type comment '�������ͣ��ǳ������籭��';

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
engine = InnoDB
auto_increment = 0;

alter table etick_team_profit comment '�Ŷ�������Ӧ����';

/*==============================================================*/
/* Table: etick_tel_identify                                    */
/*==============================================================*/
create table etick_tel_identify
(
   id                   int not null auto_increment,
   ip                   varchar(15),
   updatetime           timestamp,
   firsttime            datetime,
   secondtime           datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_tel_identify comment '��ȡ�ֻ���֤�룬ͬһIPÿ240��ֻ�ܻ�ȡ�����ֻ���֤��';

/*==============================================================*/
/* Table: etick_the_anti_fortune                                */
/*==============================================================*/
create table etick_the_anti_fortune
(
   id                   int not null auto_increment,
   userid               int,
   updatetime           timestamp,
   chipintime           datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_the_anti_fortune comment '���������
����10��������¥����
100Ԫ��';

/*==============================================================*/
/* Table: etick_the_fortune                                     */
/*==============================================================*/
create table etick_the_fortune
(
   id                   int not null auto_increment,
   userid               int,
   updatetime           timestamp,
   chipintime           datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_the_fortune comment '�������
��2¥����
100Ԫ��';

/*==============================================================*/
/* Table: etick_the_last_one                                    */
/*==============================================================*/
create table etick_the_last_one
(
   id                   int not null auto_increment,
   userid               int,
   updatetime           timestamp,
   chipintime           datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_the_last_one comment '��Ϸ����Ӯ��';

/*==============================================================*/
/* Table: etick_the_last_one_record                             */
/*==============================================================*/
create table etick_the_last_one_record
(
   id                   int not null auto_increment,
   userid               int,
   eti                  float(12,2),
   updatetime           timestamp,
   chipintime           datetime,
   balancetime          datetime,
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

alter table etick_the_last_one_record comment '����Ӯ�һ񽱼�¼';

/*==============================================================*/
/* Table: etick_user                                            */
/*==============================================================*/
create table etick_user
(
   id                   int not null auto_increment,
   uuid                 varchar(32) comment 'ϵͳ�������32λUUID��������ʱ��',
   username             varchar(30),
   password             varchar(30),
   passwordmd5          varchar(32),
   secondpassword       varchar(30),
   secondpasswordmd5    varchar(32),
   name                 varchar(30),
   idcard               varchar(18),
   tel                  varchar(11),
   banknum              varchar(30),
   bankname             varchar(60),
   alipaynum            varchar(30),
   eti                  float(12,2),
   etiforsaling         float(12,2) comment '������eti',
   frozeneti            float(12.2),
   tasteeti             float(12,2),
   credit               float(5,1) comment '���÷� 0-100',
   latestthirtytraderate float(4,2) comment '���30�콻�׳ɽ���',
   role                 smallint comment '�û���ɫ
            0 ��ͨ�û�
            1 ����Ա',
   status               smallint comment '�û�״̬
            0 ����
            1 ���',
   statusinfo           varchar(50),
   rankpre              varchar(30),
   teamonecount         int,
   teamcount            int,
   islead               bool comment '�Ƿ����ʦ',
   isleader             bool,
   isbanker             bool,
   updatetime           timestamp,
   registertime         datetime,
   lastlogintime        datetime,
   logouttime           datetime,
   issigntoday          bool,
   invoke               varchar(100) comment 'Ԥ���ӿ�',
   primary key (id)
)
engine = InnoDB
auto_increment = 0;

