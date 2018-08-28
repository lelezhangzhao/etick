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

class Admin extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch();
    }

    public function GetEtickMatchType(){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

//        $json_arr = [0 => "足球返波胆", 1 => "英雄联盟返波胆"];
        $matchtype = EtickMatchTypeModel::all();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetMatchType(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchtype = MatchTypeModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetHostAndGuestTeam(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchteam = MatchTeamModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchteam));
    }

    public function AddAntiwaveFootballMatch(Request $request){
//        matchtypeid:matchtypeid,
//                    hostteamid:hostteamid,
//                    guestteamid:guestteamid,
//                    matchcaption:matchcaption,
//                    scoreHole:scoreHole,
//                    scoreHalf:scoreHalf,
//                    scoreAngle:scoreAngle,

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

        //新增比赛
        DatabaseApi::AddAntiwaveFootballMatch($matchtypeid, $hostteamid, $guestteamid, $matchcaption, $matchtime, $displaytime, $disappeartime);

        $sql = 'select * from etick_antiwave_football_match order by id desc limit 1';
        $match = Db::query($sql);
        $matchid = $match[0]['id'];

        //新增竞猜
        $s = json_encode($scoreHole);
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
//
//        if(is_array($a)){
//            foreach ($a as $hole){
//                $i = $hole;
//            }
//        }

    }

    public function AddLolMatch(Request $request){

    }
}