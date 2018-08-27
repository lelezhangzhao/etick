<?php

namespace app\etick\controller;

use think\Controller;
use think\Request;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;

use app\etick\model\EtickMatchType as EtickmatchTypeModel;
use app\etick\model\MatchType as MatchTypeModel;
use app\etick\model\MatchTeam as MatchTeamModel;

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
}