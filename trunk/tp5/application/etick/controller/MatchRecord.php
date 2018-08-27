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

        $sql = "select betting_record.*, 
football_match_team_host.caption as hostcaption, 
football_match_team_guest.caption as guestcaption,
antiwave_football_match.caption as matchcaption,
antiwave_football_competition_guessing.caption as guessingcaption
from (select * from etick_betting_record where userid = $userid and etickmatchtype = 0) as betting_record
                join etick_antiwave_football_match as antiwave_football_match on antiwave_football_match.id = betting_record.matchid
                join etick_football_match_team as football_match_team_host on football_match_team_host.id = antiwave_football_match.matchteamhostid
                join etick_football_match_team as football_match_team_guest on football_match_team_guest.id = antiwave_football_match.matchteamguestid
                join etick_antiwave_football_competition_guessing as antiwave_football_competition_guessing on antiwave_football_competition_guessing.id = betting_record.guessingid";


        $antiwaveFootballBettingRecord = Db::query($sql);

//        $antiwaveFootballBettingRecord =
//            Db::view('BettingRecord', ['userid', 'etickmatchtype' => 'bettingrecordetickmatchtype', 'ordernumber', 'bettingeti', 'status', 'statusinfo', 'profit', 'bettingtime', 'balancetime', 'etistatus', 'etistatusinfo', 'matchid', 'guessingid'])
//            ->where('userid', $userid)
//            ->where('bettingrecordetickmatchtype', '=', 0)
//            ->view('AntiwaveFootballMatch', ['id' => 'antiwavefootballmatchid', 'caption' => 'matchcaption', 'matchtime', 'matchteamhostid'], 'AntiwaveFootballMatch.id = BettingRecord.matchid')
//            ->view('FootballMatchTeam', ['caption' => 'hostteamcaption'], 'FootballMatchTeam.id = AntiwaveFootballMatch.matchteamhostid')
//            ->view('AntiwaveFootballCompetitionGuessing', ['id', 'score', 'theodds'], 'AntiwaveFootballCompetitionGuessing.id = BettingRecord.guessingid')
//            ->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwaveFootballBettingRecord));
    }

    public function GetBettingRecordDetailInfo(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $orderNumber = $request->param('ordernumber');


        $sql = "select betting_record.*,
 football_match_team_host.caption as hostcaption,
 football_match_team_guest.caption as guestcaption,
 antiwave_football_match.caption as matchcaption,
 antiwave_football_match.status as matchstatus,
 antiwave_football_match.matchtime as matchtime,
 antiwave_football_competition_guessing.theodds as theodds,
 antiwave_football_competition_guessing.caption as guessingcaption
   from (select * from etick_betting_record where ordernumber = $orderNumber) as betting_record
                join etick_antiwave_football_match as antiwave_football_match on antiwave_football_match.id = betting_record.matchid
                join etick_football_match_team as football_match_team_host on football_match_team_host.id = antiwave_football_match.matchteamhostid
                join etick_football_match_team as football_match_team_guest on football_match_team_guest.id = antiwave_football_match.matchteamguestid
                join etick_antiwave_football_competition_guessing as antiwave_football_competition_guessing on antiwave_football_competition_guessing.id = betting_record.guessingid";

        $bettingRecordDetail = Db::query($sql);

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($bettingRecordDetail));
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


        if($bettingrecord->status === 0){
            //比赛已开始或下注超过五分钟
            if($match->matchtime < $systemTime){
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHHASALREADYBEGINING');
            }else if($systemTime - $bettingrecord->bettingtime > 5 * 60){
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_FIVEMINUTESOVERBETTINGTIME');
            }
        }else if($bettingrecord->status !== 1){
            //比赛不可撤销状态
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_CANTREVERT');
        }

        //撤销
        //标注撤销状态
        $bettingrecord->status = 6;
        $bettingrecord->statusinfo = '撤销';
        $bettingrecord->revertstatus = 0;
        $bettingrecord->revertstatusinfo = '正常撤销';
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
        DataBaseApi::AddEtiRecord($userid, 3, $bettingrecord->bettingeti);

        //返钱
        $user = UserModel::get($userid);
        $user->eti += $bettingrecord->bettingeti;
        $user->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '撤销成功');
    }
}