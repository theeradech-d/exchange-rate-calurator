import Locale from "../../libs/locale";
import formidable, { File } from "formidable";
import { promises as fs } from "fs";
import path from "path";
import * as XLSX from "xlsx/xlsx.mjs";
import moment from "moment";
import "moment/locale/th";
import knex from "../../libs/dbconnect";

moment.locale("th");

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const locale = req.query.locale;
        const files = await new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            const files = [];
            form.on("file", function (field, file) {
                files.push([field, file]);
            });
            form.on("end", () => resolve(files));
            form.on("error", (err) => reject(err));
            form.parse(req, () => {
                //
            });
        }).catch((e) => {
            console.log(e);
            status = 500;
            resultBody = {
                status: "fail",
                message: "Upload error",
            };
        });

        let fileName = "";

        if (files?.length) {
            /* Create directory for uploads */
            const targetPath = path.join(process.cwd(), `/uploads/`);
            try {
                await fs.access(targetPath);
            } catch (e) {
                await fs.mkdir(targetPath);
            }

            /* Move uploaded files to directory */
            for (const file of files) {
                const tempPath = file[1].filepath;
                await fs.rename(
                    tempPath,
                    targetPath + file[1].originalFilename
                );

                fileName = targetPath + file[1].originalFilename;
            }
        }

        console.log("file", files);

        const buf = await fs.readFile(fileName);

        var workbook = XLSX.read(buf);

        let data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            {
                header: 1,
            }
        );

        console.log("data", data);

        let ps = data.map(async (row, index) => {
            if (index == 0) {
                console.log(row);
            } else if (index >= 7) {
                let date = row[0];
                let year = moment(row[0], "DD MMM YYYY")
                    .subtract(543, "year")
                    .format("YYYY");
                let dateFormat = moment(row[0], "DD MMM YYYY").year(year);
                let rate_1 = row[1];
                let rate_2 = row[2];
                let rate_3 = row[3];

                try {
                    let found = await knex
                        .first("*")
                        .from("exchange_rates")
                        .where("date", dateFormat.format("YYYY-MM-DD"))
                        .where("locale", locale);

                    console.log({
                        found,
                        date,
                        dateFormat,
                        locale,
                        rate_1,
                        rate_2,
                        rate_3,
                    });
                    
                    if (!found) {
                        let result = await knex("exchange_rates").insert({
                            date: dateFormat.format("YYYY-MM-DD"),
                            locale,
                            rate_1,
                            rate_2,
                            rate_3,
                        });
                        console.log("create");
                    } else {
                        await knex("exchange_rates")
                            .update({
                                rate_1,
                                rate_2,
                                rate_3,
                            })
                            .where({ id: found.id });
                        console.log("update");
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            return true;
        });

        await Promise.all(ps);

        await fs.unlink(fileName);

        res.status(200).json({
            locale,
        });

        return;
    } else if (req.method === "GET") {
        const locale = req.query.locale;
        let query = knex
            .select("*")
            .from("exchange_rates")
            .orderBy("date", "asc");
        if (locale) {
            query.where("locale", locale);
        }
        let data = await query;

        res.status(200).json({
            locale,
            data,
        });
    }
}
