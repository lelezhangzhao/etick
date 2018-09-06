<?php


/*完成网页内容捕获功能*/
function get_img_url($site_name)
{
//    $site_fd = fopen($site_name, "r");
    $site_content = $site_name;
//    while (!feof($site_fd)) {
//        $site_content .= fread($site_fd, 1024);
//    }
    /*利用正则表达式得到图片链接*/
    $reg_tag = '/home\.country\.check.*?<i class="icon" .*?\'([^\']*(png|jpg))\?.*?class="str">([\x80-\xff].*?)<\/span.*?>/';

    $ret = preg_match_all($reg_tag, $site_content, $match_result);
//    fclose($site_fd);
    return $match_result;
}

/* 对图片链接进行修正 */
function revise_site($site_list, $base_site)
{
    foreach ($site_list as $site_item) {
        if (preg_match('/^http/', $site_item)) {
            $return_list[] = $site_item;
        } else {
            $return_list[] = $base_site . "/" . $site_item;
        }
    }
    return $return_list;
}

/*得到图片名字，并将其保存在指定位置*/
function get_pic_file($pic_url_array, $pos)
{
    $reg_tag = '/.*\/(.*?)$/';
    $count = 0;
    for($i = 0; $i < sizeof($pic_url_array[0]); ++$i){
        $pic_item = $pic_url_array[1][$i];

        $ret = preg_match_all($reg_tag, $pic_item, $t_pic_name);
        $pic_name = $pos . $pic_url_array[3][$i] . '.' .$pic_url_array[2][$i];
        $pic_name = iconv("UTF-8", "GBK", $pic_name);
        $pic_url = $pic_item;
        print("Downloading " . $pic_url . " ");
        $img_read_fd = fopen($pic_url, "r");
        $img_write_fd = fopen($pic_name, "w");
        $img_content = "";
        while (!feof($img_read_fd)) {
            $img_content .= fread($img_read_fd, 1024);

        }
        fwrite($img_write_fd, $img_content);
        fclose($img_read_fd);
        fclose($img_write_fd);
        print("[OK] ");
    }
//    foreach ($pic_url_array[1] as $pic_item) {
//        $ret = preg_match_all($reg_tag, $pic_item[1], $t_pic_name);
//        $pic_name = $pos . $pic_item[3];
//        $pic_url = $pic_item[1];
//        print("Downloading " . $pic_url . " ");
//        $img_read_fd = fopen($pic_url, "r");
//        $img_write_fd = fopen($pic_name, "w");
//        $img_content = "";
//        while (!feof($img_read_fd)) {
//            $img_content .= fread($img_read_fd, 1024);
//
//        }
//        fwrite($img_write_fd, $img_content);
//        fclose($img_read_fd);
//        fclose($img_write_fd);
//        print("[OK] ");
//    }
    return 0;
}

function main()
{
    $url = "www.leisu.com";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//禁止调用时就输出获取到的数据
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $result = curl_exec($ch);
    curl_close($ch);

    /* 待抓取图片的网页地址 */
    $site_name = "www.leisu.com";
    $img_url = get_img_url($result);
//    $img_url_revised = revise_site($img_url, $site_name);
//    $img_url_unique = array_unique($img_url_revised); //unique array
    get_pic_file($img_url, "./test/");
}

main();

?>