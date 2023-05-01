const express = require("express");

const db = require("./../modules/db_connect");

const router = express.Router();
router.use(express.json());

const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const querystring = require('querystring');

router.use(bodyParser.json()); // 解析 JSON request body
router.use(bodyParser.urlencoded({ extended: true })); // 解析 URL-encoded request body


//上傳圖片
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/images/community');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const newFileName = `${uuidv4()}${ext}`;
        cb(null, newFileName);
    },
});

const upload = multer({ storage });

router.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('後端：', req.file.filename)
    res.send(req.file.filename);
});


router.use((req, res, next) => {

    next();
});

//文章分頁
const getListData = async (req, res) => {
    let redirect = "";
    // 一頁有幾筆
    const perPage = 5;
    // 當前頁數 
    let page = +req.query.page || 1;
    //-----篩選&排序&檢索------
    let queryObj = {};
    let sqlOrder = "";
    let sqlWhere = ' WHERE 1 '; // 條件式的開頭
    let search = req.query.search;
    let orderTime = req.query.orderTime
    let orderHot = req.query.orderHot

    //關鍵字搜尋
    if (search && search.trim()) {
        search = search.trim(); // 去掉頭尾空白

        const searchEsc = db.escape('%' + search + '%');
        sqlWhere += ` AND \`community_header\` LIKE ${searchEsc} `;
        queryObj = { ...queryObj, search }
    }

    if (orderTime) {
        switch (orderTime) {
            case 'false':
                queryObj = { ...queryObj, orderTime };
                sqlOrder = ` ORDER BY community_created_at DESC`;
                break;
            case 'true':
                queryObj = { ...queryObj, orderTime };
                sqlOrder = ` ORDER BY community_created_at ASC`;
                break;
            case "undefined":
                queryObj = { ...queryObj, orderTime };
                sqlOrder = ` ORDER BY community_created_at DESC`;
                break;
        }
    } else {
        sqlOrder = ` ORDER BY community_created_at DESC`;
    }

    // if (orderHot) {
    //     switch (orderHot) {
    //         case 'false':
    //             queryObj = { ...queryObj, orderTime };
    //             sqlOrder = ` ORDER BY total_reply DESC`;
    //             break;
    //         case 'true':
    //             queryObj = { ...queryObj, orderTime };
    //             sqlOrder = ` ORDER BY total_reply ASC`;
    //             break;
    //     }
    // }



    page = parseInt(page);

    if (page < 1) {
        redirect = req.baseUrl; // 設定要轉向的 URL
    }
    // 總筆數
    const [[{ totalRows }]] = await db.query(
        `SELECT COUNT(1) AS totalRows FROM community ${sqlWhere} ${sqlOrder} `
    );

    // 總頁數
    const totalPages = Math.ceil(totalRows / perPage);
    let rows = [];
    if (totalRows > 0) {
        if (page > totalPages) {
            redirect = req.baseUrl + "?page=" + totalPages;
        }
        const sql = `SELECT * FROM \`community\` ${sqlWhere} ${sqlOrder}  LIMIT 
      ${(page - 1) * perPage} , ${perPage} `;

        [rows] = await db.query(sql);
    }

    //取得所有文章列表(包含回應總數)
    let CMA = []

    // SELECT c.*, cm.community_sid, members.sid, members.member_name, COUNT(cm.community_sid) AS total_reply
    // FROM community c
    // LEFT JOIN community_message cm ON c.sid = cm.community_sid
    // LEFT JOIN members ON members.sid = c.member_sid
    // GROUP BY c.sid;



    const sql1 = `SELECT community.*, community_message.community_sid, members.member_name, members.member_img, COUNT(community_message.community_sid) AS total_reply FROM community community LEFT JOIN community_message  ON community.sid = community_message.community_sid LEFT JOIN members ON members.sid = community.member_sid ${sqlWhere} GROUP BY community.sid  ${sqlOrder} LIMIT ${(page - 1) * perPage}, ${perPage}`;

    // const sql1 = `SELECT community.* , members.member_name, members.member_img FROM \`community\` LEFT JOIN members ON  members.sid = community.member_sid ${sqlWhere} ${sqlOrder}
    //   LIMIT ${(page - 1) * perPage}, ${perPage}`;
    [CMA] = await db.query(sql1);
    console.log(sql1)
    console.log(req.query)


    //取得該篇文章的按讚數
    // let communitylike = []
    // const sql2 = `SELECT COUNT(1) AS totalL FROM \`community\` JOIN community_liked ON  community.sid = community_liked.community_liked WHERE community.member_sid`;
    // [communitylike] = await db.query(sql2);
    // cmlike = communityA.map((v, i) => {
    //     return { ...v, like:communitylike }
    // })

    return {
        page,
        perPage,
        totalRows,
        totalPages,
        CMA,
        queryObj,
    };
}

