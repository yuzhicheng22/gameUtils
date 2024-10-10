import os
import os.path
import shutil
import glob

#
#
dir_target = {
    "_delete": ["Parry Block", "parry_block", "Parrry_Block", "ParryBlock", "parryblock", "parry_clock", "_sword01",
                "_Idle002","_standby"],
    "atk": ["ATK01", "atk", "ATK", "atk1","attack"],
    "die": ["Dead", "Die"],
    "gethit": ["Gethit", "Take","hit"],
    "idle": ["Idle", "idle_01"],
    # "idle1": ["Idle007", "standby"],
    "idle1": ["Idle_Knife01", "standby","Idel_knife01"],# 刀站立
    "idle2": ["Idle_Sword01", "Idel_sword01"],# 剑站立
    "idle3": ["Idle_bxoing01","idle_boxing01","idle_boxing"],# 拳站立
    "idle4": ["Idle_Gun01","Idel_gun01"],# 枪站立
    "skill": ["Skill01", "Skill"],
    "skill1": ["skill102"],
    "trans": ["trans01"],
    "juqi": ["juqi", "juqi01"],
    "juqi1": ["juqi_01"],
    "walk1": ["walk_01", "walk103"],
    "walk2": ["walk_02"],
    "atk1": ["Knife01"],
    "atk2": ["Sword01","swrod01"],
    "atk3": ["Boxing", "boxing01", "bxoing01", "bxoing"],
    "atk4": ["Gun01"],
    "atks": ["ATK02", "atk2"],  # 特殊攻击
}

