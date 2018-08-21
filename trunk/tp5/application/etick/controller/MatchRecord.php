<?php
namespace app\etick\controller;

use think\Controller;
use think\Session;
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

        $antiwaveFootballBettingRecord =
            Db::view('BettingRecord', ['userid', 'etickmatchtype' => 'bettingrecordetickmatchtype', 'ordernumber', 'bettingeti', 'status', 'statusinfo', 'profit', 'bettingtime', 'balancetime', 'etistatus', 'etistatusinfo', 'matchid', 'guessingid'])
            ->where('userid', $userid)
            ->where('bettingrecordetickmatchtype', '=', 0)
            ->view('AntiwaveFootballMatch', ['id' => 'antiwavefootballmatchid', 'caption' => 'matchcaption', 'matchtime', 'matchteamhostid'], 'AntiwaveFootballMatch.id = BettingRecord.matchid')
            ->view('FootballMatchTeam', ['caption' => 'hostteamcaption'], 'FootballMatchTeam.id = AntiwaveFootballMatch.matchteamhostid')
            ->view('AntiwaveFootballCompetitionGuessing', ['id', 'score', 'theodds'], 'AntiwaveFootballCompetitionGuessing.id = BettingRecord.guessingid')
            ->select();

        dump($antiwaveFootballBettingRecord);
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwaveFootballBettingRecord));


    }
}