const getMyCommunityData = async (req, res) => {
    // const perPage = 5;
    // let page = +req.query.page || 1;
    // let totalPagesP;
    // let totalPagesL;
    // let totalP;
    let mycommunity = [];
    const { sid } = req.params; // 從路徑參數中取得 sid
    // 有登入 

    // 我的文章總筆數
    // [totalP ] = await db.query(
    //     `SELECT COUNT(1) AS totalP FROM community WHERE \`member_sid\` = 163`
    // );
    // 文章總頁數
    // totalPagesP = Math.ceil(totalP / perPage);

    try {
        const sql = `SELECT * FROM \`community\` WHERE \`member_sid\` = ? ORDER BY community_created_at DESC`; // 使用佔位符，避免 SQL 注入攻擊
        const [rows] = await db.query(sql, [sid]); // 執行 SQL 查詢，使用 sid 作為參數
        mycommunity = rows; // 取得查詢結果
        return {
            mycommunity,
        };
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

    

    // return {
    //     // page,
    //     // totalP,
    //     // totalPagesP,
    //     // totalPagesL,
    //     mycommunity,
    // };
}


const getoneCommunityData = async (req, res) => {
    let row = []
    const sql4 = `SELECT community.* , members.member_name, members.member_img FROM \`community\` LEFT JOIN members ON  members.sid = community.member_sid WHERE community.\`sid\` = ${req.params.sid} `;
    [row] = await db.query(sql4);

    return {
        row
    }
}

const getoneCommunityReply = async (req, res) => {
    let row21 = []
    let row22 = []
    const sql5 =
        `SELECT community_message.* , members.member_name, members.member_img FROM \`community_message\` 
LEFT JOIN members on community_message.member_sid = members.sid WHERE community_message.community_sid = ${req.params.sid} ORDER BY message_created_at DESC `;
    [row21] = await db.query(sql5);
    const sqls = `SELECT COUNT(community_message.community_like) AS CMlike FROM community_message WHERE community_sid = ${req.params.sid} ORDER BY message_created_at DESC`;
    [row22] = await db.query(sqls)

    let row2 = [...row21]

    return {
        row2
    }
}



//API路由
router.get("/", (req, res) => {
    res.send("討論區API");
});

//取得所有討論區資料
router.get("/api", async (req, res) => {
    res.json(await getListData(req));
});

//關鍵字搜尋文章標題
router.get('/api/search', (req, res) => {
    // 獲取關鍵字參數
    const search = req.query.search;

    // 編寫SQL預處理語句
    const sql = `SELECT community.* , members.member_name, members.member_img FROM \`community\` LEFT JOIN members ON  members.sid = community.member_sid WHERE community_header LIKE ?`;
    const searchTermLike = `%${search}%`;


    // 執行SQL查詢
    db.query(sql, [searchTermLike], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.get('/data', async (req, res) => {
    // 獲取關鍵字參數
    const search = req.query.search;

    // 編寫參數化的 SQL 語句
    const sql = `SELECT community.* , members.member_name, members.member_img FROM \`community\` LEFT JOIN members ON  members.sid = community.member_sid WHERE community_header LIKE ?`;

    // 執行 SQL 查詢
    const [results] = await db.query(sql, [`%${search}%`]);

    res.json(results);
});


//文章單頁資料
router.get("/:sid", async (req, res) => {
    res.json(await getoneCommunityData(req));
});

//會員所有文章
router.get("/api/myartical/:sid", async (req, res) => {
    res.json(await getMyCommunityData(req));
});

//文章留言
router.get("/reply/:sid", async (req, res) => {

    res.json(await getoneCommunityReply(req));
});

//新增文章留言
router.post("/sent", async (req, res) => {
    let {
        community_sid,
        member_sid,
        message,


    } = req.body;

    // const member_address_1 = city + district + zipcode + fulladdress;

    const sql =
        "INSERT INTO \`community_message\`(`community_sid`, `member_sid`, `message`) VALUES (?,?,?)";
    const [result] = await db.query(sql, [
        community_sid,
        member_sid,
        message

    ]);


    res.json({
        success: !!result.affectedRows,
        postData: req.body,
        result,
    });

})

router.post("/delete", async (req, res) => {
    let {
        sid
    } = req.body;

    const output = {
        success: false,
        error: "",
    };
    if (res.locals.bearer.sid && res.locals.bearer.account) {
        // 有登入
        const sql = `DELETE FROM community_message WHERE sid=?`;
        const [result] = await db.query(sql, [
            sid
        ]);
        output.success = !!result.affectedRows;
        output.error = output.success ? "" : "刪除發生錯誤";
    } else {
        // 沒登入
        output.error = `沒有權限做刪除`;
    }
    res.json(output);
});



//新增文章
router.post('/new/api', async (req, res) => {
    let {
        member_sid,
        title,
        message,
        url
    } = req.body;

    const sql = "INSERT INTO \`community\`(`member_sid`,`community_picture1`,`community_header`, `community_contain`) VALUES (?,?,?,?)";
    const [result] = await db.query(sql, [
        member_sid,
        url,
        title,
        message
    ]);

    res.json({
        success: !!result.affectedRows,
        postData: req.body,
        result,

    });
})





module.exports = router;