# model_name = {
#     "m001": "ZhengShou",  # 狰（独角狗）
#     "m002": "JieGou",  # 蝙蝠 jie gou
#     "m003": "HuoShi",  # 活师（扑人青蛙）
#     "m003_1": "HuoShiFen",  # 活师_粉（扑人青蛙）
#     "m003_2": "HuoShiHong",  # 活师_红（扑人青蛙）
#     "m004": "AoYin",  # 獓骃（牛）
#     "m005": "SanZhiZhu",  # 山蜘蛛（小蜘蛛）
#     "m006": "YouQiongGui",  # 有穷鬼（小僵尸）
#     "m007": "HouShou",  # 犼（触手狗）
#     "mb001": "LinLin",  # BOSS軨軨（疯牛Boss）
#     "mb002": "LaoZhiZhu",  # BOSS罔象（大蜘蛛）
#     "mb003": "ZaoChi",  # BOSS凿齿/长右（胖僵尸）
#     "mb004": "XieZhi",  # BOSS獬豸（触手大青蛙）
#     "mb005": "LangGanShu",  # BOSS琅玕树（三眼花）
#     "w_001": "AoJiao",  # 熬娇（剑）
#     "w_002": "LiuRuYue",  # 柳如月（刀）
#     "w_003": "DuanMuQin",  # 端木晴（拳）
#     "w_004": "XiaoYuLan",  # 萧钰斓（剑）
#     "w_005": "XiaoBai",  # 小白（拳）
#     "w_006": "XiaoJian",  # 萧剑（张合换蓝色贴图）（男）
#     "W_007": "YinYue",  # 嬴月（枪）
#     "W_008": "ZhangHe",  # 张合（剑）
#     "W_009": "YunKeXin",  # 云可心（枪）
#     "W_010": "ChuXinYun",  # 楚心云（刀）
#     "W_011": "YueChenXi",  # 岳晨曦（拳）
#     "W_012": "BaoEr",  # 宝儿（萧钰斓换红色贴图）（女）
#     "W_013": "Female01",  # 柳如月换贴图散修（女）
#     "W_014": "SectFemale",  # 端木晴换贴图宗门（女）
#     "W_015": "Male01",  # 张合换贴图散修（男）
#     "W_016": "SectMale",  # 张合换贴图宗门（男）
#     "W_101": "MainDao",  # 普通状态主角（刀）
#     "W_102": "Main01",  # 爆气状态主角（拳）
#     "W_103": "MainJian",  # 剑仙状态主角（剑）
#     "W_104": "Main02",  # 爆气状态主角v2 沙滩裤（拳）
#     "W_105": "Main03",  # 爆气状态主角v3 红裤衩（拳）
# }
model_ani_num = {
    "m001": {"name": "ZhengShou", "atk": "5~42", "die": "1~29"},  # 狰（独角狗）
    "m002": {"name": "JieGou", "die": "1~24"},  # 蝙蝠 jie gou
    "m003": {"name": "HuoShi", "atk": "12~74", "die": "1~24"},  # 活师（扑人青蛙）
    "m003_1": {"name": "HuoShiLv", "atk": "12~74", "die": "1~24"},  # 活师_绿（扑人青蛙）
    "m003_2": {"name": "HuoShiHong", "atk": "12~74", "die": "1~24"},  # 活师_红（扑人青蛙）
    "m004": {"name": "AoYin", "atk": "0~32", "die": "0~34", "gethit": "0~20"},  # 獓骃（牛）
    "m005": {"name": "SanZhiZhu"},  # 山蜘蛛（小蜘蛛）
    "m006": {"name": "YouQiongGui"},  # 有穷鬼（小僵尸）
    "m007": {"name": "HouShou"},  # 犼（触手狗）
    "mb001": {"name": "LinLin", "atk": "155~210"},  # BOSS軨軨（疯牛Boss）
    "mb002": {"name": "LaoZhiZhu"},  # BOSS罔象（大蜘蛛）
    "mb003": {"name": "ZaoChi"},  # BOSS凿齿/长右（胖僵尸）
    "mb004": {"name": "XieZhi"},  # BOSS獬豸（触手大青蛙）
    "mb005": "LangGanShu",  # BOSS琅玕树（三眼花）
    "w_001": "AoJiao",  # 熬娇（剑）
    "w_002": "LiuRuYue",  # 柳如月（刀）
    "w_003": "DuanMuQin",  # 端木晴（拳）
    "w_004": "XiaoYuLan",  # 萧钰斓（剑）
    "w_005": "XiaoBai",  # 小白（拳）
    "w_006": "XiaoJian",  # 萧剑（张合换蓝色贴图）（男）
    "W_007": "YinYue",  # 嬴月（枪）
    "W_008": "ZhangHe",  # 张合（剑）
    "W_009": "YunKeXin",  # 云可心（枪）
    "W_010": "ChuXinYun",  # 楚心云（刀）
    "W_011": "YueChenXi",  # 岳晨曦（拳）
    "W_012": "BaoEr",  # 宝儿（萧钰斓换红色贴图）（女）
    "W_013": "Female01",  # 柳如月换贴图散修（女）
    "W_014": "SectFemale",  # 端木晴换贴图宗门（女）
    "W_015": "Male01",  # 张合换贴图散修（男）
    "W_016": "SectMale",  # 张合换贴图宗门（男）
    "W_017": "ChuZhaoYun",  # 楚朝云
    "W_101": "MainDao",  # 普通状态主角（刀）
    "W_102": "Main01",  # 爆气状态主角（拳）
    "W_103": "MainJian",  # 剑仙状态主角（剑）
    "w103": "MainJian",  # 剑仙状态主角（剑）
    "w103_1": "MainJianHook",  # 剑仙状态主角挂机特效
    "W_104": "Main02",  # 爆气状态主角v2 沙滩裤（拳）
    "W_105": "Main03",  # 爆气状态主角v3 红裤衩（拳）
    "白起序列图": "BaiQi",  # 白起
    "百里奚序列帧": "BaiLiXi",  # 百里奚
    "定风愁序列图": "DingFengChou",  # 定风愁
    "凤菲雪序列帧": "FengFeiXue",  # 凤菲雪
    "金大宝序列图": "JinDaBao",  # 金大宝
    "冷流苏序列图": "LenLiuSu",  # 冷流苏
    "冷月序列帧": "LenYue",  # 冷月
    "蒙面人序列帧": "HeiYiRen",  # 蒙面人
    "暮成雪序列图": "MuChenXue",  # 暮成雪
    "苏小小序列图": "ShuXiaoXiao",  # 苏小小
    "温柔序列帧": "WenRou",  # 温柔
    "温柔拳序列帧": "WenRou",  # 温柔
    "穷奇序列帧": "QiongQi",  # 穷奇
    "小红序列图": "XiaoHong",  # 小红
    "万山序列图": "WanShan",  # 万山
    "江子墨序列图": "JiangZiMo",  # 江子墨
    "夏夕颜序列图": "XiaXiYan",  # 夏夕颜
    "邵阳序列图": "ShaoYang",  # 邵阳
    "柳随风序列图": "LiuSuiFeng",  # 柳随风
    "木心雅序列图": "MuXinYa",  # 木心雅
    "万峰序列图": "WanFen",  # 万峰
    "姜木恒序列帧": "JiangMuHeng",  # 姜木恒
    "混沌序列帧": "HunDun",  # 混沌
    "饕餮序列帧": "TaoTie",  # 饕餮
    "梼杌序列帧": "TaoWu",  # 梼杌
    "宋千河序列帧": "SongQianHe",  #
    "司马凌轩": "SiMaLingXuan",  #
    "沈曼君序列图": "ShenManJun",  #
    "裴少轩": "PeiShaoXuan",  #
    "轩辕战天": "XuanYuanZhanTian",  #
    "木伊男": "MuYiNan",  #
    "金无极": "JinWuJi",  #
    "白展": "BaiZhan",  #
}


