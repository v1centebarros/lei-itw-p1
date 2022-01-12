from bs4 import BeautifulSoup
import cssutils
import requests
import json

data = json.load(open("titles.json"))
def fetch_image_url (titleId):
    try:
        url = f'https://www.netflix.com/title/{titleId}'
        r = requests.get(url)
        html = r.text
        soup = BeautifulSoup(html, 'lxml')
        div_styles = soup.find('div', {'class': 'hero-image-mobile'})["style"]

        styles = cssutils.parseStyle(div_styles)
        img_url = styles["background-image"]
        img_url = img_url.replace('url(', '').replace(')', '')

        return {"id":titleId,"img_url":img_url}
    except Exception:
        print(f"Falhou a sacar o {titleId}")
        return {"id":titleId,"img_url":" "}

finalData = []
for t in data:
    tmp = fetch_image_url(t)
    print(tmp)
    finalData.append(tmp)


with open("imagens.json","w") as jFile:
    json.dump(finalData,jFile)