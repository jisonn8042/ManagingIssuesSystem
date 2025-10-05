const ExcelJS = require("exceljs");

const createAndFillWorkbook = async (taskData) => {
    
    let changeSlash = ["suggested_at", "deadline", "completed_at", "updated_at"];

    for(let i = 0; i < changeSlash.length; i++){
        taskData[changeSlash[i]] = taskData[changeSlash[i]].replace(/-/g, "/");
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("課題管理表");

    worksheet.properties.defaultRowHeight = 78;

    const columnFont = {
        name: "游ゴシック",
        size: 16,
    }

    const titleFont = {
        name: "游ゴシック",
        size: 36,
    }

    const descriptionFont = {
        name: "游ゴシック",
        size: 16,
    }

    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 32;
    worksheet.getColumn(3).width = 72;
    worksheet.getColumn(4).width = 16;
    worksheet.getColumn(5).width = 16;
    worksheet.getColumn(6).width = 16;
    worksheet.getColumn(7).width = 16;
    worksheet.getColumn(8).width = 16;
    worksheet.getColumn(9).width = 16;
    worksheet.getColumn(10).width = 72;
    worksheet.getColumn(11).width = 16;
    worksheet.getColumn(12).width = 16;
    worksheet.getColumn(13).width = 16;
    worksheet.getColumn(14).width = 16;
    
    worksheet.getColumn(1).alignment = {
        horizontal: "left",
        vertical: "middle",
    }
    worksheet.getCell("A2").alignment = {
        horizontal: "right",
        vertical: "middle",
    }

    worksheet.getColumn(2).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(3).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(4).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(5).alignment = {
        horizontal: "right",
        vertical: "middle",
    }

    worksheet.getColumn(6).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(7).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(8).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(9).alignment = {
        horizontal: "right",
        vertical: "middle",
    }

    worksheet.getColumn(10).alignment = {   
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(11).alignment = {
        horizontal: "right",
        vertical: "middle",
    }

    worksheet.getColumn(12).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getColumn(13).alignment = {
        horizontal: "right",
        vertical: "middle",
    }

    worksheet.getColumn(14).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.getRow(1).alignment = {
        horizontal: "left",
        vertical: "middle",
    }
    
    worksheet.getRow(2).alignment = {
        horizontal: "left",
        vertical: "middle",
    }

    worksheet.mergeCells("A1", "N1");
    worksheet.getCell("A1").value = "課題管理表";
    worksheet.getCell("A1").font = titleFont;


    worksheet.addTable({
        name: 'MyTable',
        ref: 'A2',
        headerRow: true,
        totalsRow: false,
        style: {
            showRowStripes: true,
            showColumnStripes: true,
        },
        columns: [
            {name: "番号", filterButton: true},
            {name: "タイトル", filterButton: true},
            {name: "課題内容", filterButton: true},
            {name: "起票者", filterButton: true},
            {name: "起票日", filterButton: true},
            {name: "ステータス", filterButton: true},
            {name: "担当者", filterButton: true},
            {name: "優先度", filterButton: true},
            {name: "期間日", filterButton: true},
            {name: "対応内容", filterButton: true},
            {name: "完了日", filterButton: true},
            {name: "更新者", filterButton: true},
            {name: "更新日", filterButton: true},
            {name: "備考", filterButton: true},
        ],
        rows: [
            [
                taskData.task_id,
                taskData.title,
                taskData.task_description,
                taskData.suggested_by,
                taskData.suggested_at,
                taskData.status,
                taskData.assigned_to,
                taskData.priority,
                taskData.deadline,
                taskData.action_description,
                taskData.completed_at,
                taskData.updated_by,
                taskData.updated_at,
                taskData.note,
            ]
        ],
    });
    
    worksheet.getRow(1).font = titleFont;
    worksheet.getRow(2).font = columnFont;
    worksheet.getRow(3).font = descriptionFont;
    
    let fillRow = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

    for(let i = 0; i < fillRow.length; i++){
        worksheet.getCell(`${fillRow[i]}2`).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'F2F2F2'},
        };
    };

    for(let i = 0; i < fillRow.length; i++){
        worksheet.getCell(`${fillRow[i]}3`).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'D9D9D9'},
        };
    };

    worksheet.getRow(2).border = {
        top: {style:'thin', color: {argb:'D9D9D9'}},
        left: {style:'thin', color: {argb:'D9D9D9'}},
        bottom: {style:'thin', color: {argb:'D9D9D9'}},
        right: {style:'thin', color: {argb:'D9D9D9'}}
    };

    worksheet.getRow(3).border = {
        top: {style:'thin', color: {argb:'D9D9D9'}},
        left: {style:'thin', color: {argb:'D9D9D9'}},
        bottom: {style:'thin', color: {argb:'D9D9D9'}},
        right: {style:'thin', color: {argb:'D9D9D9'}}
    };

    return workbook;

}



module.exports = createAndFillWorkbook;