class EntityAnimRename:
    model_name = {}
    ani_rename_target = {}
    ani_rename_num = {}

    @staticmethod
    def create_dir(dir_name):
        if os.path.exists(dir_name):
            return
        os.makedirs(dir_name)

    @staticmethod
    def rm_dir(dir_name):
        if os.path.isdir(dir_name):
            shutil.rmtree(dir_name)

    def rename_dir(self, dir_name, new_name):
        if not os.path.isdir(dir_name):
            return
        # shutil.file

        for infile in glob.glob(dir_name + "/*"):
            # dir_base_name = os.path.basename(infile)
            # print(infile,dir_base_name)
            model_target_name = self.rename_dir_get(infile)
            self.rename_dir2(infile, new_name + "\\" + model_target_name)
            # if model_target_name is None:
            #     print(infile, "缺少重命名")
            #     self.rename_dir2(infile, new_name + "\\" + dir_base_name)
            # else:
            #     self.rename_dir2(infile, new_name + "\\" + model_target_name)

    def rename_dir_get(self, dir_name):
        dir_base_name = os.path.basename(dir_name)
        model_target_name = self.model_name.get(dir_base_name.lower())
        if model_target_name is None:
            print(dir_name, "缺少重命名")
            return dir_base_name
        else:
            return model_target_name

    def rename_dir2(self, dir_name, new_name):
        if not os.path.isdir(dir_name):
            return
        self.rm_dir(new_name)
        # shutil.copytree(dir_name, new_name)
        for infile in glob.glob(dir_name + "/*"):
            ani_base_name = os.path.basename(infile)
            # 计算重命名
            ani_target_name = self.ani_rename_target.get(ani_base_name.lower())
            if ani_target_name is None:
                print(infile, "缺少重命名===" + ani_base_name)
                new_target_name = new_name + "\\" + ani_base_name
                # self.rename_order_dir3(infile, new_target_name)
                shutil.copytree(infile, new_target_name)
            elif ani_target_name == "_delete":
                continue
            else:

                new_target_name = new_name + "\\" + ani_target_name
                shutil.copytree(infile, new_target_name)
            print("rename_dir", infile, new_target_name)
            self.rename_order_dir3(new_target_name)

    @staticmethod
    def safe_int(num_str):
        try:
             int(num_str)
        except ValueError:
            result = []
            for c in num_str:
                if not ('0' <= c <= '9'):
                    continue
                result.append(c)
            if len(result) == 0:
                return 0
            return ''.join(result)
        return num_str

    def rename_order_dir3(self, dir_name):
        if not os.path.isdir(dir_name):
            return
        index = 0
        cur_ani_name = os.path.basename(dir_name)
        cur_model_name = os.path.basename(os.path.dirname(dir_name))
        max_num = 100000
        min_num = -1
        ani_num_data = self.ani_rename_num.get(cur_model_name)
        if not ani_num_data is None:
            ani_num_data = ani_num_data.get(cur_ani_name)
            if isinstance(ani_num_data, str):
                list_num = ani_num_data.split("~")
                min_num = int(list_num[0])
                max_num = int(list_num[1])

        for infile in glob.glob(dir_name + "/*"):
            index += 1
            base_name = os.path.basename(infile)
            base_name_2 = os.path.splitext(base_name)[0]
            base_name_list = base_name_2.split(".")
            if len(base_name_list) == 1:
                base_name_list = base_name_2.split("_")

            base_name_num_str = self.safe_int(base_name_list[len(base_name_list) - 1])
            base_name_num = int(base_name_num_str)
            if (base_name_num <= max_num and base_name_num >= min_num):
                shutil.move(infile, dir_name + "\\" + base_name_num_str + ".png")
            else:
                os.remove(infile)

    def __init__(self):
        self.model_name = {}
        for key in model_ani_num:
            if isinstance(model_ani_num[key], str):
                model_rename = model_ani_num[key]
            else:
                model_rename = model_ani_num[key].get("name")
                self.ani_rename_num[model_rename] = model_ani_num[key]
            self.model_name[key.lower()] = model_rename
            if key.lower().find("w_") >= 0:
                self.model_name[key.lower().replace("_", "")] = model_rename

        # print(self.model_name)

        for key in dir_target:
            dir_new_name_list = []
            for ani_name in dir_target[key]:
                # print(key, ani_name)
                # dir_new_name_list.append(ani_name)
                # dir_new_name_list.append(ani_name.lower())
                self.ani_rename_target[ani_name] = key
                self.ani_rename_target[ani_name.lower()] = key

        # print(self.ani_rename_target)


if __name__ == '__main__':
    # anim = EntityAnimRename()
    # item = ""
    # # item = "m003_1"
    # if item == "":
    #     anim.rename_dir(R"E:\project\projectLB\Lb-Tools\mapParse\所有序列帧",
    #                     R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource")
    # else:
    #     new_item = anim.rename_dir_get(item)
    #     anim.rename_dir2(R"E:\project\projectLB\Lb-Tools\mapParse\所有序列帧" + "\\" + item,
    #                      R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource" + "\\" + new_item)
    exit()
