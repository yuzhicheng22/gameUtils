import glob
import os
import os.path
import shutil
import json


class EntityAnim:
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

    def load_str(self, open_url = R"/"):
        print(os.getcwd())
        # 读取循环动画json文件
        self.attack_str = open(open_url+"Demo.anim", encoding="utf-8").read()
        # 读取循环动画json文件
        self.walk_str = open(open_url+ "loop.anim", encoding="utf-8").read()
        # print(self.walk_str)
        # walk_data = json.loads(self.walk_str)
        # walk_data["_name"] = "walk1"
        # file = open("walk2.anim", "w")
        # self.set_sprite_list(walk_data,[self.get_sprite_frame_data(1,"111")])
        # print(json.dump(walk_data, file,indent=2))
        # print(json.dumps(walk_data,))

    def start(self, reset_mame, copy_name):
        index = 0
        self.create_dir(copy_name)
        shutil.rmtree(copy_name)
        self.read_dir(reset_mame, copy_name)

    def set_sprite_list(self, anim_data, sprite_list_data):
        anim_data["curveData"]["comps"]["cc.Sprite"]["spriteFrame"] = sprite_list_data

    def read_item(self, reset_mame, copy_name):
        for infile in glob.glob(reset_mame + "/*"):
            if not os.path.isdir(infile):
                continue
            self.read_item_sub(infile, copy_name+"/"+os.path.basename(infile))

    def read_item_sub(self, reset_mame, copy_name):
        for infile in glob.glob(reset_mame+"/*"):
            if not os.path.isdir(infile):
                continue
            self.read_item_sub2(infile, copy_name)

    def read_item_sub2(self, reset_mame, copy_name):
        action_name = "ani_" + os.path.basename(reset_mame)

        # print(exchange_names[key])
        item_name = action_name + ".anim"
        meta_full = reset_mame
        index = 0
        frame_list = []
        anim_data = None
        if action_name == "ani_idle":
            anim_data = json.loads(self.walk_str)
        else:
            anim_data = json.loads(self.attack_str)
        sample = anim_data["sample"]
        gap = 1 / sample

        for mete_name in glob.glob(meta_full + r"/*.meta"):
            # meta_item_data = json.load(open(mete_name))
            if os.path.splitext(os.path.basename(mete_name))[0] == "AutoAtlas.pac":
                continue
            print(os.path.splitext(os.path.basename(mete_name)))
            subMetas = json.load(open(mete_name))["subMetas"]
            meta_uuid = ""
            for key in subMetas:
                meta_uuid = (subMetas[key]["uuid"])
                break
            frame_list.append(self.get_sprite_frame_data(index * gap, meta_uuid))
            index += 1
        anim_data["_duration"] = index * gap
        anim_data["_name"] = action_name
        self.set_sprite_list(anim_data, frame_list)
        self.create_dir(copy_name )
        file = open(copy_name + R"/" + item_name, "w")
        json.dump(anim_data, file, indent=2)
        print(file.name)

    def read_dir(self, dir_name, to_dir_name):
        pass
        # copy_name = [0, 45, 90, 270, 315]
        # for dir_name_item in copy_name:
        #     dir_item_full = dir_name + R"/" + str(dir_name_item)
        #     if os.path.exists(dir_item_full):
        #         print(dir_item_full)
        #         self.copy_image(dir_item_full, to_dir_name + R"/" + str(dir_name_item))


if __name__ == '__main__':
    anim = EntityAnim()
    anim.load_str()
    anim.read_item(R"E:\project\projectLB\FightDemo249\assets\bundle\Ani",
                   R"E:\project\projectLB\FightDemo249\assets\bundle\Ani")

    exit()
