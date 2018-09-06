<?php

namespace app\etick\api;

use app\etick\model\AntiwaveFootballCompetitionGuessing;
use app\etick\model\User as UserModel;
use app\etick\model\EtiRecord as EtiRecordModel;
use app\etick\model\BettingRecord as BettingRecordModel;
use app\etick\model\EntrustmentPurchase as EntrustmentPurchaseModel;
use app\etick\model\DirectPurchase as DirectPurchaseModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\LolMatch as LolMatchModel;
use app\etick\model\LolCompetitionGuessing as LolCompetitionGuessingModel;
use app\etick\model\AntiwaveLolCompetitionGuessing as AntiwaveLolCompetitionGuessingModel;


use app\etick\api\Util as UtilApi;
use app\etick\api\Times as TimesApi;

class Database{
    static public function AddUser($username, $password, $tel, $registertime, $rankpre){
        $user = new UserModel();
        $user->username = $username;
        $user->password = $password;
        $user->passwordmd5 = md5($password);
        $user->tel = $tel;
        $user->uuid = UtilApi::GetUUID();
        $user->eti = UtilApi::RegisterSendEti() ? 100000 : 0;
        $user->frozeneti = 0.00;
        $user->credit = 80;
        $user->latestthirtytraderate = 1.00;
        $user->role = 0;
        $user->status = 0;
        $user->rankpre = $rankpre;
        $user->teamonecount = 0;
        $user->teamcount = 0;
        $user->isLead = true;
        $user->isleader = false;
        $user->isbanker = false;
        $user->registertime = $registertime;
        $user->issigntoday = false;

        $user->allowField(true)->save();
        return true;
    }

    static public function AddBettingRecord($userid, $bettingmatchtype, $guessingtype, $matchid, $guessingid, $eti, $etistatus, $caption){
        $systemtime = TimesApi::GetSystemTime();

        $bettingrecord = new BettingRecordModel();
        $bettingrecord->userid = $userid;

        $bettingrecord->ordernumber = TimesApi::GetOrderNumber();
        $bettingrecord->bettingmatchtype = $bettingmatchtype;
        $bettingrecord->bettingmatchtypeinfo = Database::GetBettingMatchTypeInfo($bettingmatchtype);
        $bettingrecord->caption = $caption;
        $bettingrecord->guessingtype = $guessingtype;
        $bettingrecord->guessingtypeinfo = Database::GetGuessingTypeInfo($guessingtype);
        $bettingrecord->matchid = $matchid;
        $bettingrecord->guessingid = $guessingid;
        $bettingrecord->bettingeti = $eti;
        $bettingrecord->status = 0;
        $bettingrecord->statusinfo = '未结算';
        $bettingrecord->profit = 0;
        $bettingrecord->bettingtime = $systemtime;
        $bettingrecord->etistatue = $etistatus;
        $bettingrecord->etistatusinfo = Database::GetEtiStatusInfo($etistatus);
        $bettingrecord->bettingresult = 2;
        $bettingrecord->bettingresultinfo = "--";

        $bettingrecord->allowField(true)->save();
    }

    static private function GetBettingMatchTypeInfo($bettingmatchtype){
        $typeinfo = ["足球反波胆", "足球正波胆", "英雄联盟反比分", "英雄联盟正比分", "英雄联盟单场"];

        return $typeinfo[$bettingmatchtype];
    }

    static private function GetGuessingTypeInfo($guessingtype){
        if($guessingtype === 0) return '正常单';
        else if($guessingtype === 1) return '带单';
        else if($guessingtype === 2) return '福利单';
        else if($guessingtype === 3) return '开庄单';
    }

    static private function GetEtiStatusInfo($etistatus){
        if($etistatus === 0) return 'ETI';
        else if($etistatus === 1) return '体验金';
        else if($etistatus === 2) return '冻结金';
    }

    static public function AddEtiRecord($userid, $type, $eti, $systemtime){
//        $systemtime = TimesApi::GetSystemTime();

        $etirecord = new EtiRecordModel();
        $etirecord->userid = $userid;
        $etirecord->type = $type;
        $etirecord->typeinfo = self::GetEtiRecordTypeInfo($type);
        $etirecord->eti = $eti;
        $etirecord->profittime = $systemtime;

        $etirecord->allowField(true)->save();
    }

