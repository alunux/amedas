# -*- coding: utf-8 -*-
import requests
import re
import json

def scrape_amedas_html(url):
    html = requests.get(url).text

    iter = re.compile(r"amedas_link_html_entries\[(\d+)\] = '(.*?)';").finditer(html)

    for match in iter:
        point_id = match.group(1)
        point_table = match.group(2)
        data[point_id] = scrape_amedas_table(point_table)


def scrape_amedas_table(point_table):
    return {
        'name':       get_name(point_table),
        'temp':       get_temp(point_table),
        'rain':       get_rain(point_table),
        'sunlight':   get_sunlight(point_table),
        'snow':       get_snow(point_table),
        'wind_speed': get_wind_speed(point_table),
        'wind_dir':   get_wind_dir(point_table),
    }

def get_name(point_table):
    name_match = re.search(r'<th class="point_name" colspan="2">(.*?)\(.*?\)</th>', point_table)
    return name_match.group(1)
    
def get_temp(point_table):
    temp_match = re.search(u'<tr><th>気温</th><td>(.*?)℃</td></tr>', point_table)
    return float(temp_match.group(1)) if temp_match else None

def get_rain(point_table):
    rain_match = re.search(u'<tr><th>降水量</th><td>(.*?)mm/h</td></tr>', point_table)
    return float(rain_match.group(1)) if rain_match else None

def get_sunlight(point_table):
    sunlight_match = re.search(u'<tr><th>日照時間</th><td>(.*?)分</td></tr>', point_table)
    return int(sunlight_match.group(1)) if sunlight_match else None

def get_snow(point_table):
    snow_match = re.search(u'<tr><th>積雪深</th><td>(.*?)cm</td></tr>', point_table)
    return int(snow_match.group(1)) if snow_match else None

def get_wind_speed(point_table):
    wind_speed_match = re.search(u'<tr><th>風速</th><td>(.*?)m/s</td></tr>', point_table)
    return float(wind_speed_match.group(1)) if wind_speed_match else None

def get_wind_dir(point_table):
    wind_dir_match = re.search(u'<tr><th>風向</th><td>(.*?)</td></tr>', point_table)
    if wind_dir_match:
        wind_dir_jp = wind_dir_match.group(1)
        if wind_dir_jp == u'<span class="grey">---</span>':
            return None

        elif wind_dir_jp == u'静穏':
            return 'calm'

        else:
            return wind_dir_jp.translate({
                ord(u'東'): u'E',
                ord(u'西'): u'W',
                ord(u'南'): u'S',
                ord(u'北'): u'N',
            })
    else:
        return None

if __name__ == '__main__':
    data = {}

    url = "http://www.tenki.jp/amedas/1/3/"
    scrape_amedas_html(url)
    print json.dumps(data, ensure_ascii=False)

