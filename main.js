/**
 * Created by xujian1 on 2018/10/4.
 */

const { app, BrowserWindow, ipcMain, clipboard} = require('electron')
const { useCapture } = require('./lib/capture-main')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {

    // 初始化截图
    useCapture()

    // 创建浏览器窗口。
    win = new BrowserWindow({ width: 500, height: 800 })

    // 然后加载应用的 index.html。
    win.loadFile('index.html')

    // 打开开发者工具
    win.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

    ipcMain.on('image', (e, {url,w,h})=>{
        win.webContents.send('getImg', {url,w,h})
    })
       
    ipcMain.on('capture-clean', (e, )=>{
        win.webContents.send('getImg', {url:'',w:0,h:0})
    })
       
    ipcMain.on("clipboard", (e, formula)=>{
        clipboard.writeText(formula)
    })

    ipcMain.on("show", (e)=>{
        // console.log("focus")
        win.show()
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
})