    static private function GetEtiRecordTypeInfo($type){
        $typeinfo = '';
        switch($type){
            case 0: $typeinfo = '注册'; break;
            case 1: $typeinfo = '下注'; break;
            case 2: $typeinfo = '赢注'; break;
            case 3: $typeinfo = '下注撤销'; break;
            case 4: $typeinfo = '带单'; break;
            case 5: $typeinfo = '下注游戏'; break;
            case 6: $typeinfo = '赢注游戏'; break;
            case 7: $typeinfo = '推荐奖'; break;
            case 8: $typeinfo = '庄家发单'; break;
            case 9: $typeinfo = '庄家赢单'; break;
            case 10: $typeinfo = '买入积分'; break;
            case 11: $typeinfo = '卖出积分'; break;
            case 12: $typeinfo = '签到'; break;
            case 13: $typeinfo = '抽奖'; break;
            case 14: $typeinfo = '建议采纳'; break;
            case 15: $typeinfo = '领导人分红'; break;
            case 16: $typeinfo = '仲裁'; break;
            case 17: $typeinfo = '比赛取消'; break;
            default:break;
        }
        return $typeinfo;
    }

    static public function AddEntrustmentPurchase($userid, $eticount, $rmbpereti, $mineti, $maxeti, $entrustmentType){

        $systemTime = TimesApi::GetSystemTime();
        $ordernumber = TimesApi::GetOrderNumber();

        $entrustmentPurchase = new EntrustmentPurchaseModel();

        $entrustmentPurchase->userid = $userid;
        $entrustmentPurchase->eticount = $eticount;
        $entrustmentPurchase->rmbpereti = $rmbpereti;
        $entrustmentPurchase->eti = $eticount * $rmbpereti;
        $entrustmentPurchase->mineti = $mineti;
        $entrustmentPurchase->maxeti = $maxeti;
        $entrustmentPurchase->successfuleti = 0;
        $entrustmentPurchase->lockedeti = 0;
        $entrustmentPurchase->remaineti = $eticount;
        $entrustmentPurchase->status = 0;
        $entrustmentPurchase->statusinfo = '挂单中';
        $entrustmentPurchase->publishtime = $systemTime;
        $entrustmentPurchase->purchasetype = 0;
        $entrustmentPurchase->entrustmenttype = $entrustmentType;
        $entrustmentPurchase->entrustmenttypeinfo = self::GetEntrustmentTypeInfo($entrustmentType);
        $entrustmentPurchase->ordernumber = $ordernumber;

        $entrustmentPurchase->allowField(true)->save();
    }

    static private function GetEntrustmentTypeInfo($entrustmentType){
        if($entrustmentType === 0) return '挂买';
        else if($entrustmentType === 1) return '挂卖';
    }

    static public function AddDirectPurchase($userid, $anotheruserid, $entrustmentid, $eticount, $rmbpereti, $directType){
        $systemTiem = TimesApi::GetSystemTime();
        $ordernumber = TimesApi::GetOrderNumber();

        $directPurchase = new DirectPurchaseModel();
        $directPurchase->userid = $userid;
        $directPurchase->anotheruserid = $anotheruserid;
        $directPurchase->entrustmentid = $entrustmentid;
        $directPurchase->eticount = $eticount;
        $directPurchase->rmbpereti = $rmbpereti;
        $directPurchase->eti = $eticount * $rmbpereti;
        $directPurchase->status = 0;
        $directPurchase->statusinfo = '已锁定，等待打款';
        $directPurchase->lockedtime = $systemTiem;
        $directPurchase->publishtime = $systemTiem;
        $directPurchase->purchasetype = 1;
        $directPurchase->directtype = $directType;
        $directPurchase->directtypeinfo = self::GetDirectTypeInfo($directType);
        $directPurchase->ordernumber = $ordernumber;

        $directPurchase->allowField(true)->save();
    }

    static private function GetDirectTypeInfo($directType){
        if($directType === 0) return '直接买';
        else if($directType === 1) return '直接卖';
    }

    static public function AddAntiwaveFootballMatch($matchtypeid, $matchteamhostid, $matchteamguestid, $caption, $matchtime, $displaytime, $disappeartime){

        $antiwavefootballmatch = new AntiwaveFootballMatchModel();
        $antiwavefootballmatch->matchtypeid = $matchtypeid;
        $antiwavefootballmatch->matchteamhostid = $matchteamhostid;
        $antiwavefootballmatch->matchteamguestid = $matchteamguestid;
        $antiwavefootballmatch->caption = $caption;
        $antiwavefootballmatch->status = 0;
        $antiwavefootballmatch->statusinfo = '未开赛';
        $antiwavefootballmatch->matchtime = $matchtime;
        $antiwavefootballmatch->displaytime = $displaytime;
        $antiwavefootballmatch->disappeartime = $disappeartime;

        $antiwavefootballmatch->allowField(true)->save();
    }

