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
type = InnoDB
auto_increment = 0;

alter table etick_advice comment '����';

/*==============================================================*/
/* Table: etick_antiwave_football_banker                        */
/*==============================================================*/
create table etick_antiwave_football_banker
(
   id                   int not null auto_increment,
   userid               int,
   antiwavefootballmatchid int,
   status               int comment 'ׯ�ҵ�״̬
            0 δ����
            1 ӯ��
            2 ����',
   statusinfo           varchar(30),
   frozeneti            float(12,2),
   profiteti            float(12,2),
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker comment 'ׯ�ҵ�';

/*==============================================================*/
/* Table: etick_antiwave_football_banker_competition_guessing   */
/*==============================================================*/
create table etick_antiwave_football_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   antiwavefootballbankerid int,
   antiwavefootballmatchtype int comment '�������ͣ�Ϊ3=����ׯ��',
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
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_banker_competition_guessing comment 'ׯ�ҵ�����';

/*==============================================================*/
/* Table: etick_antiwave_football_competition_guessing          */
/*==============================================================*/
create table etick_antiwave_football_competition_guessing
(
   id                   int not null auto_increment,
   antiwavefootballmatchid int,
   antiwavefootballmatchtype int comment '��������������
            0 ��������',
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
type = InnoDB
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
   antiwavefootballmatchid int,
   antiwavefootballcompetitionguessingidlist varchar(1024),
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
   antiwavefootballmatchtype int comment '�������ͣ���ԶΪ1=>��������',
   primary key (id)
)
type = InnoDB
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
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_lead_info comment '������Ϣ
�ɹ��ʣ�������..';

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
   types                int comment '��������������
            0 ����
            1 ����
            2 ����
            3 ��ׯ',
   typesinfo            varchar(30),
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
   matchtime            timestamp,
   displaytime          timestamp comment '��ʾ���û�ʱ��',
   disappeartime        timestamp comment '�û����棬��ʧʱ��',
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_antiwave_football_match comment '����������';

/*==============================================================*/
/* Table: etick_antiwave_football_welfare_competition_guessing  */
/*==============================================================*/
create table etick_antiwave_football_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   antiwavefootballmatchid int,
   antiwavefootballmatchtype int comment '�������ͣ�Ϊ2=��������',
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
type = InnoDB
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
   ordernumber          varchar(10),
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
type = InnoDB
auto_increment = 0;

alter table etick_arbitration comment '�ٲ�';

/*==============================================================*/
/* Table: etick_betting_record                                  */
/*==============================================================*/
create table etick_betting_record
(
   id                   int not null auto_increment,
   userid               int,
   ordernumber          varchar(10) comment '������',
   type                 int comment '��ע����
            10 ���򷴲���
            11 ���򷴲�����������
            12 ���򷴲�����������
            13 ���򷴲�����������
            14 ���򷴲���ׯ�Ҿ���
            
            20 ����������
            21 ������������������
            22 ������������������
            23 ������������������
            24 ����������ׯ�Ҿ���
            
            30 lol
            31 ��������
            32 ��������
            33 ��������
            34 ׯ�Ҿ���
            ',
   typeinfo             varchar(30),
   competitionguessingid int,
   bettingeti           float(12,2),
   status               int comment 'ע��״̬
            0 δ����
            1 ӯ��
            2 ����
            3 ����ȡ��
            4 ����',
   statustype           varchar(30),
   profit               float(12,2),
   bettingtime          timestamp,
   balancetime          timestamp,
   etistatus            int comment '��עeti����
            0 eti
            1 tasteeti
            2 frozeneti
            ʲô����eti��ע���������ʲô����',
   etistatusinfo        varchar(30),
   primary key (id)
)
type = InnoDB
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
type = InnoDB
auto_increment = 0;

alter table etick_credit_record comment '���÷ּ�¼';

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
   status               int comment '����״̬
            0 �������
            1 ��Ҵ��
            2 ����ȷ��
            3 ��ҳ���
            4 ���ҳ���
            5 �ٲõ�
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
   creditdescription    varchar(30) comment 'һ������ʱ�����ֶμ�¼�۳����÷������Ϣ',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_direct_buying comment 'ֱ�������¼';

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
   status               int comment '����״̬
            0 ��������
            1 �������
            2 ��Ҵ��
            3 ����ȷ��
            4 ���ҳ���
            5 ��ҳ���
            6 �ٲõ�',
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
   creditdescription    varchar(30) comment 'һ������ʱ�����ֶμ�¼�۳����÷������Ϣ',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_direct_saling comment 'ֱ���������ּ�¼';

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
   status               int comment '�������״̬
            0 ������
            1 �����
            2 �ѳ���',
   statusinfo           varchar(30),
   publishtime          timestamp,
   endtime              timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_entrustment_buying comment 'ί������';

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
   status               int comment '�ҵ�״̬��
            0 ���ڹҵ�
            1 ���
            2 ����',
   statusinfo           varchar(30),
   publicshtime         timestamp,
   endtime              timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_entrustment_saling comment 'ί������';

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
            15 �쵼�˷ֺ�+',
   typeinfo             varchar(30),
   eti                  float(12,2),
   profittime           timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_eti_record comment 'eti��¼';

/*==============================================================*/
/* Table: etick_football_match_team                             */
/*==============================================================*/
create table etick_football_match_team
(
   id                   int not null auto_increment,
   caption              varchar(30),
   teamlogo             varchar(100) comment '�ӱ꣬�Ǹ�·��',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_football_match_team comment '������';

/*==============================================================*/
/* Table: etick_football_match_type                             */
/*==============================================================*/
create table etick_football_match_type
(
   id                   int not null auto_increment,
   caption              varchar(30),
   zonelogo             varchar(100) comment '����logo���Ǹ�·��',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_football_match_type comment '�������ͣ��ǳ������籭��';

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
type = InnoDB
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
type = InnoDB
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
type = InnoDB
auto_increment = 0;

alter table etick_lol_banker comment 'lolׯ�ҵ�';

/*==============================================================*/
/* Table: etick_lol_banker_competition_guessing                 */
/*==============================================================*/
create table etick_lol_banker_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '3 ��ׯ����',
   lolmatchid           int,
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
   competitionguessinfo varchar(30),
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
type = InnoDB
auto_increment = 0;

alter table etick_lol_banker_competition_guessing comment 'lolׯ�ҵ�����';

/*==============================================================*/
/* Table: etick_lol_competition_guessing                        */
/*==============================================================*/
create table etick_lol_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '0 ��������',
   lolmatchid           int,
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
   competitionguessinfo varchar(30),
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
type = InnoDB
auto_increment = 0;

alter table etick_lol_competition_guessing comment 'lol����';

/*==============================================================*/
/* Table: etick_lol_lead_competition_guessing                   */
/*==============================================================*/
create table etick_lol_lead_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '1 ��������',
   userid               int,
   lolmatchid           int,
   lolmatchcompetitionguessingidlist varchar(1024),
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
type = InnoDB
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
type = InnoDB
auto_increment = 0;

alter table etick_lol_lead_info comment 'lol���� ����Ϣ';

/*==============================================================*/
/* Table: etick_lol_match                                       */
/*==============================================================*/
create table etick_lol_match
(
   id                   int not null auto_increment,
   caption              varchar(30),
   types                int comment '��������
            0 ����
            1 ����
            2 ����
            3 ��ׯ',
   typesinfo            varchar(30),
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
   matchtime            timestamp,
   displaytime          timestamp comment '�ڽ�����ʾʱ��',
   disappeartime        timestamp comment '�ӽ�����ʧʱ��',
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match comment 'lol����';

/*==============================================================*/
/* Table: etick_lol_match_team                                  */
/*==============================================================*/
create table etick_lol_match_team
(
   id                   int not null auto_increment,
   caption              varchar(30),
   teamlogo             varchar(100) comment '�ӱ꣬�Ǹ�·��',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match_team comment '������';

/*==============================================================*/
/* Table: etick_lol_match_type                                  */
/*==============================================================*/
create table etick_lol_match_type
(
   id                   int not null auto_increment,
   caption              varchar(30),
   zonelogo             varchar(100) comment '����logo���Ǹ�·��',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

alter table etick_lol_match_type comment '�������ͣ�lpl,lck,msi..��';

/*==============================================================*/
/* Table: etick_lol_welfare_competition_guessing                */
/*==============================================================*/
create table etick_lol_welfare_competition_guessing
(
   id                   int not null auto_increment,
   caption              varchar(30),
   lolmatchtype         int comment '2 ��������',
   lolmatchid           int,
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
   competitionguessinfo varchar(30),
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
type = InnoDB
auto_increment = 0;

alter table etick_lol_welfare_competition_guessing comment 'lol������';

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

alter table etick_team_profit comment '�Ŷ�������Ӧ����';

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

alter table etick_tel_identify comment '��ȡ�ֻ���֤�룬ͬһIPÿ240��ֻ�ܻ�ȡ�����ֻ���֤��';

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
   chipintime           timestamp,
   primary key (id)
)
type = InnoDB
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
   chipintime           timestamp,
   primary key (id)
)
type = InnoDB
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
   chipintime           timestamp,
   balancetime          timestamp,
   primary key (id)
)
type = InnoDB
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
   idcard               varchar(18),
   tel                  varchar(11),
   banknum              varchar(30),
   bankname             varchar(60),
   alipaynum            varchar(30),
   eti                  float(12,2),
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
   registertime         timestamp,
   lastlogintime        timestamp,
   logouttime           timestamp,
   issigntoday          bool,
   invoke               varchar(100) comment 'Ԥ���ӿ�',
   primary key (id)
)
type = InnoDB
auto_increment = 0;

