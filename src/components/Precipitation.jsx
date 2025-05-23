import Card from "@/components/Card";
import {useWeather} from "@/context/WeatherContext";
import {useEffect, useMemo, useState} from "react";
import api from "@/utils/request";
import {Skeleton} from "@/components/ui/skeleton";

const Precipitation = () => {
    const {currentCity} = useWeather();
    const [precipitation, setPrecipitation] = useState(null);
    const [isSupport, setIsSupport] = useState(true);
    useEffect(() => {
        if (!currentCity) return;
        setPrecipitation(null);
        setIsSupport(true);
        api.get(`/v7/minutely/5m?location=${(currentCity.lon * 1).toFixed(2)},${(currentCity.lat * 1).toFixed(2)}`).then(res => {
            setPrecipitation(res.data);
        }).catch(res => {
            if (res.response.status === 400) {
                setIsSupport(false);
            }
        })
    }, [currentCity]);

    const averagePre = useMemo(() => {
        if (!precipitation) return "";
        let num = 0;
        precipitation.minutely.forEach(v => {
            num += v.precip * 1;
        })
        return (num / precipitation.minutely.length).toFixed(4);
    }, [precipitation])

    return (
        <Card
            className="col-span-6 lg:col-span-2 lg:row-start-1 lg:col-start-11 md:col-span-12 md:col-start-7 md:row-start-15 row-span-2 ">
            {
                isSupport ? <>
                    {
                        precipitation ? <>
                            <div className="flex text-[12px] items-center gap-2">
                                <i className="qi-311"></i>
                                <span>降水</span>
                            </div>
                            <div className="flex flex-col text-[12px]">
                                <span className="">{averagePre}mm</span>
                                <span>{precipitation?.summary}</span>
                            </div>
                        </> : <Skeleton className={"w-full h-full"}/>
                    }
                </> : <>
                    <div className="flex text-[12px] items-center gap-2">
                        <i className="qi-311"></i>
                        <span>降水</span>
                    </div>
                    <div className="text-[20px]">该地区不支持查看</div>
                </>
            }
        </Card>
    )
}

export default Precipitation;