    static public function AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, $type, $score, $theodds, $totaleti, $frozeneti){
        $antiwavefootballmatchcompetitionguessing = new AntiwaveFootballCompetitionGuessingModel();
        $antiwavefootballmatchcompetitionguessing->matchid = $matchid;
        $antiwavefootballmatchcompetitionguessing->guessingtype = 0;
        $antiwavefootballmatchcompetitionguessing->guessingtypeinfo = '正常赛事';
        $antiwavefootballmatchcompetitionguessing->caption = $caption;
        $antiwavefootballmatchcompetitionguessing->type = $type;
        $antiwavefootballmatchcompetitionguessing->typeinfo = self::GetAntiwaveFootballMatchCompetitionGuessingTypeinfo($type);
        $antiwavefootballmatchcompetitionguessing->score = $score;
        $antiwavefootballmatchcompetitionguessing->theodds = $theodds;
        $antiwavefootballmatchcompetitionguessing->status = 0;
        $antiwavefootballmatchcompetitionguessing->statusinfo = '未开赛';
        $antiwavefootballmatchcompetitionguessing->totaleti = $totaleti;
        $antiwavefootballmatchcompetitionguessing->frozeneti = $frozeneti;
        $antiwavefootballmatchcompetitionguessing->remaineti = $totaleti - $frozeneti;

        $antiwavefootballmatchcompetitionguessing->allowField(true)->save();

    }

    static private function GetAntiwaveFootballMatchCompetitionGuessingTypeinfo($type){
        $typeinfo = ["未开赛", "未中奖", "中奖", "推迟", "只进行上半场", "取消"];
        return $typeinfo[$type];
    }

    static public function AddLolMatch($matchtypeid, $matchteamhostid, $matchteamguestid, $caption, $matchtime, $displaytime, $disappeartime, $matchformat){
        $lolmatch = new LolMatchModel();
        $lolmatch->caption = $caption;
        $lolmatch->matchtypeid = $matchtypeid;
        $lolmatch->matchteamhostid = $matchteamhostid;
        $lolmatch->matchteamguestid = $matchteamguestid;
        $lolmatch->status = 0;
        $lolmatch->statusinfo = '未开奖';
        $lolmatch->matchtime = $matchtime;
        $lolmatch->displaytime = $displaytime;
        $lolmatch->disappeartime = $disappeartime;
        $lolmatch->matchformat = $matchformat;
        $lolmatch->matchformatinfo = self::GetFormatInfoByMatch($matchformat);

        $lolmatch->allowField(true)->save();
    }
    
    static private function GetFormatInfoByMatch($matchformat){
        $matchformatinfo = ["一局", "三局", "五局"];
        return $matchformatinfo[$matchformat];
    }

    static public function AddAntiwaveLolmatchCompetitionGuessing($matchid, $caption, $score, $theodds, $totaleti, $frozeneti){
        $antiwavelolcompetitionguessing = new AntiwaveLolCompetitionGuessingModel();
        $antiwavelolcompetitionguessing->caption = $caption;
        $antiwavelolcompetitionguessing->guessingtype = 1;
        $antiwavelolcompetitionguessing->guessingtypeinfo = '反比分';
        $antiwavelolcompetitionguessing->matchid = $matchid;
        $antiwavelolcompetitionguessing->theodds = $theodds;
        $antiwavelolcompetitionguessing->status = 0;
        $antiwavelolcompetitionguessing->statusinfo = "未开奖";
        $antiwavelolcompetitionguessing->totaleti = $totaleti;
        $antiwavelolcompetitionguessing->frozeneti = $frozeneti;
        $antiwavelolcompetitionguessing->remaineti = $totaleti - $frozeneti;
        $antiwavelolcompetitionguessing->score = $score;

        $antiwavelolcompetitionguessing->allowField(true)->save();
    }

    //暂时没用
    static private function GetLolMatchTypeinfo($type){
        $typeinfo = ["输赢竞猜", "一血", "一塔", "一小龙", "峡谷先锋", "一大龙", "总人头数", "比赛时长", "反比分"];
        return $typeinfo[$type];
    }


}