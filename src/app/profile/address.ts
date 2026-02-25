import { useEffect, useState } from "react";

interface Province {
    name: string;
    code: number;
}
interface District {
    name: string;
    code: number;
}
interface Ward {
    name: string;
    code: number;
}

export function useAddress() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [provinceCode, setProvinceCode] = useState<number | null>(null);
    const [districtCode, setDistrictCode] = useState<number | null>(null);
    const [wardCode, setWardCode] = useState<number | null>(null);

    const [addressText, setAddressText] = useState("");

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/v1/")
            .then(res => res.json())
            .then(setProvinces);
    }, []);

    useEffect(() => {
        if (!provinceCode) return;

        fetch(`https://provinces.open-api.vn/api/v1/p/${provinceCode}?depth=2`)
            .then(res => res.json())
            .then(data => {
                setDistricts(data.districts);
                setWards([]);
                setDistrictCode(null);
                setWardCode(null);
            });
    }, [provinceCode]);

    useEffect(() => {
        if (!districtCode) return;

        fetch(`https://provinces.open-api.vn/api/v1/d/${districtCode}?depth=2`)
            .then(res => res.json())
            .then(data => {
                setWards(data.wards);
                setWardCode(null);
            });
    }, [districtCode]);

    useEffect(() => {
        const province = provinces.find(p => p.code === provinceCode)?.name;
        const district = districts.find(d => d.code === districtCode)?.name;
        const ward = wards.find(w => w.code === wardCode)?.name;

        setAddressText([ward, district, province].filter(Boolean).join(", "));
    }, [provinceCode, districtCode, wardCode]);

    return {
        provinces,
        districts,
        wards,
        provinceCode,
        districtCode,
        wardCode,
        setProvinceCode,
        setDistrictCode,
        setWardCode,
        addressText,
    };
}
