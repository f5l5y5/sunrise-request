# sunrise-request

## vim 操作步骤

1.  存活阶段
    i:插入光标前
    x:删除光标一个字符 X:删除光标前一个字符
    esc-> :wq 保存
    dd 剪切当前行
    yy 复制当前行
    p 粘贴
    u 撤销
    hjkl 左下上右

2.  感觉良好

    1.  各种插入模式

        a:光标后 A:行尾 o:下一行 O:上一行 i:光标前 I:行首

        cw:修改单词先删除直接进入插入,从光标到词尾 cW:改变整个单词 如果有 xxx-xxx 会包括-xxx，cw 不会 ce:修改到单词尾部

    2.  光标移动

        0: 行头

        ^: 文本开头

        $: 文本行尾

        g\_: 本行最后一个不是 blank 字符位置(空格、tab、换行、回车等)

        /pattern: 回车后 按 n/N 向下/向上搜索

    3.  拷贝/粘贴

        p: 粘贴

        yy: 复制一行

            	dd: 删除一行

        v 进入 visual 进行选择复制 y 是复制 p 是删除 d 是剪切

    4.  撤销/重做

        u:撤销

        Ctrl+r: redo

    5.  打开/保存/退出/改变文件

        :e package.json :打开文件
        :saveas xxx 另存为 path/to/file vscode 不支持
        :w 保存文件
        :q! 强制退出 :qa! 退出所有文件
        :x 保存退出 ZZ/:wq
        :bn/:bp 切换下个文件或上个文件

3.  更好、更强、更快

        1.  更好
            重复上次操作：

            1. （.）小数点可以重复上次命令
            2. N<command> 重复某个命令 n 次
               例如：2dd 删除两行 3p 粘贴 3 次 10ihello + esc 插入 10 个 hello 3. 重复 3 次 hello

        2.  更强
            光标移动

                	1. NG 到第N行
                	2. gg 第一行 1G 或者 :1
                	3. G 最后一行
                	4. 单词移动： w/e：下个单词开头/结尾 W/E 区别是blank字符分隔符

                				5. %(/{/[ 光标放在括号上，会移动到匹配括号上  ]})
                				6. */# :匹配光标当前的所在单词上移/下移

            3.  更快
                很多命令可以和移动光标和命令联动<start position><cmd><end position>

                    		例如

        									0y$ 行头 复制 到 行尾  ,

        									y$ 光标处复制到行尾, ye/E 复制单词,

        									y2/foo 拷贝两个foo之间的字符串

        											foo fhausdfhas asfhuasd foo
        											foo fhausdfhas asfhuasd

        									很多时候不是要y才能复制，以下命令也能复制

        									- d 删除
        									- gU 变大写
        									- gu 变小写
        									- v 可视化选择 ,可视化选择是一个很有意思的命令，你可以先按v，然后移动光标，你就会看到文本被选择，然后，你可能d，也可y，也可以变大写等

4.  Vim 超能力

             当前行上移动光标： 0 ^ $ f F t T , ;

           				0 → 到行头
           				^ → 到本行的第一个非blank字符
           				$ → 到行尾
           				g_ → 到本行最后一个不是blank字符的位置。
           				fa → 到下一个为a的字符处，你也可以fs到下一个为s的字符。
           				t, → 到逗号前的第一个字符。逗号可以变成其它字符。
           				3fa → 在当前行查找第三个出现的a。
           				F 和 T → 和 f 和 t 一样，只不过是相反方向。
        						dt- 删除直到遇到-之前的所有内容

    ni-hao
    ni
    NI-HAO JUST FOR FUN
    -- ,NI-HAO JUST FOR FUN
    NI-HAO ，JUST FOR FUN
    ni-hao just for fun
