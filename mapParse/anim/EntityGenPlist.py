import glob
import os.path
import subprocess
from os import path


class EntityGenPlist:
    # @staticmethod
    # def start_config(res_mame, target_name, config_name):
    #     action_name = path.basename(res_mame)
    #     tps = target_name
    #     # parent_name = path.dirname(res_mame)
    #     # print(parent_name)
    #     # return
    #     cmd_str = ("TexturePacker " + res_mame +
    #                    " --format cocos2d-x --data " + target_name + "\\" + action_name +"\\" + action_name +
    #                    ".plist --sheet " + action_name + ".png --texture-format png --opt RGBA8888 --png-opt-level 0")
    #     # cmd_str = ("TexturePacker " + parent_name +
    #     #                " --format cocos2d-x --data " + target_name + "\\" + action_name +
    #     #                ".plist --sheet " + action_name + ".png --texture-format png --opt RGBA8888 --png-opt-level 0")
    #     # print(parent_name)
    #     # print(action_name)
    #     print(cmd_str)
    #     subprocess.run(cmd_str)
    @staticmethod
    def start_dir(res_mame, target_name):
        for infile in glob.glob(res_mame):
            if os.path.isdir(infile):
                EntityGenPlist.start_item(infile, target_name)

    @staticmethod
    def start_item(res_mame, target_name):
        action_name = path.basename(res_mame)
        cmd_str = ("TexturePacker " + res_mame +
                       " --format cocos2d-x --data " + target_name + "\\" + action_name +"\\" + action_name +
                       ".plist --sheet " + action_name + ".png --texture-format png8 --opt RGBA8888 --png-opt-level 1 "+
                   "--max-size 2048 --size-constraints POT")
        print(cmd_str)
        subprocess.run(cmd_str)


if __name__ == '__main__':
    EntityGenPlist.start_item(R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist\AoJiao", R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\AnimPlist")
    exit()