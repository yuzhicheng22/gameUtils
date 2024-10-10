import glob
import os
import os.path
import json

# 对应动作的帧率
action_scale = {
    "idle": 16,  # 待机1.05倍
    "idle1": 16,  # 待机1.05倍
    "skill": 19,  # 施法1.3倍  1.79s
    "juqi": 19,  # 聚气1.3倍  2.68s
    "juqi1": 19,  # 聚气1.3倍  2.68s
    "gethit": 18,  # 受击1.2倍 1.17s
    "die": 18,  # 死亡 1.25倍 1.72s
    "atk": 20,  # 刀攻击 1.35倍
    "atk1": 20,  # 刀攻击1.35倍 1s
    "atk2": 20,  # 剑攻击1.35倍 0.95s
    "atk3": 23,  # 拳攻击1.55倍 0.74s
    "atk4": 19,  # 枪攻击1.3倍 0.84s
    "atks": 15,  # 特殊攻击1倍
}


class EntityAnimByPlist:
    @staticmethod
    def create_dir(dir_name):
        if os.path.exists(dir_name):
            return
        os.makedirs(dir_name)

    @staticmethod
    def get_sprite_frame_data(frame, uuid):
        frame_data = {"frame": frame, "value": {"__uuid__": uuid}}
        return frame_data

    attack_str = ""
    walk_str = ""

    def load_str(self, open_url=None):
        print(os.getcwd())
        if open_url is None:
            open_url = os.getcwd() + "\\"
        # 读取循环动画json文件
        self.attack_str = open(open_url + "Demo.anim", encoding="utf-8").read()
        # 读取循环动画json文件
        self.walk_str = open(open_url + "loop.anim", encoding="utf-8").read()

    def set_sprite_list(self, anim_data, sprite_list_data):
        anim_data["curveData"]["comps"]["cc.Sprite"]["spriteFrame"] = sprite_list_data

    @staticmethod
    def get_dict(sub_dict, key):
        dict_ = sub_dict.get(key)
        if dict_ is None:
            dict_ = {}
            sub_dict[key] = dict_
        return dict_

    @staticmethod
    def get_dict_array(sub_dict, key):
        dict_ = sub_dict.get(key)
        if dict_ is None:
            dict_ = []
            sub_dict[key] = dict_
        return dict_

    def read_plist_meta(self, reset_mame, copy_name, use_scale=1):
        print(reset_mame)
        action_name = os.path.basename(reset_mame)
        # exchange_names = {"1": "270", "2": "315", "3": "0", "4": "45", "5": "90"}
        subMetas = json.load(open(reset_mame + "\\" + action_name + ".plist.meta"))["subMetas"]
        sub_dict = {}
        for key in subMetas:
            uuid = subMetas[key]["uuid"]
            keys = key.split("-")
            if len(keys) != 2:
                continue
            # dict1 = EntityAnim1.getDict(sub_dict, keys[0])
            # dict2 = EntityAnimByPlist.get_dict(sub_dict, keys[0])
            uuids = EntityAnimByPlist.get_dict_array(sub_dict, keys[0])
            uuids.append(uuid)

        print(sub_dict)
        for action_item_name in sub_dict.keys():
            print(action_item_name)
            # print(exchange_names[key])
            item_name = "ani_" + action_item_name
            item_name_file = item_name + ".anim"
            # action_item_dir =
            uuids = sub_dict[action_item_name]

            # continue
            if uuids is None:
                continue
            print(uuids)

            index = 0
            frame_list = []
            anim_data = None
            if action_item_name == "idle" or action_item_name == "idle1":
                anim_data = json.loads(self.walk_str)
            else:
                anim_data = json.loads(self.attack_str)

            if use_scale == 1:
                sample = action_scale.get(action_item_name)
                if sample is None:
                    sample = anim_data["sample"]
            else:
                sample = anim_data["sample"]
            gap = 1 / sample
            for meta_uuid in uuids:
                # # meta_item_data = json.load(open(mete_name))
                # subMetas = json.load(open(mete_name))["subMetas"]
                # meta_uuid = ""
                # for key in subMetas:
                #     meta_uuid = (subMetas[key]["uuid"])
                #     break
                frame_list.append(self.get_sprite_frame_data(index * gap, meta_uuid))
                index += 1
            anim_data["sample"] = sample
            anim_data["_duration"] = index * gap
            anim_data["_name"] = item_name
            self.set_sprite_list(anim_data, frame_list)
            file = open(copy_name + R"/" + item_name_file, "w")
            json.dump(anim_data, file, indent=2)
            print(file.name)

    def read_plist_meta_dir(self, dir_name, to_dir_name, use_scale=1):
        for infile in glob.glob(dir_name + "/*"):

            if os.path.isdir(infile):
                base_name = os.path.basename(infile)
                self.read_plist_meta(infile, to_dir_name + "\\" + base_name, use_scale)


if __name__ == '__main__':
    # anim = EntityAnimByPlist()
    # anim.load_str()
    # anim.read_plist_meta(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\AnimPlist\AoJiao",
    #                      R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\AnimPlist\AoJiao")
    exit()
