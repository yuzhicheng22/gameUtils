package main

import (
	"fmt"
	"os/exec"
	"runtime"
)

var commands = map[string]string{
	"windows": "start",
	"darwin":  "open",
	"linux":   "xdg-open",
}

func OpenCmd(uri string) error {
	run, ok := commands[runtime.GOOS] //获取平台信息
	if !ok {
		return fmt.Errorf("don't know how to open things on %s platform", runtime.GOOS)
	}
	if run == "start" {
		cmd := exec.Command("cmd", `/c`, run, uri)
		return cmd.Start()
	} else {
		cmd := exec.Command(run, uri)
		return cmd.Start()
	}

}

//func main() {
//	err := OpenCmd("http://baidu.com")
//	if err != nil {
//		println("Error:", err.Error())
//	}
//	//err := exec.Command(`cmd`, `/c`, `start`, `E:\project\projectTjp\tjp-client-old\code\client\XianWu_YL\打包流程.doc`).Start()
//	//if err != nil {
//	//	println("Error:", err.Error())
//	//}
//	// Open("./abc.jpg")  // 打开图片
//}
