import Locale from "../../libs/locale";

export default async function handler(req, res) {
    res.status(200).json(Locale);
}
