import Head from "next/head";
import styles from "../../styles/ExchangeRate.module.scss";
import Spreadsheet from "react-spreadsheet";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Result, Spin, Tabs } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import moment from "moment";
import "moment/locale/th";
moment.locale("th");

export default function ExchangeRate() {
    const inputFileRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [locales, setLocales] = useState([]);
    const [locale, setLocale] = useState("USD");
    const [items, setItems] = useState([]);

    const columns = [
        {
            title: "สกุลเงิน",
            dataIndex: "locale",
            key: "locale",
            align: "center",
        },
        {
            title: "วันที่",
            dataIndex: "date",
            key: "date",
            align: "center",
            render(value) {
                return moment(value).add(543, "year").format("DD MMM YYYY");
            },
        },
        {
            title: "ตั๋วเงิน",
            dataIndex: "rate_1",
            key: "rate_1",
            align: "right",
        },
        {
            title: "เงินโอน",
            dataIndex: "rate_2",
            key: "rate_2",
            align: "right",
        },
        {
            title: "อัตราขายถัวเฉลี่ย",
            dataIndex: "rate_3",
            key: "rate_3",
            align: "right",
        },
    ];

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        getItems();
    }, [locale]);

    async function initData() {
        try {
            let res = await axios.get("/api/locale");
            setLocales(res.data);
        } catch (error) {}
    }

    async function getItems() {
        try {
            let res = await axios
                .get("/api/exchange-rate", {
                    params: {
                        locale,
                    },
                })
                .then((res) => res.data);
            setItems(res.data);
        } catch (error) {}
        setLoading(false);
    }

    function onChangeTab(data) {
        setLocale(data);
    }

    const onBtnClick = () => {
        /*Collecting node-element and performing click*/
        inputFileRef.current.click();
    };

    const onClickClearBtn = () => {
        Modal.confirm({
            title: "ยืนยันการลบ",
            async onOk() {
                console.log("OK");

                try {
                    setLoading(true);

                    await axios.delete("/api/exchange-rate", {
                        params: {
                            locale,
                        },
                    });
                } catch (error) {}

                getItems();
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const onFileChange = async (e) => {
        setLoading(true);

        try {
            var formData = new FormData();
            formData.append("file", e.target.files[0]);
            await axios.post("/api/exchange-rate", formData, {
                params: {
                    locale,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Modal.success({
                content: "อัพโหลดสำเร็จ",
            });
        } catch (error) {
            Modal.success({
                content: "เกิดข้อผิดพลาด",
            });
        }

        e.target.value = null;

        getItems();
    };

    return (
        <div className="p-2">
            {/* <pre>{JSON.stringify(locales, null, 2)}</pre> */}
            <Tabs
                centered
                defaultActiveKey="USD"
                onChange={onChangeTab}
                items={locales.map((_, i) => {
                    return {
                        label: _.label,
                        key: _.value,
                        children: (
                            <>
                                <input
                                    type="file"
                                    ref={inputFileRef}
                                    onChange={onFileChange}
                                    style={{ display: "none" }}
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                                {items.length == 0 && loading == true && (
                                    <div className="text-center mt-4">
                                        <Spin />
                                    </div>
                                )}
                                {items.length == 0 && loading == false && (
                                    <Result
                                        icon={<SmileOutlined />}
                                        title="Import Data"
                                        extra={
                                            <Button
                                                type="primary"
                                                onClick={onBtnClick}
                                            >
                                                Import
                                            </Button>
                                        }
                                    />
                                )}
                                {items.length > 0 && (
                                    <>
                                        <div className="text-end mb-4">
                                            <Button
                                                type="primary"
                                                onClick={onBtnClick}
                                                className="mx-2"
                                            >
                                                Import
                                            </Button>
                                            <Button
                                                type="danger"
                                                onClick={onClickClearBtn}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                        <Table
                                            dataSource={items}
                                            columns={columns}
                                            loading={loading}
                                        />
                                    </>
                                )}
                            </>
                        ),
                    };
                })}
            />
        </div>
    );
}
