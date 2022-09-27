import Head from "next/head";
import styles from "../../styles/ExchangeRateCalculator.module.scss";
import Spreadsheet from "react-spreadsheet";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Result, Spin, Tabs } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Table } from "antd";
import moment from "moment";
import "moment/locale/th";
import _ from "lodash";
moment.locale("th");

export default function ExchangeRateCalculator() {
    const inputFileRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dataSave, setDataSave] = useState([]);
    const [exchangeRates, setExchangeRates] = useState([]);

    useEffect(() => {
        initData();
    }, []);

    async function initData() {
        let res = await axios.get("/api/exchange-rate").then((res) => res.data);
        setExchangeRates(res.data);

        let data = [
            [
                { value: "สกุลเงิน" },
                { value: "วันที่ #1" },
                { value: "วันที่ #2" },
                { value: "อัตราแลกเปลี่ยน #1" },
                { value: "อัตราแลกเปลี่ยน #2" },
                { value: "อัตราแลกเปลี่ยน ณ วันที่ #1" },
                { value: "อัตราแลกเปลี่ยน ณ วันที่ #2" },
            ],
        ];
        for (let index = 0; index < 100; index++) {
            data.push([
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
            ]);
        }
        setData(data);
    }

    function getExchangeRateByDate(dateMoment, locale){
        let _dateMoment = dateMoment
        let exchangeRate = null

        for (let index = 0; index < 100; index++) {
            exchangeRate = exchangeRates.find(
                (o) =>
                    o.date == _dateMoment.format("YYYY-MM-DD") &&
                    o.locale == locale
            );
            console.log({
                date: _dateMoment.format("YYYY-MM-DD"),
                locale,
                exchangeRate: exchangeRate ? true : false
            })
            if(exchangeRate){
                exchangeRate.dateMoment = moment(exchangeRate.date)
            }
            if(!exchangeRate){
                _dateMoment.subtract(1, "day")
            }
        }

        return  exchangeRate 
    }

    function calExchangeRate(row) {
        let locale = row[0].value;
        let date1 = row[1].value;
        let date2 = row[2].value;

        let exchangeRate1 = null;
        let exchangeRate2 = null;
        let date1Moment = null;
        let date2Moment = null;

        let exchangeRateDate1 = null;
        let exchangeRateDate2 = null;

        try {
            moment.locale("en");
            if (date1) {
                date1Moment = moment(date1, "DD-MMM-YY");
                exchangeRate1 = getExchangeRateByDate(date1Moment, locale)
                if (exchangeRate1) {
                    exchangeRateDate1 = exchangeRate1.dateMoment.format("DD-MMM-YY")
                }
            }

            if (date2) {
                date2Moment = moment(date2, "DD-MMM-YY");
                exchangeRate2 = getExchangeRateByDate(date2Moment, locale)
                if (exchangeRate2) {
                    exchangeRateDate2 = exchangeRate2.dateMoment.format("DD-MMM-YY")
                }
            }
        } catch (error) {
            console.log(error)
        }

        row = [
            { value: row[0].value },
            { value: row[1].value },
            { value: row[2].value },
            { value: exchangeRate1?.rate_2 },
            { value: exchangeRate2?.rate_3 },
            { value: exchangeRateDate1 },
            { value: exchangeRateDate2 },
        ];
        // row[1] = "xxx"
        // row[2] = "xxx"
        // row[3] = "xxx"
        return row;
    }

    const cal = _.debounce(function (data) {
        data = data.map((row, i) => {
            if (i > 0) {
                row = calExchangeRate(row);
            }
            return row;
        });
        setData(data);
    }, 500);

    function onChangeTable(data) {
        if (data) {
            cal(data);
        }
    }

    return (
        <div className="p-2">
            {/* <pre>{JSON.stringify(locales, null, 2)}</pre> */}
            <Spreadsheet data={data} onChange={onChangeTable} />
        </div>
    );
}
