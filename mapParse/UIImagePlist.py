import glob

import anim.EntityGenPlist as EntityGenPlist
import anim.EntityAnim as EntityAnim
import anim.EntityPrefab as EntityPrefab
import anim.EntityAnimByPlist as EntityAnimByPlist
import os


def start_item(item=R""):
    distFold = R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist"
    aniFold = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\AnimPlist"

    # 生产plist文件
    EntityGenPlist.EntityGenPlist.start_item(distFold + item, aniFold)

    # 生产animeta文件
    imageAnimByPlist.attack_str(distFold + item, aniFold)

    # 生成预制体
    imagePrefab.read_item_sub(aniFold + item)
    pass


if __name__ == '__main__':
    distFold = R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist"
    aniFold = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\Anim"
    # aniFold = R"E:\project\projectLB\FightDemo249\assets\bundle\Ani"

    # if item != "":
    #     imagePrefab.read_item_sub(aniFold + item)
    # else:
    #     imagePrefab.read_item(aniFold, aniFold)

    # if item != "":
    #     EntityGenPlist.EntityGenPlist.start_item(distFold + item, aniFold)
    # else:
    #     EntityGenPlist.EntityGenPlist.start_dir(distFold + item, aniFold)

    # item_list = []
    item_ext = ["MainHook", "MainJianHook"]
    # item_list =[ R"\DingFengChou", R"\FengFeiXue", R"\JinDaBao", R"\LenLiuSu", R"\MuChenXue", R"\ShuXiaoXiao", R"\WenRou"]
    item_list = [R"\ChuXinYun"]
    # item_list = [R"\ChuZhaoYun", R"\LiuRuYue", R"\XiaoYuLan", R"\XiaoJian", R"\YinYue", R"\MainJian",]
    # item_list = [R"\MuChenXue", R"\LiuSuiFeng", R"\LenLiuSu", R"\JiangMuHeng", R"\JiangZiMo",]
    # item_list = [R"\WanFen", R"\ShuXiaoXiao", R"\SongQianHe", R"\SiMaLingXuan", R"\ShaoYang",]
    # item_list = [ R"\XuanYuanZhanTian", R"\WenRou", R"\XiaoHong", R"\XiaXiYan", R"\WanShan", ]
    # item_list = [R"\TaoWu", R"\TaoTie", R"\QiongQi", R"\HunDun", R"\ShenManJun", ]
    # R"\FengFeiXue", R"\DingFengChou", R"\BaiLiXi", R"\BaiZhan", R"\BaiQi",
    # item_list = [R"\SongQianHe", R"\SiMaLingXuan", R"\ShenManJun", R"\PeiShaoXuan", R"\XuanYuanZhanTian", R"\MuYiNan", R"\JinWuJi", R"\BaiZhan"]
    # print(glob.glob( R"E:\project\projectLB\Lb-Tools\mapParse"))
    if len(item_list) == 0:
        for file_path in glob.glob(distFold + "/*"):
            if os.path.basename(file_path) in item_ext:
                continue
            if os.path.isdir(file_path):
                item_list.append(R"/" + os.path.basename(file_path))

    # 生产animeta文件
    imageAnimByPlist = EntityAnimByPlist.EntityAnimByPlist()
    imageAnimByPlist.load_str(os.getcwd() + R"/anim/")
    imagePrefab = EntityPrefab.EntityPrefab()
    imagePrefab.load_str(os.getcwd() + R"/anim/")
    genStep = 3

    for item in item_list:
        # 生产plist文件
        if genStep == 1 or genStep == 0:
            EntityGenPlist.EntityGenPlist.start_item(distFold + item, aniFold)
        # 生成动画文件
        if genStep == 2 or genStep == 0:
            imageAnimByPlist.read_plist_meta(aniFold + item, aniFold + item)
        # # 生成预制体文件
        if genStep == 3 or genStep == 0:
            imagePrefab.read_item_sub(aniFold + item)
        # if item != "":
        #     imagePrefab.read_item_sub(aniFold + item)
        # else:
        #     imagePrefab.read_item(aniFold, aniFold)
    exit()
