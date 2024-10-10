package main

import (
	"context"
	"fmt"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	goruntime "runtime"
	"time"
)

type FileParts struct {
	Dir       string
	Name      string
	Extension string
}

type FileInfo struct {
	Dir       string
	Name      string
	Extension string
	IsDir     bool
	Size      int64
	Modtime   string
	Index     int
	Mode      fs.FileMode
	Link      bool
}

// App struct
type App struct {
	ctx context.Context
	err string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetError() string {
	return a.err
}

func closeFile(file *os.File) {
	err := file.Close()
	if err != nil {

	}
}

func (a *App) OpenFile(path string) string {
	file, err := os.OpenFile(path, os.O_RDONLY, 0)
	if err != nil {
		return err.Error()
	}
	defer closeFile(file)
	content, err := io.ReadAll(file)
	if err != nil {
		return err.Error()
	}
	return string(content)
}

func (b *App) ReadFile(path string) string {
	b.err = ""
	contents, err := os.ReadFile(path)
	if err != nil {
		b.err = err.Error()
	}
	return string(contents[:])
}
func (b *App) ReadFileB(path string) []byte {
	b.err = ""
	contents, err := os.ReadFile(path)
	if err != nil {
		b.err = err.Error()
	}
	return contents[:]
}
func (b *App) WriteFile(path string, data string) string {
	err := os.WriteFile(path, []byte(data), 0666)
	if err != nil {
		b.err = err.Error()
		return b.err
	}
	return "ok"
}

func (b *App) DirExists(path string) bool {
	b.err = ""
	dstat, err := os.Stat(path)
	if err != nil {
		b.err = err.Error()
		return false
	}
	return dstat.IsDir()
}

func (b *App) FileExists(path string) bool {
	b.err = ""
	dstat, err := os.Stat(path)
	if err != nil {
		b.err = err.Error()
		return false
	}
	return !dstat.IsDir()
}

func (b *App) SplitFile(path string) FileParts {
	b.err = ""
	var parts FileParts
	parts.Dir, parts.Name = filepath.Split(path)
	parts.Extension = filepath.Ext(path)
	return parts
}

func (a *App) SaveFile(path string, content string) string {
	file, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, os.ModeAppend|os.ModePerm)
	if err != nil {
		return err.Error() + "1"
	}
	defer closeFile(file)
	_, err = file.WriteString(content)
	if err != nil {
		return err.Error()
	}
	return "ok"
}

func (b *App) ReadDir(path string) []FileInfo {
	b.err = ""
	var result []FileInfo
	result = make([]FileInfo, 0, 0)
	files, err := ioutil.ReadDir(path)
	if err != nil {
		b.err = err.Error()
	} else {
		for index, file := range files {
			var fileInfo FileInfo
			fileInfo.Name = file.Name()
			fileInfo.Size = file.Size()
			fileInfo.IsDir = file.IsDir()
			fileInfo.Modtime = file.ModTime().Format(time.ANSIC)
			fileInfo.Dir = path
			fileInfo.Extension = filepath.Ext(file.Name())
			fileInfo.Index = index
			fileInfo.Mode = file.Mode().Perm()
			fileInfo.Link = false

			//
			// Determine if it is a symlink and if so if it's a directory.
			//
			if file.Mode()&fs.ModeSymlink.Type() != 0 {
				fileInfo.Link = true
				link, err := os.Readlink(b.AppendPath(path, fileInfo.Name))
				if err == nil && b.DirExists(link) {
					fileInfo.IsDir = true
				}
			}

			//
			// Add it to the rest.
			//
			result = append(result, fileInfo)
		}
	}
	return result
}

func (b *App) MakeDir(path string) {
	b.err = ""
	err := os.MkdirAll(path, 0755)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) MakeFile(path string) {
	b.err = ""
	b.WriteFile(path, "")
}

func (b *App) MoveEntries(from string, to string) {
	b.err = ""
	err := os.Rename(from, to)
	if err != nil {
		b.err = err.Error()
	}
}

func (b *App) RenameEntry(from string, to string) {
	b.err = ""
	err := os.Rename(from, to)
	if err != nil {
		b.err = err.Error()
	}
}
func (b *App) AppendPath(dir string, name string) string {
	return filepath.Join(dir, name)
}

func (b *App) StartFile(path string) string {
	err := OpenCmd(path)
	if err != nil {
		return err.Error()
	}
	return "ok"
}
func (b *App) Quit() {
	rt.Quit(b.ctx)
}

func (b *App) GetOSName() string {
	os := goruntime.GOOS
	result := ""
	switch os {
	case "windows":
		result = "windows"
		break
	case "darwin":
		result = "macos"
	case "linux":
		result = "linux"
	default:
		result = fmt.Sprintf("%s", os)
	}
	return result
}

func (b *App) OpenExcelFile(dir string) []string {
	var options rt.OpenDialogOptions
	options.DefaultDirectory = dir
	options.ShowHiddenFiles = false
	options.CanCreateDirectories = false
	options.Title = "打开文件"
	var filters []rt.FileFilter
	filters = append(filters, rt.FileFilter{DisplayName: "*.xlsx", Pattern: "*.xlsx"})
	options.Filters = filters
	fileList, err := rt.OpenMultipleFilesDialog(b.ctx, options)
	if err != nil {
		b.err = err.Error()
		return nil
	}
	return fileList

}
