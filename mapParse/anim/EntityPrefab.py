import glob
import os
import os.path
import shutil
import json


class EntityPrefab:
    @staticmethod
    def create_dir(dir_name):
        if os.path.exists(dir_name):
            return
        os.makedirs(dir_name)

    @staticmethod
    def get_sprite_frame_uuid(data):
        frame_data = data["curveData"]["comps"]["cc.Sprite"]["spriteFrame"][0]["value"]
        return frame_data

    @staticmethod
    def get_sprite_frame_data(uuid):
        frame_data = {"__uuid__": uuid, }
        return frame_data

    prefab_str = ""

    def read_dir(self, dir_name, to_dir_name):
        pass

    def load_str(self, open_url=R"/"):
        self.prefab_str = open(open_url + "Demo.prefab", encoding="utf-8").read()
        # print(self.prefab_str)

    def start(self, reset_mame, copy_name):
        index = 0
        self.create_dir(copy_name)
        shutil.rmtree(copy_name)
        self.read_dir(reset_mame, copy_name)

    @staticmethod
    def set_list(anim_data, sprite_list_data):
        anim_data["_clips"] = sprite_list_data

    def read_item(self, reset_mame, copy_name=None):
        if copy_name is None:
            copy_name = reset_mame
        for infile in glob.glob(reset_mame + "/*"):
            if not os.path.isdir(infile):
                continue
            self.read_item_sub(infile, copy_name + "/" + os.path.basename(infile))

    def read_item_sub(self, reset_mame, copy_name=None):
        if copy_name is None:
            copy_name = reset_mame
        action_name = os.path.basename(reset_mame)
        first_uuid = None
        first_sprite_uuid = None
        _clips = []
        prefab_data = json.loads(self.prefab_str)
        # print(glob.glob(reset_mame + "/*.meta"))
        # print(reset_mame + "/*.meta")
        for infile in glob.glob(reset_mame + "/*.meta"):
            # print(infile)
            if not os.path.splitext(os.path.basename(infile))[0].endswith(".anim"):
                continue
            uuid = json.load(open(infile, "r"))['uuid']
            if first_uuid is None:
                first_uuid = uuid
            if first_sprite_uuid is None:
                first_sprite_uuid = self.get_sprite_frame_uuid(json.loads(open(os.path.splitext(infile)[0]).read()))
            _clips.append(EntityPrefab.get_sprite_frame_data(uuid))

        for data in prefab_data:
            if data["__type__"] == "cc.Node":
                data["_name"] = action_name
            elif data["__type__"] == "cc.Sprite":
                data["_spriteFrame"] = first_sprite_uuid
                pass
            elif data["__type__"] == "cc.Animation":
                data["_defaultClip"] = self.get_sprite_frame_data(first_uuid)
                self.set_list(data, _clips)

        prefab_path = copy_name + R"/" + action_name + ".prefab"
        file = open(prefab_path, "w")
        json.dump(prefab_data, file, indent=2)
        print("生成成功 ----->"+prefab_path)

    def reset_meta(self, dir_name):
        # print(glob.glob(dir_name + "/*"))
        for infile in glob.glob(dir_name + "/*.prefab"):
            file = open(infile, "r")
            prefab_data = json.load(file)
            file.close()
            print(infile + ".meta")
            meta_file = open(infile + ".meta", "r")
            meta_data = json.load(meta_file)
            meta_file.close()
            for data in prefab_data:
                if data["__type__"] == "cc.PrefabInfo":
                    data["asset"] = self.get_sprite_frame_data(meta_data["uuid"])

            file = open(infile, "w")
            json.dump(prefab_data, file, indent=2)
            file.close()

            # json.dump(anim_data, file, indent=2)
        # copy_name = [0, 45, 90, 270, 315]
        # for dir_name_item in copy_name:
        #     dir_item_full = dir_name + R"/" + str(dir_name_item)
        #     if os.path.exists(dir_item_full):
        #         print(dir_item_full)
        #         self.copy_image(dir_item_full, to_dir_name + R"/" + str(dir_name_item))


if __name__ == '__main__':
    anim = EntityPrefab()
    anim.load_str()
    anim.read_item(R"E:\project\projectLB\FightDemo249\assets\bundle\Ani",
                   R"E:\project\projectLB\FightDemo249\assets\bundle\Ani")
    # anim.read_item_sub(R"E:\project\projectLB\FightDemo249\assets\bundle\Ani\ATest", R"E:\project\projectLB\Lb-Tools\mapParse\anim\ATest")
    exit()
