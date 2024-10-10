import os
import shutil
import glob

ani_rename_num = {}


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


def rename_order_dir4(dir_name):
    if not os.path.isdir(dir_name):
        return
    index = 100
    # cur_ani_name = os.path.basename(dir_name)
    # cur_model_name = os.path.basename(os.path.dirname(dir_name))
    max_num = 100000
    # min_num = -1
    # ani_num_data = ani_rename_num.get(cur_model_name)
    # if not ani_num_data is None:
    #     ani_num_data = ani_num_data.get(cur_ani_name)
    #     if isinstance(ani_num_data, str):
    #         list_num = ani_num_data.split("~")
    #         min_num = int(list_num[0])
    #         max_num = int(list_num[1])

    for infile in glob.glob(dir_name + "/*"):
        index += 1
        # base_name = os.path.basename(infile)
        # base_name_2 = os.path.splitext(base_name)[0]
        # base_name_list = base_name_2.split(".")
        # if len(base_name_list) == 1:
        #     base_name_list = base_name_2.split("_")
        #
        # base_name_num_str = safe_int(base_name_list[len(base_name_list) - 1])
        # base_name_num = int(base_name_num_str)
        # if (base_name_num <= max_num and base_name_num >= min_num):
        #     shutil.move(infile, dir_name + "\\" + base_name_num_str + ".png")
        # else:
        #     os.remove(infile)
        shutil.move(infile, dir_name + "\\" + str(index) + ".png")

def rename_order_dir3( dir_name):
    if not os.path.isdir(dir_name):
        return
    index = 0
    cur_ani_name = os.path.basename(dir_name)
    cur_model_name = os.path.basename(os.path.dirname(dir_name))
    max_num = 100000
    min_num = -1
    ani_num_data = ani_rename_num.get(cur_model_name)
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

        base_name_num_str = safe_int(base_name_list[len(base_name_list) - 1])
        base_name_num = int(base_name_num_str)
        if (base_name_num <= max_num and base_name_num >= min_num):
            shutil.move(infile, dir_name + "\\" + str(base_name_num_str) + ".png")
        else:
            os.remove(infile)


if __name__ == '__main__':
    # name_list = os.listdir("./head")
    # index = 1
    # for name in name_list:
    #     shutil.copyfile("./head/"+name,"./head1/"+str(index)+".png")
    #     index += 1
    # os.rename()
    # src = os.path.join(os.getcwd(), 'run.py')
    # dst = os.path.join(os.getcwd(), 'newrun.txt')
    rename_order_dir4(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\合图\NewSkillEffect\Attack2_jzplj\attack2")
    exit()

