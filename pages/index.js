import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Spreadsheet from "react-spreadsheet";
import { useState } from "react";

export default function Home() {
    const [data, setData] = useState([]);

    function onChangeTable(data) {
        setData(data);
    }

    return (
        <div>
            Exchange Rate Calurator
        </div>
    );
}
