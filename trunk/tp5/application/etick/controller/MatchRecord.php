<?php
namespace app\etick\controller;

use think\Controller;
use think\Session;
use think\Request;
use think\Db;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;

use app\etick\model\BettingRecord as BettingRecordModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing as AntiwaveFootballWelfareCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballBankerCompetitionGuessing as AntiwaveFootballBankerCompetitionGuessingModel;
use app\etick\model\FootballMatchTeam as FootballMatchTeamModel;
use app\etick\model\FootballMatchType as FootballMatchTypeModel;

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
antiwave_football_match.caption as matchcaption
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
//        $matchid = $request->param('matchid');
//        $guessingid = $request->param('guessingid');
        $userid = Session::get('userid');

        $sql = "select betting_record.*, football_match_team_host.caption as hostcaption, football_match_team_guest.caption as guestcaption from (select * from etick_betting_record where ordernumber = $orderNumber) as betting_record
                join etick_antiwave_football_match as antiwave_football_match on antiwave_football_match.id = betting_record.matchid
                join etick_football_match_team as football_match_team_host on football_match_team_host.id = antiwave_football_match.matchteamhostid
                join etick_football_match_team as football_match_team_guest on football_match_team_guest.id = antiwave_football_match.matchteamguestid
                join etick_antiwave_football_competition_guessing as antiwave_football_competition_guessing on antiwave_football_competition_guessing.id = betting_record.guessingid";

        $bettingRecordDetail = Db::query($sql);

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($bettingRecordDetail));
    }
}