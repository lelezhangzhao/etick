<?php

namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Db;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;
use app\etick\api\Database as DatabaseApi;

use app\etick\model\EtickMatchType as EtickmatchTypeModel;
use app\etick\model\MatchType as MatchTypeModel;
use app\etick\model\MatchTeam as MatchTeamModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;

class Admin extends Controller
{
    public function Index()
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        return $this->fetch();
    }

    public function GetEtickMatchType()
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

//        $json_arr = [0 => "足球返波胆", 1 => "英雄联盟返波胆"];
        $matchtype = EtickMatchTypeModel::all();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetMatchType(Request $request)
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchtype = MatchTypeModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetHostAndGuestTeam(Request $request)
    {

        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchteam = MatchTeamModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchteam));
    }

    public function AddAntiwaveFootballMatch(Request $request)
    {
//        matchtypeid:matchtypeid,
//                    hostteamid:hostteamid,
//                    guestteamid:guestteamid,
//                    matchcaption:matchcaption,
//                    scoreHole:scoreHole,
//                    scoreHalf:scoreHalf,
//                    scoreAngle:scoreAngle,
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $matchtypeid = $request->param('matchtypeid');
        $hostteamid = $request->param('hostteamid');
        $guestteamid = $request->param('guestteamid');
        $matchcaption = $request->param('matchcaption');
        $matchtime = $request->param('matchtime');
        $displaytime = $request->param('displaytime');
        $disappeartime = $request->param('disappeartime');
        $scoreHole = $request->param('scoreHole');
        $scoreHalf = $request->param('scoreHalf');
        $scoreAngle = $request->param('scoreAngle');

        $hostmatchteam = MatchTeamModel::get($hostteamid);
        $guestmatchteam = MatchTeamModel::get($guestteamid);

        $hostmatchteamcaption = $hostmatchteam->caption;
        $guestmatchteamcaption = $guestmatchteam->caption;
        //新增比赛
        DatabaseApi::AddAntiwaveFootballMatch($matchtypeid, $hostteamid, $guestteamid, $matchcaption, $matchtime, $displaytime, $disappeartime);

        $sql = 'select * from etick_antiwave_football_match order by id desc limit 1';
        $match = Db::query($sql);
        $matchid = $match[0]['id'];

        $scoreHole = preg_replace('/_/', ':', $scoreHole);
        $arr_scorehole = json_decode($scoreHole);

        $scoreHalf = preg_replace('/_/', ':', $scoreHalf);
        $arr_scorehalf = json_decode($scoreHalf);

        $arr_scoreangle = json_decode($scoreAngle);
//        $arr = [
//'{"score":"3_0","theodds":"5%"}',
//'{"score":"3_1","theodds":"5%"}',
//'{"score":"3_2","theodds":"5%"}',
//'{"score":"3_3","theodds":"5%"}',
//'{"score":"2_3","theodds":"5%"}',
//'{"score":"2_2","theodds":"5%"}',
//'{"score":"2_1","theodds":"5%"}',
//'{"score":"2_0","theodds":"5%"}',
//'{"score":"1_3","theodds":"5%"}',
//'{"score":"1_2","theodds":"5%"}',
//'{"score":"1_1","theodds":"5%"}',
//'{"score":"1_0","theodds":"5%"}',
//'{"score":"0_3","theodds":"5%"}',
//'{"score":"0_2","theodds":"5%"}',
//'{"score":"0_1","theodds":"5%"}',
//'{"score":"0_0","theodds":"5%"}'
//];
//
//        $json_arr = json_encode($arr);
//
//        $a = json_decode($json_arr);

        if (is_array($arr_scorehole)) {
            foreach ($arr_scorehole as $scorehole) {
//                $arr_hole = json_decode($json_hole);
                $score = $scorehole->score;
                $theodds = $scorehole->theodds;
                $totaleti = $scorehole->totaleti;
                $frozeneti = $scorehole->frozeneti;

                $caption = $hostmatchteamcaption . ' VS ' . $guestmatchteamcaption . '全场' . $score;

                //新增竞猜
                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 0, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        if (is_array($arr_scorehalf)) {
            foreach ($arr_scorehalf as $scorehalf) {
                $score = $scorehalf->score;
                $theodds = $scorehalf->theodds;
                $totaleti = $scorehalf->totaleti;
                $frozeneti = $scorehalf->frozeneti;

                $caption = $hostmatchteamcaption . 'VS' . $guestmatchteamcaption . '半场' . $score;
                //新增竞猜
                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 1, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        if (is_array($arr_scoreangle)) {
            foreach ($arr_scoreangle as $scoreangle) {
                $score = $scoreangle->score;
                $theodds = $scoreangle->theodds;
                $totaleti = $scoreangle->totaleti;
                $frozeneti = $scoreangle->frozeneti;

                $caption = $hostmatchteamcaption . 'VS' . $guestmatchteamcaption . '角球' . $score;

                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 2, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '添加成功');
    }

    public function AddLolMatch(Request $request)
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $matchtypeid = $request->param('matchtypeid');
        $hostteamid = $request->param('hostteamid');
        $guestteamid = $request->param('guestteamid');
        $matchcaption = $request->param('matchcaption');
        $matchtime = $request->param('matchtime');
        $displaytime = $request->param('displaytime');
        $disappeartime = $request->param('disappeartime');
        $antiscore = $request->param('antiscore');

        $hostmatchteam = MatchTeamModel::get($hostteamid);
        $guestmatchteam = MatchTeamModel::get($guestteamid);

        $hostmatchteamcaption = $hostmatchteam->caption;
        $guestmatchteamcaption = $guestmatchteam->caption;
        //新增比赛
        DatabaseApi::AddLolMatch($matchtypeid, $hostteamid, $guestteamid, $matchcaption, $matchtime, $displaytime, $disappeartime);

        $sql = 'select * from etick_antiwave_football_match order by id desc limit 1';
        $match = Db::query($sql);
        $matchid = $match[0]['id'];

        $antiscore = preg_replace('/_/', ':', $antiscore);
        $arr_antiscore = json_decode($antiscore);

        if (is_array($arr_antiscore)) {
            foreach ($arr_antiscore as $antiscore) {
                $score = $antiscore->score;
                $theodds = $antiscore->theodds;
                $totaleti = $antiscore->totaleti;
                $frozeneti = $antiscore->frozeneti;

                $caption = $hostmatchteamcaption . ' VS ' . $guestmatchteamcaption . $score;

                //新增反积分竞猜
                DatabaseApi::AddLolmatchCompetitionGuessing($matchid, $caption, 8, $score, $theodds, $totaleti, $frozeneti);
            }
        }
    }

    //结算
    public function BalanceConfirm(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $matchid = $request->param('matchid');
        $balancetype = $request->param('balancetype');
        $balacnce_hole = $request->param('balance_hole');
        $balance_half = $request->param('balance_half');
        $balance_angle = $request->param('balance_angle');
        $balance_lol_score = $request->param('balance_lol_score');


    /*
     * 0 结算
     * 1 取消
     * 2 推迟
     * 3 只结算上半场
     */
        if(balancetype === '0'){
            self::Balance($request);
        }else if(balancetype === '1'){
            self::BalanceCancel($request);
        }else if(balancetype === '2'){
            self::BalanceDelay($request);
        }else if(balancetype === '3'){
            self::BalanceFirstHalf($request);
        }
    }

    private function BalanceCancel($request){
        //match

        //competition

        //bettingrecord

        //user

        //etirecord
    }

    private function BalanceDelay($request){
        //match

        //competition

        //bettingrecord

    }

    private function BalanceFirstHalf($request){

    }

    private function Balance($request){

    }
}
