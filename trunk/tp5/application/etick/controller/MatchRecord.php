<?php
namespace app\etick\controller;

use app\etick\validate\LolCompetitionGuessing;

use think\Controller;
use think\Session;
use think\Request;
use think\Db;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\Database as DatabaseApi;

use app\etick\model\User as UserModel;
use app\etick\model\BettingRecord as BettingRecordModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing as AntiwaveFootballWelfareCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballBankerCompetitionGuessing as AntiwaveFootballBankerCompetitionGuessingModel;
use app\etick\model\LolMatch as LolMatchModel;
use app\etick\model\LolCompetitionGuessing as LolCompetitionGuessingModel;
use app\etick\model\LolLeadCometitionGuessing as LolLeadCompetitionGuessingModel;
use app\etick\model\LolWelfareCompetitionGuessing as LolWelfareCompetitionGuessingModel;
use app\etick\model\LolBankerCompetitionGuessing as LolBankerCompetitionGuessingModel;

class MatchRecord extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch();
    }

    public function GetMatchRecord(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $userid = Session::get('userid');

        $sql = "select * from etick_betting_record where userid = '$userid'";
        $bettingRecord = Db::query($sql);

//        $antiwaveFootballBettingRecord =
//            Db::view('BettingRecord', ['userid', 'etickmatchtype' => 'bettingrecordetickmatchtype', 'ordernumber', 'bettingeti', 'status', 'statusinfo', 'profit', 'bettingtime', 'balancetime', 'etistatus', 'etistatusinfo', 'matchid', 'guessingid'])
//            ->where('userid', $userid)
//            ->where('bettingrecordetickmatchtype', '=', 0)
//            ->view('AntiwaveFootballMatch', ['id' => 'antiwavefootballmatchid', 'caption' => 'matchcaption', 'matchtime', 'matchteamhostid'], 'AntiwaveFootballMatch.id = BettingRecord.matchid')
//            ->view('FootballMatchTeam', ['caption' => 'hostteamcaption'], 'FootballMatchTeam.id = AntiwaveFootballMatch.matchteamhostid')
//            ->view('AntiwaveFootballCompetitionGuessing', ['id', 'score', 'theodds'], 'AntiwaveFootballCompetitionGuessing.id = BettingRecord.guessingid')
//            ->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($bettingRecord));
    }

    public function GetBettingRecordDetailInfo(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $orderNumber = $request->param('ordernumber');

        //获取etickmatchtype
        $bettingrecord = BettingRecordModel::where('ordernumber', $orderNumber)->find();
        if(empty($bettingrecord)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }
        $bettingmatchtype = $bettingrecord->bettingmatchtype;

        $bettingDetailRecord = "";
        if($bettingmatchtype === 0){ //足球反波胆
            $bettingDetailRecord = self::GetAntiwaveFootballBettingDetailRecord($orderNumber);
        }else if($bettingmatchtype === 1){ //足球正波胆
            $bettingDetailRecord = self::GetFootballBettingDetailRecord($orderNumber);
        }else if($bettingmatchtype === 2){ //英雄联盟反比分
            $bettingDetailRecord = self::GetAntiwaveLolBettingDetailRecord($orderNumber);
        }else if($bettingmatchtype === 3){ //英雄联盟正比分
            $bettingDetailRecord = self::GetLolBettingDetailRecord($orderNumber);
        }else if($bettingmatchtype === 4){ //英雄联盟单场
            $bettingDetailRecord = self::GetOneLolBettingDetailRecord($orderNumber);
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($bettingDetailRecord));
    }

    public function GetAntiwaveFootballBettingDetailRecord($orderNumber){

        $sql = "select betting_record.*,
match_team_host.caption as hostcaption,
match_team_guest.caption as guestcaption,
 antiwave_football_match.caption as matchcaption,
 antiwave_football_match.status as matchstatus,
 antiwave_football_match.matchtime as matchtime,
 antiwave_football_match.score as score,
 antiwave_football_match.firsthalfscore as firsthalfscore,
 antiwave_football_match.angle as angle,
 antiwave_football_match.total as total,
 antiwave_football_competition_guessing.theodds as theodds,
 antiwave_football_competition_guessing.caption as guessingcaption
   from (select * from etick_betting_record where ordernumber = '$orderNumber') as betting_record
                join etick_antiwave_football_match as antiwave_football_match on antiwave_football_match.id = betting_record.matchid
                join etick_match_team as match_team_host on match_team_host.id = antiwave_football_match.matchteamhostid
                join etick_match_team as match_team_guest on match_team_guest.id = antiwave_football_match.matchteamguestid
                join etick_antiwave_football_competition_guessing as antiwave_football_competition_guessing on antiwave_football_competition_guessing.id = betting_record.guessingid";

        $bettingRecordDetail = Db::query($sql);

        return $bettingRecordDetail;
    }
    public function GetFootballBettingDetailRecord($orderNumber){

    }
    public function GetAntiwaveLolBettingDetailRecord($orderNumber){
        $sql = "select a.*,
c.caption as hostcaption,
d.caption as guestcaption,
 b.caption as matchcaption,
 b.status as matchstatus,
 b.matchtime as matchtime,
 b.score as score,
 e.theodds as theodds,
 e.caption as guessingcaption
   from (select * from etick_betting_record where ordernumber = '$orderNumber') as a
                join etick_lol_match as b on b.id = a.matchid
                join etick_match_team as c on c.id = b.matchteamhostid
                join etick_match_team as d on d.id = b.matchteamguestid
                join etick_antiwave_lol_competition_guessing as e on e.id = a.guessingid";

        $bettingRecordDetail = Db::query($sql);

        return $bettingRecordDetail;

    }
    public function GetLolBettingDetailRecord($orderNumber){

    }
    public function GetOneLolBettingDetailRecord($orderNumber){

    }

    public function MatchRecordRevert(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $orderNumber = $request->param('ordernumber');


        $bettingrecord = BettingRecordModel::where('ordernumber', $orderNumber)->find();
        if(empty($bettingrecord)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_BETTINGRECORDISNOTEXIST');
        }
        $match = null;
        if($bettingrecord->etickmatchtype === 0){
            $match = AntiwaveFootballMatchModel::get($bettingrecord->matchid);
        }else if($bettingrecord->etickmatchtype === 1){
            $match = LolMatchModel::get($bettingrecord->matchid);
        }
        if(empty($match)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }


        //不可撤销状态
        if($match->status === 0 && $systemTime - $bettingrecord->bettingtime > 5 * 60){ //未开赛，下注超过五分钟
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_FIVEMINUTESOVERBETTINGTIME');
        }else if($match->status === 1){ //已开赛
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHHASALREADYBEGINING');
        } else if($match->status === 3){ //比赛已取消
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHHASALREADYCANCELED');
        } else if($bettingrecord->status === 2){ //比赛已撤销
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHHASALREADYREVERTED');
        }

        //撤销
        //标注撤销状态
        $bettingrecord->status = 2;
        $bettingrecord->statusinfo = '撤单';

        if($match->status === 2){
            $bettingrecord->revertstatus = 1;
            $bettingrecord->revertstatusinfo = '比赛推迟撤销';
        }else if($match->status === 0){
            $bettingrecord->revertstatus = 0;
            $bettingrecord->revertstatusinfo = '正常撤销';
        }

        $bettingrecord->reverttime = $systemTime;
        $bettingrecord->allowField(true)->save();

        //返额度
        $guessing = null;
        $guessingid = $bettingrecord->guessingid;
        switch($bettingrecord->etickmatchtype){
            case 0:
                switch($bettingrecord->guessingtype){
                    case 0:
                        $guessing = AntiwaveFootballCompetitionGuessingModel::get($guessingid);
                        break;
                    case 1:
                        $guessing = AntiwaveFootballLeadCompetitionGuessingModel::get($guessingid);
                        break;
                    case 2:
                        $guessing = AntiwaveFootballWelfareCompetitionGuessingModel::get($guessingid);
                        break;
                    case 3:
                        $guessing = AntiwaveFootballBankerCompetitionGuessingModel::get($guessingid);
                        break;
                    default:
                        return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
                }
                break;
            case 1:
                switch($bettingrecord->guessingtype){
                    case 0:
                        $guessing = LolCompetitionGuessingModel::get($guessingid);
                        break;
                    case 1:
                        $guessing = LolLeadCompetitionGuessingModel::get($guessingid);
                        break;
                    case 2:
                        $guessing = LolWelfareCompetitionGuessingModel::get($guessingid);
                        break;
                    case 3:
                        $guessing = LolBankerCompetitionGuessingModel::get($guessingid);
                        break;
                    default:
                        return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
                }
                break;
            default:
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }
        if(empty($guessing)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_COMPETITIONGUESSINGISNOTEXIST');
        }
        //记录etirecord
        $userid = Session::get('userid');
        DataBaseApi::AddEtiRecord($userid, 3, $bettingrecord->bettingeti, $systemTime);

        //返钱
        $user = UserModel::get($userid);
        $user->eti += $bettingrecord->bettingeti;
        $user->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '撤销成功');
    }
}